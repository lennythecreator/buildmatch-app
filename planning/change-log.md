# Change Log

Track all modifications to prevent repeating mistakes and building on solid foundations.

## Format
- **Date**: YYYY-MM-DD
- **Type**: Feature | Bug | Refactor | Docs | Config
- **Component**: Which part of the app
- **Change**: What was modified
- **Why**: Rationale behind the change
- **Issues**: Any problems encountered or lessons learned

---

## Recent Changes

### 2026-05-08
- **Type**: Feature
- **Component**: Contractor Dashboard
- **Change**: Built out the contractor dashboard with active bids, reliability score, and monthly performance widgets; added supporting `My Bids` and `Find Jobs` screens.
- **Why**: The contractor dashboard spec required a real overview surface with bid review, score visibility, and quick access to job discovery.
- **Issues**: The new `Find Jobs` screen needed an API-to-local job type adapter so it could render with the existing job card component.

### 2026-05-08
- **Type**: Refactor
- **Component**: Contractor Dashboard Data
- **Change**: Replaced the mock active-bids and performance data sources with API-backed queries derived from the contractor's jobs and own bid records.
- **Why**: The dashboard widgets needed to reflect live contractor activity instead of seeded mock data.
- **Issues**: `GET /api/jobs/my-bids` returns jobs, so the bid hook now resolves each job's own bid before rendering.

### 2026-04-13
- **Type**: Setup
- **Component**: Project Infrastructure
- **Change**: Created /planning folder structure for AI-first development
- **Why**: Establish persistent knowledge base for agent consistency and context preservation
- **Issues**: None

---

## Guidelines for Agents
1. Review this file before proposing changes to understand what's already been tried
2. Add entries for all significant changes
3. Note any patterns, gotchas, or lessons learned
4. Link to related entries when applicable
