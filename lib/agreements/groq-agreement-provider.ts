import type { ProjectAgreementInput } from '@/lib/agreements/project-agreement-input';
import { mergeAiAgreementContent, type AiAgreementContent } from '@/lib/agreements/agreement-ai-normalizer';
import { generateProjectAgreementDraftFromInput } from '@/lib/agreements/project-agreement-draft';

interface GroqChatResponse {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
}

const DEFAULT_GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_GROQ_MODEL = 'llama-3.1-8b-instant';
const DEFAULT_GROQ_TIMEOUT_MS = 30000;
const DEFAULT_GROQ_MAX_COMPLETION_TOKENS = 700;

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
    throw new Error('Groq response did not include a JSON object.');
  }

  return JSON.parse(content.slice(startIndex, endIndex + 1)) as AiAgreementContent;
}

function mergeGroqContent(input: ProjectAgreementInput, content: AiAgreementContent) {
  const fallback = generateProjectAgreementDraftFromInput(input);
  return mergeAiAgreementContent(content, fallback);
}

async function requestGroqDraft(input: ProjectAgreementInput) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set.');
  }

  const baseUrl = process.env.GROQ_BASE_URL ?? DEFAULT_GROQ_BASE_URL;
  const model = process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL;
  const timeoutMs = getNumberEnv('GROQ_TIMEOUT_MS', DEFAULT_GROQ_TIMEOUT_MS);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.1,
        max_completion_tokens: getNumberEnv('GROQ_MAX_COMPLETION_TOKENS', DEFAULT_GROQ_MAX_COMPLETION_TOKENS),
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
      throw new Error(`Groq request failed with HTTP ${response.status}. ${errorBody}`.trim());
    }

    const data = (await response.json()) as GroqChatResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Groq response did not include message content.');
    }

    return {
      model,
      draft: mergeGroqContent(input, extractJsonObject(content)),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Groq request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAgreementDraftWithGroq(input: ProjectAgreementInput) {
  try {
    const result = await requestGroqDraft(input);

    return {
      provider: 'groq',
      model: result.model,
      didFallback: false,
      draft: result.draft,
      fallbackReason: null,
    };
  } catch (error) {
    console.warn('Groq agreement draft failed, using template fallback:', error);
    const fallbackReason = error instanceof Error ? error.message : 'Unknown Groq error.';

    return {
      provider: 'template',
      model: 'buildmatch-local-template-v1',
      didFallback: true,
      draft: generateProjectAgreementDraftFromInput(input),
      fallbackReason,
    };
  }
}
