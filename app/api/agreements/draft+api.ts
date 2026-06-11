import type { ProjectAgreementInput } from '@/lib/agreements/project-agreement-input';
import { generateAgreementDraftWithGroq } from '@/lib/agreements/groq-agreement-provider';
import { generateAgreementDraftWithOllama } from '@/lib/agreements/ollama-agreement-provider';
import { generateAgreementDraftWithOpenRouter } from '@/lib/agreements/openrouter-agreement-provider';
import { generateProjectAgreementDraftFromInput } from '@/lib/agreements/project-agreement-draft';

interface AgreementDraftRequestBody {
  agreementInput?: ProjectAgreementInput;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getAgreementInputErrors(input: unknown) {
  if (!isRecord(input)) {
    return ['agreementInput is required.'];
  }

  const requiredStringFields = ['jobId', 'title', 'tradeType', 'location', 'scopeDescription'];
  const errors: string[] = [];

  for (const field of requiredStringFields) {
    if (typeof input[field] !== 'string' || !input[field]) {
      errors.push(`agreementInput.${field} is required.`);
    }
  }

  if (typeof input.contractAmount !== 'number' || Number.isNaN(input.contractAmount)) {
    errors.push('agreementInput.contractAmount must be a number.');
  }

  if (!isRecord(input.template)) {
    errors.push('agreementInput.template is required.');
  }

  if (!isRecord(input.parties)) {
    errors.push('agreementInput.parties is required.');
  }

  if (!Array.isArray(input.readinessItems)) {
    errors.push('agreementInput.readinessItems must be an array.');
  }

  return errors;
}

async function generateAgreementDraft(input: ProjectAgreementInput) {
  const provider = process.env.AI_AGREEMENT_PROVIDER ?? 'openrouter';

  if (provider === 'ollama') {
    return generateAgreementDraftWithOllama(input);
  }

  if (provider === 'groq') {
    return generateAgreementDraftWithGroq(input);
  }

  if (provider === 'template') {
    return {
      provider: 'template',
      model: 'buildmatch-local-template-v1',
      didFallback: true,
      draft: generateProjectAgreementDraftFromInput(input),
      fallbackReason: 'AI_AGREEMENT_PROVIDER is set to template.',
    };
  }

  try {
    return await generateAgreementDraftWithOpenRouter(input);
  } catch (error) {
    console.warn('OpenRouter agreement draft failed, trying Groq fallback:', error);
    const openRouterReason = error instanceof Error ? error.message : 'Unknown OpenRouter error.';
    const groqResult = await generateAgreementDraftWithGroq(input);

    if (groqResult.didFallback) {
      return {
        ...groqResult,
        fallbackReason: `OpenRouter failed: ${openRouterReason} Groq fallback failed: ${groqResult.fallbackReason ?? 'Unknown Groq error.'}`,
      };
    }

    return {
      ...groqResult,
      fallbackReason: `OpenRouter failed, so Groq generated the draft instead: ${openRouterReason}`,
    };
  }
}

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgreementDraftRequestBody;
    const errors = getAgreementInputErrors(body.agreementInput);

    if (errors.length > 0 || !body.agreementInput) {
      return Response.json(
        {
          error: 'Invalid agreement draft request.',
          details: errors,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await generateAgreementDraft(body.agreementInput);

    return Response.json(
      {
        ...result,
        generatedAt: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Agreement draft API error:', error);

    return Response.json(
      {
        error: 'Could not generate agreement draft.',
        details: ['Request body must be valid JSON.'],
      },
      { status: 400, headers: corsHeaders }
    );
  }
}
