# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- Build the first no-database AI-assisted project agreement draft preview for awarded jobs.

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

## In Progress

- Messaging is wired to live API queries with polling-backed refresh.
- Attachment sending is still UI-only because the current API contract does not define message uploads.
- Contractor profile messaging now normalizes the investor job payload, waits for jobs to load, and creates a conversation from an available job before opening the thread.
- Project agreement drafting is currently a local preview generated from existing job and accepted bid data; PDF generation, backend AI, and DocuSign are not connected yet.

## Completed This Round

- Added a visible `Dashboard` header action on project details so users can return to the role dashboard after opening a job.
- Added a contractor-only bid submission form on open job details so the investor-to-contractor bid pipeline can be tested directly in the app.
- Added contractor bid message validation so bids under the 50-character proposal requirement show inline guidance and a clear alert before calling the API.
- Added post-job title and description character counters so developers can see the 10-character title and 50-character description minimums while typing.
- Hid investor bid comparison content from contractor job details and showed contractors their own bid status instead.
- Hardened the manual post-job form with frontend validation matching the backend create-job contract: title length, description length, positive budgets, max greater than min, and 5-digit zip code.
- Changed manual job creation to await the mutation and display the actual backend `ApiError` message/errors instead of a generic failure alert.
- Switched manual job photo upload from anonymous public presign to authenticated `job-photos` presign using the current user id path prefix.
- Added an agreement template metadata layer with template id, version, review status, and required clause definitions.
- Added a normalized project agreement input payload so job and accepted bid data can later be sent to backend AI/PDF/DocuSign services cleanly.
- Refactored the local draft generator to consume the normalized agreement input while preserving the existing route behavior.
- Added template status and draft readiness checklist sections to the project agreement preview.
- Added backend integration documentation for AI draft generation, PDF generation, DocuSign envelope creation, and audit/storage requirements.
- Wired the investor dashboard empty-state `Post your first job` button to the same post-job flow as the header `Post a job` action.
- Added an explicit back control to contractor profile detail headers so profiles opened from search/explore always provide a visible way back.
- Fixed root stack navigation so top-level pushed flows like post job, manual post job, edit profile, find jobs, bids, and project agreements get native headers/back navigation while the main tab shell remains headerless.
- Removed unsupported native stack `headerStatusBarHeight` options from job, contractor, and edit profile stack headers, clearing the previous header option type errors.
- Added a feature spec for AI-assisted project agreement drafting with one shared agreement, role-specific summaries, and clause risk review.
- Added a local project agreement draft generator that uses existing job and accepted bid data without requiring database changes.
- Added a project agreement review screen with shared contract draft sections, developer summary, contractor summary, risk flags, and a DocuSign placeholder action.
- Added an Expo Router agreement route and role-aware bid loading so investors use accepted bid data and contractors use their own accepted bid.
- Added project agreement entry points from awarded job details and the post-bid-acceptance success flow.
- Switched the dispute details screen and mediation thread shell from flex-based layout sizing to Tailwind height utilities.
- Switched the disputes list screen sizing from flex-based layout to Tailwind height utilities and kept the bottom safe-area padding on the list content.
- Expanded the dispute detail screen and mediation container to use the full viewport height so the content area no longer gets cut off at the bottom.
- Normalized dispute detail evidence and mediation payloads so the details screen accepts raw-array, `evidence`/`messages`, and paginated `items` response shapes without crashing on `evidence.map`.
- Cleaned up the disputes screen after render-path debugging, removed the sentinel block, and expanded dispute cards with counterpart, evidence, and message details while keeping the simplified working list layout.
- Restored live dispute cards in the simplified list layout and wrapped each row in a visible error boundary so card render failures surface as explicit fallback blocks instead of disappearing silently.
- Simplified the disputes screen structure to keep the existing header and tabs while rendering the dispute list directly as the next child, matching the working `test-cards` screen more closely.
- Replaced the disputes `FlatList` with a plain `ScrollView` render path to isolate whether virtualization was hiding rows or whether the content region itself is failing to paint.
- Fixed the disputes list container to give `FlatList` an explicit flex viewport and added layout debug logs, because the data was present but the scroll region itself could collapse and hide all rows.
- Temporarily replaced dispute cards on the list screen with plain text debug rows so the render path can be isolated between `FlatList` layout and the `DisputeCard` component tree.
- Added dispute visibility tests that prove list cards can be scoped out when the API omits top-level `filedById` and `againstId`, then hardened the screen filtering to fall back to nested `filedBy.id` and `against.id`.
- Added visible dispute list error and empty-state diagnostics plus deeper dispute response logging so auth, API-shape, and user-scoping failures can be identified directly from the screen and dev console.
- Normalized dispute list responses so the disputes screen accepts raw-array, `disputes`, and paginated `items` payload shapes instead of silently rendering empty when the backend shape varies.
- Removed the investor-side client ownership filter from dispute filing so the screen now trusts the `GET /api/jobs/my-jobs` payload directly, matching the My Jobs screen and the documented API contract.
- Extracted dispute filing job normalization and role-based eligibility into a shared helper, then added a targeted Node test to cover raw-array and object job payloads plus investor/contractor eligibility filtering.
- Added dev-only dispute logging at the hook and screen boundaries so raw API counts, user scoping, and render counts can be inspected quickly when disputes or eligible jobs do not appear.
- Made the disputes tab role-safe by keeping list results and tab counts scoped to disputes involving the authenticated user.
- Refactored the dispute filing flow to use role-aware job sources so investors pick posted jobs and contractors pick awarded jobs only.
- Added a dedicated dispute-eligible-jobs hook to isolate role-based job selection and avoid querying the wrong endpoint for the filing flow.
- Rebuilt the dispute filing screen from scratch as a clean Expo Router flow with a full-height scroll shell and no parser or layout warnings.
- Fixed the dispute filing screen cutoff by rebuilding it as a full-height keyboard-aware scroll view with flex-grow content.
- Scoped the disputes list and tab counts to the authenticated user's disputes instead of loading the full collection.
- Restyled the dispute filing flow into card-based steps with user-scoped job selection and clearer preview content.
- Added a dedicated dispute card test screen with controlled sample data so the card rendering path can be checked in isolation.
- Added a `Test Cards` entry point from the disputes screen to make the render test route easy to open.
- Simplified the disputes list card to render only the dispute title, amount, and status so row rendering is more resilient while we investigate the full data contract.
- Fixed the conversation view header so the chat name and avatar respect the iOS top safe area when the native stack header is hidden.
- Fixed native stack headers so the iOS notch no longer overlaps the header on contractor, job, and edit-profile screens.
- Fixed contractor profile messaging so awarded jobs are eligible and loading state no longer triggers a false "create a job first" alert.
- Implemented the contractor search-tab job browsing flow with search, filters, and pagination.
- Added a reusable job search screen and controls component.
- Refined the contractor browse UX with a sticky search surface, result summary, and auto-scroll on page changes.
- Updated the search tab route so contractors see jobs and investors continue to see contractor exploration.
- Updated the jobs query to preserve previous pages during pagination.
- Switched the contractor jobs screen from `my-jobs` to `my-bids` and removed the completed contractor tab.
- Added a feature spec for consistent search component styling across jobs, contractors, and messaging.
- Added shared search field and filter chip primitives, then refactored the visible search surfaces to use them.
- Type-check passes after the shared search refactor.

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

## Session Notes

- `npm.cmd run lint` passes with warnings only after adding the project detail dashboard action and contractor bid form.
- `npm.cmd run type-check` remains blocked by existing dispute test/normalization typing issues; the new job detail changes do not add type errors.
- `npm.cmd run lint` passes with warnings only after adding contractor bid message validation.
- `npm.cmd run type-check` remains blocked by existing dispute test/normalization typing issues; the bid validation change did not introduce new type errors.
- `npm.cmd run lint` passes with warnings only after adding post-job character counters.
- `npm.cmd run type-check` remains blocked by existing dispute test/normalization typing issues; the post-job counter change did not introduce new type errors.
- `npm.cmd run lint` passes with warnings only after improving manual post-job validation and error handling.
- `npm.cmd run type-check` remains blocked by existing dispute test/normalization typing issues.
- `npm.cmd run lint` passes with warnings only after adding agreement template metadata, normalized agreement input, readiness checks, and integration docs.
- `npm.cmd run type-check` remains blocked by existing dispute test/normalization typing issues; no new agreement type errors were reported.
- `npm.cmd run lint` passes with warnings only after the dashboard/profile navigation fixes; remaining warnings are unrelated existing warnings.
- `npm.cmd run type-check` remains blocked by existing dispute test/normalization typing issues.
- `npm.cmd run lint` passes with warnings only after the navigation header update; remaining warnings are unrelated existing warnings in contractor profile, contractor job controls, job search controls, and messaging conversations.
- `npm.cmd run type-check` no longer reports the previous `headerStatusBarHeight` navigation errors; it remains blocked by existing dispute test/normalization typing issues.
- `npm.cmd run lint` passes with warnings only after adding the project agreement preview; remaining warnings are unrelated existing warnings in contractor profile, contractor job controls, job search controls, and messaging conversations.
- `npm.cmd run type-check` is still blocked by pre-existing `headerStatusBarHeight` option errors and dispute test/normalization typing issues; the new agreement route typing issues were resolved.
- `npm.cmd run test:disputes` passes after adding dispute detail response normalization coverage for evidence and mediation payload shapes.
- `npm.cmd run lint` passes with warnings only; current warnings remain in `app/contractor/[id].tsx`, `app/job/[id].tsx`, `components/contractor-jobs-controls.tsx`, `components/job-search-controls.tsx`, and `components/messaging/conversations.tsx`.
- `npm run test:disputes` passes for dispute filing job normalization and eligibility filtering.
- `npm run lint` passes with warnings only after the dispute scoping update.
- `npm run type-check` is still blocked by pre-existing `headerStatusBarHeight` option errors in `app/contractor/_layout.tsx` and `app/job/_layout.tsx`.
- `npm run type-check` passes after wiring the dashboard to live data.
- `npm run lint` still reports two unrelated warnings in `app/contractor/[id].tsx` and `app/job/[id].tsx`.
- `npm run type-check` passes after adding the messaging screens and conversation route.
