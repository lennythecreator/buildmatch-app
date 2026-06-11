import type { ProjectAgreementInput } from '@/lib/agreements/project-agreement-input';
import { mergeAiAgreementContent, type AiAgreementContent } from '@/lib/agreements/agreement-ai-normalizer';
import { generateProjectAgreementDraftFromInput } from '@/lib/agreements/project-agreement-draft';

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
}

const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
const DEFAULT_OLLAMA_MODEL = 'qwen3:14b';
const DEFAULT_OLLAMA_TIMEOUT_MS = 60000;
const DEFAULT_OLLAMA_NUM_PREDICT = 500;
const DEFAULT_OLLAMA_NUM_CTX = 2048;
const DEFAULT_OLLAMA_TEMPERATURE = 0.1;

function getNumberEnv(name: string, fallback: number) {
  const value = process.env[name];
  const parsedValue = value ? Number.parseInt(value, 10) : Number.NaN;

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

function buildAgreementPrompt(input: ProjectAgreementInput) {
  return [
    'You are drafting a renovation services agreement for BuildMatch.',
    '',
    'Use only the project details below.',
    'Do not invent missing facts.',
    'If something is missing, add it to "missingInfo".',
    'This is not legal advice.',
    'Return JSON only.',
    'Do not include reasoning, thinking, or markdown.',
    '',
    'Keep the response very concise. Use one short sentence per contract section.',
    'The JSON must include contractSections, developerSummary, contractorSummary, riskFlags, and missingInfo.',
    'Each contractSections item must include title and body.',
    'Each riskFlags item must include title, description, and severity.',
    'Risk severity must be one of low, medium, or high.',
    '',
    `Template: ${input.template.name} v${input.template.version}`,
    `Template review status: ${input.template.reviewStatus}`,
    '',
    'Project:',
    `Title: ${input.title}`,
    `Description: ${input.scopeDescription}`,
    `Trade type: ${input.tradeType}`,
    `Location: ${input.location}`,
    `Accepted bid: ${input.contractAmount}`,
    '',
    'Developer:',
    `Name: ${input.parties.developer.name}`,
    '',
    'Contractor:',
    `Name: ${input.parties.contractor.name}`,
    '',
    'Create exactly 5 contractSections: Project Scope, Contract Price, Payment Milestones, Change Orders, Signature Readiness.',
    'Create exactly 2 developerSummary items, 2 contractorSummary items, and 2 riskFlags.',
    `Accepted bid id: ${input.bidId ?? 'missing'}`,
  ].join('\n');
}

function extractJsonObject(content: string) {
  const startIndex = content.indexOf('{');
  const endIndex = content.lastIndexOf('}');

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error('Ollama response did not include a JSON object.');
  }

  return JSON.parse(content.slice(startIndex, endIndex + 1)) as AiAgreementContent;
}

function mergeOllamaContent(input: ProjectAgreementInput, content: AiAgreementContent) {
  const fallback = generateProjectAgreementDraftFromInput(input);
  return mergeAiAgreementContent(content, fallback);
}

async function requestOllamaDraft(input: ProjectAgreementInput) {
  const baseUrl = process.env.OLLAMA_BASE_URL ?? DEFAULT_OLLAMA_BASE_URL;
  const model = process.env.OLLAMA_MODEL ?? DEFAULT_OLLAMA_MODEL;
  const timeoutMs = getNumberEnv('OLLAMA_TIMEOUT_MS', DEFAULT_OLLAMA_TIMEOUT_MS);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        format: 'json',
        options: {
          temperature: Number.parseFloat(process.env.OLLAMA_TEMPERATURE ?? `${DEFAULT_OLLAMA_TEMPERATURE}`),
          num_ctx: getNumberEnv('OLLAMA_NUM_CTX', DEFAULT_OLLAMA_NUM_CTX),
          num_predict: getNumberEnv('OLLAMA_NUM_PREDICT', DEFAULT_OLLAMA_NUM_PREDICT),
        },
        messages: [
          {
            role: 'system',
            content: 'Return compact valid JSON only. Do not include thinking, markdown, or explanations.',
          },
          {
            role: 'user',
            content: buildAgreementPrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed with HTTP ${response.status}.`);
    }

    const data = (await response.json()) as OllamaChatResponse;
    const content = data.message?.content;

    if (!content) {
      throw new Error('Ollama response did not include message content.');
    }

    return {
      model,
      draft: mergeOllamaContent(input, extractJsonObject(content)),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Ollama request timed out after ${Math.round(timeoutMs / 1000)} seconds.`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateAgreementDraftWithOllama(input: ProjectAgreementInput) {
  try {
    const result = await requestOllamaDraft(input);

    return {
      provider: 'ollama',
      model: result.model,
      didFallback: false,
      draft: result.draft,
      fallbackReason: null,
    };
  } catch (error) {
    console.warn('Ollama agreement draft failed, using template fallback:', error);
    const fallbackReason = error instanceof Error ? error.message : 'Unknown Ollama error.';

    return {
      provider: 'template',
      model: 'buildmatch-local-template-v1',
      didFallback: true,
      draft: generateProjectAgreementDraftFromInput(input),
      fallbackReason,
    };
  }
}
