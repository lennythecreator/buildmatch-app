import { generateAgreementPdf } from '@/lib/agreements/agreement-pdf';
import type { ProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';

interface AgreementPdfRequestBody {
  draft?: ProjectAgreementDraft;
  fileName?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getDraftErrors(draft: unknown) {
  if (!isRecord(draft)) {
    return ['draft is required.'];
  }

  const errors: string[] = [];

  if (typeof draft.title !== 'string' || !draft.title) {
    errors.push('draft.title is required.');
  }

  if (typeof draft.disclaimer !== 'string' || !draft.disclaimer) {
    errors.push('draft.disclaimer is required.');
  }

  if (!isRecord(draft.template)) {
    errors.push('draft.template is required.');
  }

  if (!Array.isArray(draft.parties)) {
    errors.push('draft.parties must be an array.');
  }

  if (!Array.isArray(draft.contractSections)) {
    errors.push('draft.contractSections must be an array.');
  }

  if (!Array.isArray(draft.developerSummary)) {
    errors.push('draft.developerSummary must be an array.');
  }

  if (!Array.isArray(draft.contractorSummary)) {
    errors.push('draft.contractorSummary must be an array.');
  }

  if (!Array.isArray(draft.riskFlags)) {
    errors.push('draft.riskFlags must be an array.');
  }

  if (!Array.isArray(draft.readinessItems)) {
    errors.push('draft.readinessItems must be an array.');
  }

  return errors;
}

export function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgreementPdfRequestBody;
    const errors = getDraftErrors(body.draft);

    if (errors.length > 0 || !body.draft) {
      return Response.json(
        {
          error: 'Invalid agreement PDF request.',
          details: errors,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    const pdf = generateAgreementPdf(body.draft, body.fileName);

    return Response.json(
      {
        ...pdf,
        generatedAt: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Agreement PDF API error:', error);

    return Response.json(
      {
        error: 'Could not generate agreement PDF.',
        details: ['Request body must be valid JSON.'],
      },
      { status: 400, headers: corsHeaders }
    );
  }
}
