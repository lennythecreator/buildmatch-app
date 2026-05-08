# Progress Plan

Keeps work items small and sequential to prevent agent drift, context overflow, or massive rewrites.

## Methodology
- **One epic per sprint** to maintain focus
- **Break into ~5-7 story cards** max per epic
- **Sequential execution** — complete tier before moving to next
- **Size matters** — if a task feels vague, split it further
- **Reference codex-config.md** for constraints before starting

## Current Tier: Foundation (Phase 1)

### Tier 1: Core Infrastructure ✅
- [x] Project setup with Expo Router
- [x] TypeScript configuration
- [x] Tailwind CSS v4 + Uniwind setup
- [x] Planning folder structure
- [ ] **NEXT**: Environment setup (dev, staging, prod configs)

### Tier 2: Authentication & Onboarding (Current Focus)
- [x] User profile schema and types (Zod)
- [x] Developer signup flow
- [x] Contractor signup flow
- [ ] Rate limiting on auth endpoints

### Tier 3: Job Posting & Browsing
- [ ] Job schema and types
- [x] Developer job posting form
- [x] Job listing display
- [x] Search and filtering
- [ ] Pagination

### Tier 4: Bidding System
- [x] Bid schema and types
- [ ] Contractor bid submission
- [x] Developer bid review
- [x] Bid acceptance logic
- [ ] Match confirmation

### Tier 5: Payments & Escrow
- [ ] Payment gateway integration
- [ ] Milestone payment flow
- [ ] Escrow state management
- [ ] Payment tracking UI
- [ ] Release/dispute flows

### Tier 6: Messaging & Communication
- [ ] Direct messaging schema
- [ ] Real-time message updates
- [ ] Message list screen
- [ ] Message notifications
- [ ] Attachment support

### Tier 7: Dispute Resolution
- [ ] Dispute filing flow
- [ ] Dispute tracking
- [ ] Mediation interface
- [ ] Resolution and refund logic
- [ ] Dispute history

### Tier 8: Reviews & Reputation
- [ ] Review schema
- [ ] Review form
- [ ] Rating display
- [ ] Reputation scoring
- [ ] Badge system

## Current Sprint Tasks

### Task 0: Contractor Dashboard
**Status**: Complete
**Size**: 2-4 hours
**Goal**: Build out the contractor dashboard experience and wire it to live data
**Steps**:
1. Add active bids, reliability score, and monthly performance widgets
2. Wire the widgets to live contractor bid and AI reliability queries
3. Add contractor bid review and job discovery screens
4. Validate the slice with type-check and lint

**Acceptance Criteria**:
- [x] Dashboard shows live contractor activity
- [x] Active bids are limited to the top three items
- [x] Reliability score and performance widgets are displayed
- [x] Supporting review-more and find-job flows exist
- [x] Type-check passes
- [x] Lint passes with only unrelated warnings

---

### Task 1: Environment Configuration
**Status**: Ready to start  
**Size**: 1-2 hours  
**Goal**: Set up dev/staging/prod config files  
**Steps**:
1. Create `.env.local`, `.env.staging`, `.env.production`
2. Define required variables (API_URL, AUTH_TOKEN, etc.)
3. Add to `.gitignore`
4. Document in README

**Acceptance Criteria**:
- [ ] Three env files created
- [ ] `.env.local` not committed
- [ ] Variables documented
- [ ] Linting passes

---

### Task 2: User Profile Types & Validation
**Status**: Queue  
**Size**: 1-2 hours  
**Goal**: Define User, Developer, Contractor types with Zod  
**Steps**:
1. Create `types/user.ts` with Zod schemas
2. Define UserProfile, DeveloperProfile, ContractorProfile
3. Export inferred types
4. Create unit tests for validation

**Acceptance Criteria**:
- [ ] All schemas defined
- [ ] Types exported
- [ ] Validation tests pass
- [ ] No TypeScript errors

---

### Task 3: Developer Signup Screen
**Status**: Queue  
**Size**: 2-3 hours  
**Goal**: Build developer account creation screen  
**Implementation Plan**:
1. Create `app/auth/developer-signup.tsx`
2. Implement validation using user schema
3. Add error handling and feedback
4. Wire up to mock auth API

**Acceptance Criteria**:
- [ ] Form renders
- [ ] Validation works
- [ ] No console errors
- [ ] File under 250 lines

---

## Guidelines for Agents

### When Starting a Task
1. Check this file first
2. Review **codex-config.md** for constraints
3. Check **change-log.md** for related work
4. Ask for clarification if task is ambiguous

### When Completing a Task
1. Update status here
2. Add entry to change-log.md
3. Run `npm run lint && npm run type-check`
4. Test on device/emulator if UI

### When Tasks Change
1. Update this file
2. Link to decision in history.md if applicable
3. Notify team of priority shifts

---

Last Updated: 2026-05-08
