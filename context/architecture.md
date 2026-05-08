# Architecture Context

## Stack

| Layer     | Technology                  | Role   |
| --------- | --------------------------- | ------ |
| Framework | [e.g. Expo + TypeScript] | [Role] |
| UI        | [e.g. Uniwind] | [Role] |
| Auth      | [JWT token provided by the api]                | [Role] |
| Database  | [Supabase]  | [Role] |
| [Layer]   | [Technology]                | [Role] |

## System Boundaries

- `[app]` — [Holds the feature modules]
- `[components]` — [Holds all the reuseable UI components for the project]
- `[components/ui]` — [UI primitives e.g Cards, Buttons]
- `[data]`  — [Mock data and constants go here]
- `[docs]`  — [Holds all documentation files]
- `[hooks]` — [Holds all the custom hooks]
- `[lib/api]`  —  [Where the api logic lives]
- `[lib/api/services]`  —  [Holds all services that communicate with the backend]
- `[store]`  — [Where the state management logic lives]
- `[types]`  — [Shared types files go here]

## Storage Model

- **[Storage type e.g. Database]**: [What lives here —
  e.g. metadata, ownership, relationships]
- **[Storage type e.g. Blob/File Storage]**: [What lives
  here — e.g. generated files, media, large artifacts]

## Auth and Access Model

- [How authentication works — e.g. Every user signs in
  via Clerk]
- [How ownership works — e.g. Every project has a single
  owner]
- [How access control works — e.g. Only the owner or a
  collaborator can mutate project resources]

## Invariants

1. [Rule the codebase must never violate — e.g. Request
   handlers do not run long-lived background work]
2. [Code must not be stale avoid stale functions that are not being used]

