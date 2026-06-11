import type { ProjectAgreementInput } from '@/lib/agreements/project-agreement-input';
import type { ProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';

interface AgreementDraftApiResponse {
  provider: 'openrouter' | 'groq' | 'ollama' | 'template';
  model: string;
  didFallback: boolean;
  generatedAt: string;
  draft: ProjectAgreementDraft;
  fallbackReason?: string | null;
}

interface AgreementPdfApiResponse {
  fileName: string;
  mimeType: 'application/pdf';
  base64: string;
  byteLength: number;
  generatedAt: string;
}

function getAgreementDraftEndpoint() {
  const configuredUrl = process.env.EXPO_PUBLIC_AGREEMENT_DRAFT_API_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.EXPO_OS === 'web') {
    return '/api/agreements/draft';
  }

  throw new Error(
    'Set EXPO_PUBLIC_AGREEMENT_DRAFT_API_URL to your local agreement endpoint before preparing a DocuSign draft.'
  );
}

function getAgreementPdfEndpoint() {
  const configuredUrl = process.env.EXPO_PUBLIC_AGREEMENT_PDF_API_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const draftUrl = process.env.EXPO_PUBLIC_AGREEMENT_DRAFT_API_URL;

  if (draftUrl) {
    return draftUrl.replace(/\/draft\/?$/, '/pdf');
  }

  if (process.env.EXPO_OS === 'web') {
    return '/api/agreements/pdf';
  }

  throw new Error(
    'Set EXPO_PUBLIC_AGREEMENT_PDF_API_URL or EXPO_PUBLIC_AGREEMENT_DRAFT_API_URL before generating an agreement PDF.'
  );
}

export async function requestAgreementDraft(agreementInput: ProjectAgreementInput) {
  const endpoint = getAgreementDraftEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agreementInput }),
  }).catch(() => {
    throw new Error(`Could not reach agreement draft endpoint at ${endpoint}. Confirm expo serve is running and your phone can reach this computer.`);
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? `Agreement draft request failed with HTTP ${response.status}.`;
    throw new Error(message);
  }

  return (await response.json()) as AgreementDraftApiResponse;
}

export async function requestAgreementPdf(draft: ProjectAgreementDraft) {
  const endpoint = getAgreementPdfEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ draft }),
  }).catch(() => {
    throw new Error(`Could not reach agreement PDF endpoint at ${endpoint}. Confirm expo serve is running and your phone can reach this computer.`);
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? `Agreement PDF request failed with HTTP ${response.status}.`;
    throw new Error(message);
  }

  return (await response.json()) as AgreementPdfApiResponse;
}

export type { AgreementDraftApiResponse, AgreementPdfApiResponse };
