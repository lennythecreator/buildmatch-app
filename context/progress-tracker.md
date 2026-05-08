# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In progress

## Current Goal

- Wire and polish the messaging experience.

## Completed

- Contractor dashboard now shows active bids, reliability score, and monthly performance widgets.
- Added live contractor bid resolution using `GET /api/jobs/my-bids` plus `GET /api/jobs/:jobId/bids/my-bid`.
- Added contractor `My Bids` and `Find Jobs` screens for dashboard actions.
- Reliability score widget now uses the AI reliability endpoint with a fallback display.
- Added a modular REST-first messaging flow with a conversations list, conversation detail route, message bubbles, and composer UI.
- Added attachment selection and preview UI in the composer so the feature can grow into richer messaging later.
- Added a dedicated conversation thread hook so realtime transport can be swapped in later without rewriting the screens.

## In Progress

- Messaging is wired to live API queries with polling-backed refresh.
- Attachment sending is still UI-only because the current API contract does not define message uploads.
- Contractor profile messaging now creates a conversation from the current investor's jobs and opens the thread.

## Next Up

- Swap the REST polling seam for realtime subscriptions once the backend transport contract is finalized.

## Open Questions

- Should message attachments be added to the API contract, or remain preview-only for now?

## Architecture Decisions

- Active contractor bids are resolved by combining `GET /api/jobs/my-bids` with each job's `GET /api/jobs/:jobId/bids/my-bid` response because the my-bids endpoint returns jobs, not bids.
- Performance and dashboard widgets should reuse the same live contractor bid query to avoid diverging mock data paths.
- Messaging uses the same REST query layer for now, with a dedicated conversation hook and polling refresh so the implementation can switch to realtime channels later without changing the screen components.

## Session Notes

- `npm run type-check` passes after wiring the dashboard to live data.
- `npm run lint` still reports two unrelated warnings in `app/contractor/[id].tsx` and `app/job/[id].tsx`.
- `npm run type-check` passes after adding the messaging screens and conversation route.
