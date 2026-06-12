# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Escrow API integration (replacing MVP stubs with real API calls)

## Current Goal

- Wire the escrow screen to the Escrow.com API contract for testing

## Completed

- Contractor dashboard now shows active bids, reliability score, and monthly performance widgets.
- Added live contractor bid resolution using `GET /api/jobs/my-bids` plus `GET /api/jobs/:jobId/bids/my-bid`.
- Added contractor `My Bids` and `Find Jobs` screens for dashboard actions.
- Reliability score widget now uses the AI reliability endpoint with a fallback display.
- Added a modular REST-first messaging flow with a conversations list, conversation detail route, message bubbles, and composer UI.
- Added attachment selection and preview UI in the composer so the feature can grow into richer messaging later.
- Added a dedicated conversation thread hook so realtime transport can be swapped in later without rewriting the screens.
- Added a role-aware search tab that shows contractor jobs with search, filters, and pagination.
- Contractor jobs tab now uses role-aware content with tabs, search, filters, and pagination.
- Contractor jobs now use the contractor bid feed and exclude completed from the contractor-only view.
- Added a no-database AI-assisted project agreement draft preview for awarded jobs, including shared draft sections, developer summary, contractor summary, and clause risk review.
- Implemented the Feedback Screen at `app/feedback/index.tsx` per feature spec 09.
- Implemented the role-aware Escrow Payment (Fund Escrow) screen at `app/escrow/[jobId].tsx` per feature spec 08.
- Added a client-side escrow summary helper (`lib/escrow/escrow-summary.ts`) with the `ESCROW_FEE_RATE` (2.0%) protection fee.
- Added a role-aware Fund/View escrow entry point on awarded job details next to the project agreement action.

## In Progress

- Messaging is wired to live API queries with polling-backed refresh.
- Attachment sending is still UI-only because the current API contract does not define message uploads.
- Contractor profile messaging now normalizes the investor job payload, waits for jobs to load, and creates a conversation from an available job before opening the thread.
- Project agreement drafting is currently a local preview generated from existing job and accepted bid data; PDF generation, backend AI, and DocuSign are not connected yet.

## Added This Session

- Implemented the full escrow API integration per `context/feature-specs/escrow-api-contract.md`: added `EscrowPayment`, `EscrowMilestone`, `EscrowOnboardStatus`, `FundJobInput`, and related types to `lib/api/types.ts`; created `lib/api/services/escrow.ts` with `escrowService` covering onboard, onboard status, fund-job, get-by-job, submit/approve/dispute milestone endpoints; registered the service in the services barrel export.
- Replaced the `useFundEscrow` MVP stub in `hooks/useEscrow.ts` with six React Query hooks: `useEscrowOnboardStatus`, `useEscrowOnboard`, `useEscrowPayment`, `useFundEscrowFromJob`, `useSubmitMilestone`, `useApproveMilestone`, `useDisputeMilestone` — all wired to real API calls with query key invalidation.
- Updated `lib/escrow/escrow-summary.ts` to use `EscrowMilestone`/`EscrowPayment` instead of `DrawMilestone`/`DrawSchedule`, added `getPaymentStatusLabel` and `getMilestoneStatusLabel` helpers, and exported `EscrowPaymentStatus` for UI consumption.
- Rewrote `components/escrow/escrow-screen.tsx` to fetch real escrow payment data via `useEscrowPayment`, check onboarding via `useEscrowOnboardStatus`, present the fund flow with onboarding gating and Escrow.com redirect via `expo-web-browser`, and wire milestone lifecycle actions (submit/approve/dispute) through the new mutation hooks.
- Rewrote `components/escrow/payment-schedule.tsx` to render `EscrowMilestone` items with full lifecycle UI: PENDING shows contractor "Mark as Complete" button, SUBMITTED shows investor "Approve"/"Dispute" buttons, and all statuses display completion notes and dispute reasons inline.
- Rewrote `components/escrow/escrow-protection-status.tsx` to handle all `EscrowPaymentStatus` values (PENDING, FUNDED, IN_PROGRESS, FULLY_RELEASED, DISPUTED, REFUNDED) with appropriate icons, colors, and messaging, plus approved/remaining amount breakdown.
- Updated `components/escrow/escrow-hero.tsx` to display status-specific badges for each escrow payment status.
- Updated `components/escrow/escrow-order-total.tsx` to accept `onboardStatus` prop and show "Set Up Escrow Account" CTA when the investor has not completed Escrow.com onboarding.
- Lint passes with no errors or warnings on all new/changed escrow files.
- TypeScript type-check reports no errors in any escrow files (pre-existing dispute test typing issues remain unchanged).

## Next Up

- Swap the REST polling seam for realtime subscriptions once the backend transport contract is finalized.

## Open Questions

- Should message attachments be added to the API contract, or remain preview-only for now?
- Which attorney-reviewed template family should become the source of truth for the production agreement clauses?
- Should the first production integration call a backend AI endpoint before DocuSign, or should it first generate deterministic PDFs from approved templates?

## Architecture Decisions

- Project agreement generation now separates source data normalization, template metadata, and draft rendering so the future backend can reuse the same payload shape.
- AI-assisted project agreement drafting starts as one canonical shared agreement with role-specific summaries, not two separate contracts, to avoid conflicting obligations.
- The first project agreement slice avoids database writes and backend contract endpoints until the contract storage, AI, PDF, and DocuSign lifecycle is finalized.
- Active contractor bids are resolved by combining `GET /api/jobs/my-bids` with each job's `GET /api/jobs/:jobId/bids/my-bid` response because the my-bids endpoint returns jobs, not bids.
- Performance and dashboard widgets should reuse the same live contractor bid query to avoid diverging mock data paths.
- Messaging uses the same REST query layer for now, with a dedicated conversation hook and polling refresh so the implementation can switch to realtime channels later without changing the screen components.
- Escrow funding follows the Escrow.com redirect model: the mobile app never handles payment credentials directly but opens the Escrow.com payment URL in the system browser via `expo-web-browser`.
- Escrow milestone actions (submit/approve/dispute) use direct REST mutations with query invalidation for eventual consistency; polling is not implemented on the client since the user triggers refreshes by re-entering the escrow screen.

## Session Notes

- `npm run lint` on all new/changed escrow files passes with 0 errors and 0 warnings.
- `npx tsc --noEmit` reports no errors in any escrow files (`lib/api/types.ts`, `lib/api/services/escrow.ts`, `lib/escrow/escrow-summary.ts`, `hooks/useEscrow.ts`, `components/escrow/*.tsx`).
- Pre-existing type-check errors in `lib/disputes/` and `components/disputes/` remain unchanged.
- Pre-existing lint warnings in `app/contractor/[id].tsx`, `components/contractor-jobs-controls.tsx`, `components/job-search-controls.tsx`, `components/messaging/conversations.tsx`, and `components/disputes/dispute-timeline.tsx` remain unchanged.
