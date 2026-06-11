import type { AgreementPdfApiResponse } from '@/lib/agreements/agreement-draft-api';

interface AgreementPreviewDocument {
  id: string;
  pdf: AgreementPdfApiResponse;
}

const previewDocuments = new Map<string, AgreementPreviewDocument>();

function createAgreementPreview(pdf: AgreementPdfApiResponse) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  previewDocuments.set(id, { id, pdf });

  return id;
}

function getAgreementPreview(id: string) {
  return previewDocuments.get(id) ?? null;
}

export { createAgreementPreview, getAgreementPreview };
export type { AgreementPreviewDocument };
