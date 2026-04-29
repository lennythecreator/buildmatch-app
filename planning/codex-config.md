# Codex Configuration

The local rulebook for BuildMatch. Architecture decisions, coding style, navigation patterns, and constraints that prevent regressions and ensure consistency.

## Project Identity
- **Name**: BuildMatch
- **Type**: Expo React Native Marketplace
- **Domain**: Real estate renovation project matching platform
- **Target**: Developers and Contractors

## Architecture Principles

### Monorepo Structure
- Single workspace with shared types and utilities
- Component-based architecture with clear separation of concerns
- API routes handled through Expo Router

### Core Domain Concepts (DO NOT CHANGE WITHOUT DISCUSSION)
- **Developer**: Property owner/investor posting jobs
- **Contractor**: Tradesperson browsing projects and bidding
- **Job**: Renovation project ($10k–$150k range)
- **Bid**: Contractor proposal with price and timeline
- **Match**: Confirmed pairing after bid acceptance
- **Escrow/Payment**: Platform-managed fund holding tied to milestones
- **Dispute**: Formal disagreement resolved through mediation

## Coding Standards

### Language & Framework
- **TypeScript** (strict mode required)
- **React Native** with Expo
- **Expo Router** for navigation
- **Custom React Native components** + **Uniwind** for styling

### File Size Rules
- **MAX 250 lines per file** — split into smaller modules if exceeded
- Prefer many small, focused files over large monoliths
- Keep component files under 250 lines; extract subcomponents

### Naming Conventions
- **Interfaces**: PascalCase (e.g., `UserProfile`, `JobListing`)
- **Types**: Inferred from Zod schemas: `z.infer<typeof Schema>`
- **Variables**: descriptiveNames with auxiliary verbs (e.g., `isLoading`, `hasError`, `canSubmit`)
- **Functions**: camelCase, descriptive (e.g., `formatUserDisplayName`, `calculateBidScore`)
- **Constants**: UPPER_SNAKE_CASE for enums/roles, or object keys (e.g., `UserRole.ADMIN`)
- **Exports**: Named exports preferred over defaults

### No Enums Policy
- Use literal types and object constants instead:
  ```typescript
  export const UserRole = { ADMIN: "admin", USER: "user" } as const;
  export type UserRoleType = typeof UserRole[keyof typeof UserRole];
  ```

### Text Rendering Rule (CRITICAL)
- **Always wrap text in `<Text>` component** — never raw text nodes
- Prevents: "Text strings must be rendered within a <Text> component" errors

### No Emojis
- Use **Tabler Icons** (`@tabler/icons-react-native`) instead
- Examples: `IconSend`, `IconMapPin`, `IconCoin`, `IconPlus`, `IconMessageCircle`

### UI Framework

- **Styling**: Tailwind CSS v4 via Uniwind
- Keep Uniwind token setup stable; avoid unsupported CSS expressions

## Validation & Types

### Zod Integration
- All API inputs validated with Zod schemas
- Schemas define both runtime validation and TypeScript types
- Export both schema and inferred type:
  ```typescript
  export const CreateJobSchema = z.object({ /* ... */ });
  export type CreateJobRequest = z.infer<typeof CreateJobSchema>;
  ```

### Error Handling
- Use ErrorBoundary component for React errors
- Explicit error states in components (hasError, error message)
- Log to error reporting service in componentDidCatch

## Navigation Patterns

### Expo Router
- File-based routing in `/app` directory
- Route groups for logical organization
- Deep linking support required

### Key Routes (Define as project grows)
- `/auth` - Authentication flows
- `/developer` - Developer dashboard and job posting
- `/contractor` - Contractor browsing and bidding
- `/matches` - Active matches and projects
- `/profile` - User profile and settings

## Database & API

### Data Fetching
- Use **React Query** or **SWR** for client-side caching
- Implement proper error handling and retry logic
- Support offline mode where applicable
- Use Expo Router data loaders (`useLoaderData`) for route-level data

### Escrow & Payments
- Never handle raw payment processing directly
- Use platform payment gateway (Stripe, etc.)
- All funds held in escrow managed by backend
- Milestone-based releases

## Testing & Linting

### Pre-commit Requirements
- Run `npm run lint` before pull requests
- Type checking: `npm run type-check`
- All TypeScript errors must resolve (strict mode)

### Testing Strategy
- Unit tests for utilities and validation schemas
- Integration tests for critical workflows
- E2E tests for job bidding and payment flows

## Documentation
- Update docs/ when behavior changes
- Keep README.md current with setup instructions
- Maintain COMPLETE_PRD.md as source of truth for features

## Constraints & Guardrails

### DO NOT
- ❌ Use raw emoji in code
- ❌ Add enums (use literal types)
- ❌ Render text without `<Text>` component
- ❌ Create files over 250 lines (refactor instead)
- ❌ Use `any` type (use unknown if necessary, but prefer strict types)
- ❌ Commit without linting

### DO
- ✅ Use interfaces for object shapes
- ✅ Use Zod for validation and type inference
- ✅ Break large components into smaller files
- ✅ Export named exports
- ✅ Document public utilities
- ✅ Use Tabler Icons for visual indicators

## Decision Log

### Why Zod?
- Runtime validation ensures API safety
- Type inference eliminates duplication
- Single source of truth for schemas

### Why Literal Types Over Enums?
- Better tree-shaking
- Simpler type inference
- More flexible for extending

---

Last Updated: 2026-04-13
Owner: Team
