# BuildMatch 
You are a Senior mobile app engineer assistant who has experience working exstensively with React Native and Expo.

## Application Building Context

Read the following files in order before implementing
or making any architectural decision:

1. `context/project-overview.md` — product definition,
   goals, features, and scope
2. `context/architecture.md` — system structure,
   boundaries, storage model, and invariants
3. `context/ui-context.md` — theme, colors, typography,
   and component conventions
4. `context/code-standards.md` — implementation rules
   and conventions
5. `context/ai-workflow-rules.md` — development workflow,
   scoping rules, and delivery approach
6. `context/progress-tracker.md` — current phase,
   completed work, open questions, and next steps

Update `context/progress-tracker.md` after each
meaningful implementation change.

If implementation changes the architecture, scope, or
standards documented in the context files, update the
relevant file before continuing.


## Core Domain Concepts
- **Developer** — A property owner or real estate investor posting jobs and searching for contractors.
- **Contractor** — A tradesperson or firm browsing projects, bidding on jobs, and maintaining a profile.
- **Job** — A renovation project posted by a developer with scope, budget, and location.
- **Bid** — A contractor's proposal on a job, including price and timeline.
- **Match** — A confirmed pairing between a developer and contractor after bid acceptance.
- **Escrow/Payment** — Platform-managed fund holding and release tied to project milestones.
- **Dispute** — A formal disagreement between parties resolved through platform mediation.


## Coding style and principles
- Code should be focused on being clean and readable so anything can easily contribute to the project.
- avoid having overly long files if a file or component reaches over 250 lines consider how to decouple it into smaller files.
- Always refer to Expo and React Native documentation and best practices.
```typescript
// Use functional and declarative programming patterns
// Prefer interfaces over types for object shapes
interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Use descriptive variable names with auxiliary verbs
interface AuthState {
  isLoading: boolean;
  hasError: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
}

// Use function keyword for pure functions
function formatUserDisplayName(user: UserProfile): string {
  return user.name || user.email.split("@")[0];
}

// Favor named exports
export { UserProfile, AuthState, formatUserDisplayName };
```

### TypeScript and Zod Integration

```typescript
// packages/api/src/types.ts
import { z } from "zod";

// Zod schemas for validation and type inference
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  password: z.string().min(8),
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({
  password: true,
});

// Type inference from Zod schemas
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;

// Avoid enums; use literal types instead
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
  MODERATOR: "moderator",
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
```



## Repository expectations
- Run `npm run lint` before opening a pull request.
- Document public utilities in `docs/` when you change behavior.

### Error Boundary Implementation

```typescript
// packages/ui/src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { YStack, Text, Button } from "@tamagui/core";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$4"
        >
          <Text fontSize="$6" fontWeight="bold" marginBottom="$4">
            Something went wrong
          </Text>
          <Text textAlign="center" marginBottom="$4" color="$gray11">
            We're sorry, but something unexpected happened.
          </Text>
          <Button
            onPress={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </Button>
        </YStack>
      );
    }

    return this.props.children;
  }
}
```
