# Steps Roadmap

This folder contains the step-by-step buildout with specific prompts to direct agent execution.

## Structure
Each file in this folder represents a discrete, focusable task tier:
- `01-foundation.md` — Core infrastructure setup
- `02-authentication.md` — User auth and onboarding
- `03-job-posting.md` — Job CRUD and browsing
- `04-bidding.md` — Bid submission and acceptance
- `05-payments.md` — Escrow and milestone payments
- `06-messaging.md` — Chat and notifications
- `07-disputes.md` — Dispute resolution flows
- `08-reviews.md` — Reviews and reputation

## How Agents Use This
1. **Start a new task?** → Read the corresponding step file
2. **Stuck?** → Refer to the prompt section; it explains intent clearly
3. **Finished?** → Mark as complete in progress-plan.md and note completion in change-log.md

## Execution Order
Follow the tier numbers 01 → 02 → 03, etc. Don't skip ahead unless explicitly approved.

## File Format
Each step file contains:
- **Overview**: What gets built and why
- **Acceptance Criteria**: Definition of done
- **Key Decisions**: Constraints specific to this tier
- **Micro-steps**: Granular implementation steps
- **Testing Notes**: How to validate
- **Agent Prompt**: Exact task description for AI execution

---

Start with `01-foundation.md` if beginning the project.
