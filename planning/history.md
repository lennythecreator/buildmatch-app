# History

Audit trail of major decisions, pivots, and milestones. Complements change-log.md with higher-level context.

## 2026 Q2

### 2026-04-13: AI-First Development Framework Established
**Summary**: Created `/planning` folder structure to serve as persistent project brain.  
**Decision**: Implement planning framework (change-log, codex-config, progress-plan, steps)  
**Rationale**: Prevent AI agent context drift, ensure consistency across sessions, maintain architectural decisions  
**Owner**: Team  
**Status**: ✅ Complete

---

## Key Decisions

### 1. Technology Stack (Pre-April 2026)
**Decision**: Expo Router + TypeScript + Tailwind v4 via Uniwind + custom React Native UI  
**Rationale**: 
- Expo Router handles native navigation seamlessly
- TypeScript strict mode enforces safety
- Tailwind + Uniwind provides consistent, universal styling
- Custom React Native components keep the stack lightweight

**Implications**: All components must follow these rules; no custom unverified solutions

### 2. Type Safety with Zod
**Decision**: All data validation via Zod schemas; infer TypeScript types  
**Rationale**:
- Single source of truth for validation and types
- Runtime safety at API boundaries
- Eliminates type duplication

**Implications**: Every API input/output must have a schema

### 3. File Size Limit of 250 Lines
**Decision**: No file exceeds 250 lines; split into smaller modules  
**Rationale**:
- Easier code review and navigation
- Forces modular design
- Reduces cognitive load

**Implications**: When refactoring, aggressively extract components/utilities

### 4. No Raw Emojis or Enums
**Decision**: Use Tabler Icons for UI; use literal types instead of enums  
**Rationale**:
- Consistent, accessible icon treatment
- Literal types are more flexible and tree-shakeable
- Reduces maintenance burden

**Implications**: All visual indicators via `@tabler/icons-react-native`

---

## Recurring Themes & Lessons

### Text Rendering Errors
**Lesson**: Always wrap text in `<Text>` component  
**Context**: React Native requires explicit text containers  
**Prevention**: Add to code review checklist

### Component Isolation
**Lesson**: Large components become hard to test and reuse  
**Context**: Prefer composition over monoliths  
**Application**: Use progress-plan.md to enforce 250-line limit during review

### Type Inference > Manual Types
**Lesson**: Zod schemas eliminate redundant type definitions  
**Context**: `z.infer<typeof Schema>` is truth; everything else derives  
**Application**: Never manually define a type that Zod can provide

---

## Milestones

| Date | Milestone | Status |
|------|-----------|--------|
| 2026-04-13 | Planning framework established | ✅ Complete |
| TBD | Auth & onboarding phase complete | ⏳ Pending |
| TBD | Job posting & browsing MVP | ⏳ Pending |
| TBD | Bidding system launch | ⏳ Pending |
| TBD | Payment/escrow integration | ⏳ Pending |
| TBD | Full platform MVP | ⏳ Pending |

---

## Questions & Pivots

### Q: Should we use Context API or Redux for state management?
**Status**: Open  
**Notes**: Defer until auth phase; React Query may eliminate need for global state

### Q: Mobile-first or responsive web?
**Status**: Resolved  
**Answer**: Mobile-first (Expo); web optional later

---

Last Updated: 2026-04-13
