import type { ProjectAgreementInput } from '@/lib/agreements/project-agreement-input';
import { mergeAiAgreementContent, type AiAgreementContent } from '@/lib/agreements/agreement-ai-normalizer';
import { generateProjectAgreementDraftFromInput } from '@/lib/agreements/project-agreement-draft';

interface OpenRouterChatResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

const DEFAULT_OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_OPENROUTER_MODEL = 'nex-agi/nex-n2-pro:free';
const DEFAULT_OPENROUTER_TIMEOUT_MS = 30000;
const DEFAULT_OPENROUTER_MAX_TOKENS = 700;

function getNumberEnv(name: string, fallback: number) {
  const value = process.env[name];
  const parsedValue = value ? Number.parseInt(value, 10) : Number.NaN;

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function buildAgreementPrompt(input: ProjectAgreementInput) {
  return [
    'Draft a concise renovation services agreement for BuildMatch.',
    'Use only the project details below. Do not invent missing facts.',
    'This is not legal advice.',
    'Return JSON only with contractSections, developerSummary, contractorSummary, riskFlags, and missingInfo.',
    'Create exactly 5 contractSections: Project Scope, Contract Price, Payment Milestones, Change Orders, Signature Readiness.',
    'Create exactly 2 developerSummary items, 2 contractorSummary items, and 2 riskFlags.',
    'Each riskFlags item must include title, description, and severity as low, medium, or high.',
    '',
    `Template: ${input.template.name} v${input.template.version}`,
    `Template review status: ${input.template.reviewStatus}`,
    `Project title: ${input.title}`,
    `Project description: ${input.scopeDescription}`,
    `Trade type: ${input.tradeType}`,
    `Location: ${input.location}`,
    `Accepted bid: ${input.contractAmount}`,
    `Accepted bid id: ${input.bidId ?? 'missing'}`,
    `Developer: ${input.parties.developer.name}`,
    `Contractor: ${input.parties.contractor.name}`,
  ].join('\n');
}

function extractJsonObject(content: string) {
  const startIndex = content.indexOf('{');
  const endIndex = content.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error('OpenRouter response did not include a JSON object.');
  }

  return JSON.parse(content.slice(startIndex, endIndex + 1)) as AiAgreementContent;
}

function mergeOpenRouterContent(input: ProjectAgreementInput, content: AiAgreementContent) {
  const fallback = generateProjectAgreementDraftFromInput(input);
  return mergeAiAgreementContent(content, fallback);
}

async function requestOpenRouterDraft(input: ProjectAgreementInput) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set.');
  }

  const baseUrl = process.env.OPENROUTER_BASE_URL ?? DEFAULT_OPENROUTER_BASE_URL;
  const model = process.env.OPENROUTER_MODEL ?? DEFAULT_OPENROUTER_MODEL;
  const timeoutMs = getNumberEnv('OPENROUTER_TIMEOUT_MS', DEFAULT_OPENROUTER_TIMEOUT_MS);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'http://localhost:8102',
        'X-Title': process.env.OPENROUTER_APP_NAME ?? 'BuildMatch',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_tokens: getNumberEnv('OPENROUTER_MAX_TOKENS', DEFAULT_OPENROUTER_MAX_TOKENS),
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Return compact valid JSON only. Do not include markdown or extra commentary.',
          },
          {
            role: 'user',
            content: buildAgreementPrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`OpenRouter request failed with HTTP ${response.status}. ${errorBody}`.trim());
    }

    const data = (await response.json()) as OpenRouterChatResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenRouter response did not include message content.');
    }

    return {
      model,
      draft: mergeOpenRouterContent(input, extractJsonObject(content)),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`OpenRouter request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAgreementDraftWithOpenRouter(input: ProjectAgreementInput) {
  const result = await requestOpenRouterDraft(input);

  return {
    provider: 'openrouter',
    model: result.model,
    didFallback: false,
    draft: result.draft,
    fallbackReason: null,
  };
}
