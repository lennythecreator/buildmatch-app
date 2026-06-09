# AI-Assisted Project Agreement Integration

This document describes the intended backend handoff for the project agreement draft preview.

## Current Frontend State

The app can build a local draft preview from existing job and accepted bid data. It does not persist contracts, call an AI model, generate PDFs, or create DocuSign envelopes.

## Proposed Backend Flow

1. Accept a bid and mark the job as awarded.
2. Build a `ProjectAgreementInput` payload from job, bid, developer, and contractor data.
3. Send the payload to a backend contract drafting endpoint.
4. The backend applies an attorney-reviewed template and optional AI drafting/summarization.
5. The backend returns a structured draft with:
   - shared agreement sections
   - developer summary
   - contractor summary
   - clause risk review
   - readiness checklist
6. Once both parties approve, the backend generates a PDF.
7. The backend creates a DocuSign envelope and stores the envelope ID.
8. The backend listens for DocuSign completion and stores the signed PDF URL.

## Suggested Endpoint Shape

```http
POST /api/contracts/drafts
```

```json
{
  "jobId": "job-id",
  "bidId": "bid-id",
  "templateId": "renovation-services-standard"
}
```

## Production Requirements

- Attorney-reviewed template source of truth.
- Template version stored with every generated draft.
- AI input snapshot stored for auditability.
- Generated draft versioning.
- Separate party approvals before signature.
- DocuSign envelope ID and status tracking.
- Signed PDF storage.
- Audit events for creation, approval, send, signature, and voiding.

## Guardrails

- The AI must draft from approved clauses and structured project data.
- The AI must not claim legal approval.
- The app should label generated output as a draft until both parties sign.
- The signed PDF should be the canonical record, not the AI response.

