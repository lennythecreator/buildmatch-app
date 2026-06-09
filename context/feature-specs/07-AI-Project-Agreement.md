# AI-Assisted Project Agreement

This feature helps both parties review a shared project agreement after a bid is accepted. The app should generate one canonical agreement draft, plus role-specific summaries and clause risk flags.

## MVP Scope

- Show a project agreement draft for awarded jobs.
- Use existing job, accepted bid, developer, and contractor data.
- Present one shared contract draft that both parties review.
- Present a developer summary and contractor summary.
- Present a clause risk review for missing or weak terms.
- Clearly label the output as a draft preview and not legal advice.
- Do not persist contracts until the backend contract storage model is available.

## Out of Scope For MVP

- Database schema changes.
- Real AI generation from a backend model endpoint.
- PDF generation.
- DocuSign envelope creation.
- Contract versioning, redlines, and comment threads.
- Legal approval claims.

## Target Workflow

1. Developer accepts a contractor bid.
2. The app offers a project agreement draft action.
3. The draft preview is generated from existing project data.
4. Both parties can review the shared agreement, their role-specific summary, and risk flags.
5. A future backend step generates a PDF and sends it to DocuSign.

## Future Backend Requirements

- Store contract draft status and versions.
- Store the AI input snapshot and template version.
- Store generated PDF and signed PDF URLs.
- Store DocuSign envelope ID and signature status.
- Store audit events for draft creation, approval, sending, and signing.

