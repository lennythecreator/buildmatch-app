# Feedback Screen — API Integration

Wire the feedback screen to the real backend endpoint. The UI layer is already
built (7 components) with a single stub seam (`useSubmitFeedback`). Replace the
stub with a real service call and align the client types to the server contract.

---

## API Contract

```
POST /api/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "comment": "I love the contractor matching feature!",
  "sentiment": "POSITIVE"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "cmq...",
    "userId": "cmq...",
    "comment": "I love the contractor matching feature!",
    "sentiment": "POSITIVE",
    "createdAt": "2026-06-12T01:30:00.000Z"
  },
  "message": "Feedback submitted"
}
```

- `sentiment` values: `"POSITIVE"` | `"NEGATIVE"`
- `comment` is required, non-empty string
- The response envelope is `{ success, data, message }` — `apiClient` unwraps
  `.data` automatically (see `lib/api/client.ts:112`), so the service should
  be typed to the inner `FeedbackResponse`.

---

## Files to Change

### 1. `lib/api/types.ts` — Align types to server contract

| Current (stub) | Server field | Change to |
|---|---|---|
| `authorId: string` | `userId` | `userId: string` |
| `message: string` | `comment` | `comment: string` |

**New/updated types:**

```typescript
export interface FeedbackSubmission {
  id: string;
  userId: string;
  sentiment: FeedbackSentiment;
  comment: string;
  createdAt: string;
}

// Request body sent to POST /api/feedback
export interface SubmitFeedbackRequest {
  comment: string;
  sentiment: FeedbackSentiment;
}
```

Keep `FeedbackSentiment` and `FounderPresence` as-is.

---

### 2. `lib/api/services/feedback.ts` — New service

Create a single-method service following the pattern in `lib/api/services/bids.ts`:

```typescript
import { apiClient } from '../client';
import type { FeedbackSubmission, SubmitFeedbackRequest } from '../types';

export const feedbackService = {
  submit: (input: SubmitFeedbackRequest) =>
    apiClient.post<FeedbackSubmission>('/api/feedback', input),
};
```

- No `Base64` encoding, no custom headers — the client auto-injects
  `Authorization: Bearer <token>` and `Content-Type: application/json`.

---

### 3. `lib/api/services/index.ts` — Register service

Add one line:

```typescript
export * from './feedback';
```

Insert alphabetically between `'./estimator'` and `'./jobs'` (or at the end).

---

### 4. `hooks/useSubmitFeedback.ts` — Replace stub with real call

**Before (stub):**

```typescript
import { useMutation } from '@tanstack/react-query';

export interface SubmitFeedbackInput {
  sentiment: FeedbackSentiment;
  message: string;
}

export interface SubmitFeedbackResult {
  id: string;
  createdAt: string;
}

export function useSubmitFeedback() {
  return useMutation<SubmitFeedbackResult, Error, SubmitFeedbackInput>({
    mutationFn: async ({ sentiment, message }) => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      return { id: `feedback_${Date.now()}`, createdAt: new Date().toISOString() };
    },
  });
}
```

**After (real):**

```typescript
import { feedbackService } from '@/lib/api/services/feedback';
import type { FeedbackSentiment } from '@/lib/api/types';
import { useMutation } from '@tanstack/react-query';

export interface SubmitFeedbackInput {
  sentiment: FeedbackSentiment;
  comment: string;          // renamed from `message`
}

export type SubmitFeedbackResult = Awaited<ReturnType<typeof feedbackService.submit>>;

export function useSubmitFeedback() {
  return useMutation<SubmitFeedbackResult, Error, SubmitFeedbackInput>({
    mutationFn: (input) => feedbackService.submit(input),
  });
}
```

**Key changes:**
- Property renamed: `message` → `comment` (matches server contract)
- Return type inferred from `feedbackService.submit` instead of hardcoded
- No artificial delay — real network call
- Error handling is inherited from `apiClient` (throws `ApiError` on non-2xx)

---

### 5. `components/feedback/feedback-composer.tsx` — Update field name

- The `submitFeedback.mutate` call passes `{ sentiment, message: trimmed }`.
  Change to `{ sentiment, comment: trimmed }`.

Line to change (around line 25):

```
submitFeedback.mutate(
  { sentiment, message: trimmed },   // old
  { sentiment, comment: trimmed },    // new
  ...
```

No other component changes are needed — the render path uses `submitFeedback.isPending`
and the `onSuccess`/`onError` callbacks, which keep the same shapes.

---

### 6. `components/feedback/feedback-screen.tsx` — No change expected

The orchestrator component passes `sentiment` state and callback props to
`FeedbackComposer`. It doesn't reference `authorId`/`message` directly, so the
type rename is transparent.

---

## Verification

1. `npm run lint` — no regressions
2. `npm run typecheck` — no type errors (verify `SubmitFeedbackInput.comment`,
   `feedbackService.submit` return type, and `FeedbackSubmission.userId`)
3. Manual: open `/feedback`, type a message, tap send → confirm 200 response
   and success confirmation view appears
4. Manual: submit empty body or invalid token → confirm error banner surfaces
   `ApiError.message`

---

## Edge Cases

| Scenario | Expected behaviour |
|---|---|
| Network failure | `apiClient` throws generic `ApiError` → error banner shown, input preserved |
| 401 response | `apiClient` auto-refreshes token; if refresh fails → `ApiError(401)` → error banner |
| 422 / validation error | `ApiError.errors` array surfaced in error banner (join with "; ") |
| Rate-limit (429) | `ApiError` with status 429 → error banner with retry affordance |
| Double-tap send | Button disabled while `isPending` — no duplicate POST |
