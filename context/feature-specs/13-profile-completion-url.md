# Profile Completion URL — Escrow.com Onboarding Redirect

When a user creates an Escrow.com account from the app, the frontend sends a
`profileCompletionUrl` in the onboard request so Escrow.com can redirect the user back
into BuildMatch after they finish setting their password and verifying their identity.

Without this parameter, the user is left on Escrow.com with no way back into the app.

## Scope (Frontend Only)

- Generate the correct redirect URL on the frontend for the current runtime (Expo Go / production)
- Send `profileCompletionUrl` in the `POST /api/escrow/onboard` request body
- Handle the Escrow.com redirect-back in the app via deep link so the user lands on the escrow screen
- Update the onboard status query to pick up the fresh `hasAccount: true` state after return

## Out of Scope

- Any backend implementation — the backend must accept `profileCompletionUrl` on
  `POST /api/escrow/onboard` and forward it to Escrow.com, but that is the backend's concern
- Retry or recovery flows if the user closes the browser before the redirect fires

## Redirect URL

The app's custom scheme `buildmatchapp://` (registered in `app.json`) works in both Expo Go
and production builds. The URL includes the job ID so the user lands back on the correct screen:

```
buildmatchapp://escrow/{jobId}
```

No `.env` variables or `expo-linking` utilities are needed — the scheme is static and
`expo-router` auto-resolves any registered route from a deep link.

## Frontend Changes

### 1. Types — Add `EscrowOnboardInput`

In `lib/api/types.ts`, add a new input interface alongside `EscrowOnboardResponse`:

```typescript
export interface EscrowOnboardInput {
  profileCompletionUrl?: string;
}
```

### 2. Service — Update `escrowService.onboard()`

In `lib/api/services/escrow.ts`, accept an optional input body instead of sending `{}`:

```typescript
onboard: (input?: EscrowOnboardInput) =>
  apiClient.post<EscrowOnboardResponse>('/api/escrow/onboard', input ?? {}),
```

The request the frontend sends becomes:
```json
{ "profileCompletionUrl": "buildmatchapp://escrow/cmq123abc" }
```

The response shape does not change:
```json
{
  "success": true,
  "data": {
    "escrowComEmail": "user+escrow@example.com",
    "message": "Escrow.com account created. Check your email to set a password."
  }
}
```

### 3. Helper — `buildProfileCompletionUrl()`

Create `lib/escrow/profile-completion-url.ts`:

```typescript
export function buildProfileCompletionUrl(jobId: string): string {
  return `buildmatchapp://escrow/${jobId}`;
}
```

Using the static custom scheme directly avoids `expo-linking.createURL()` which produces
`exp://` URLs in Expo Go that Escrow.com cannot redirect to reliably.

### 4. Hook — Update `useEscrowOnboard()`

In `hooks/useEscrow.ts`, change `mutationFn` to accept an optional `jobId` and build the
redirect URL from it:

```typescript
export function useEscrowOnboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId?: string) => {
      const input: EscrowOnboardInput | undefined = jobId
        ? { profileCompletionUrl: buildProfileCompletionUrl(jobId) }
        : undefined;
      return escrowService.onboard(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...ESCROW_QUERY_KEY, 'onboard-status'] });
    },
  });
}
```

The mutation's `onSuccess` already invalidates the onboard-status query, so the escrow
screen picks up the updated `hasAccount: true` / `isVerified: true` automatically on the
next mount or refetch.

### 5. Screen — Pass `jobId` to the Onboard Mutation

In `components/escrow/escrow-screen.tsx`, there are two places that call
`escrowOnboard.mutate()`:

**Investor "Set up account" (in `handleFund`):**
```typescript
escrowOnboard.mutate(jobId, {
  onSuccess: (result) => {
    Alert.alert(
      'Account created',
      `${result.message}\n\nYou will be redirected back here once your account is set up.`
    );
  },
  onError: () => {
    Alert.alert('Setup failed', 'Could not create Escrow.com account. Please try again.');
  },
});
```

**Contractor "Set up account" (in the JSX):**
```typescript
escrowOnboard.mutate(jobId, {
  onSuccess: (result) => {
    Alert.alert(
      'Account created',
      `${result.message}\n\nYou will be redirected back here once your account is set up.`
    );
  },
  onError: () => {
    Alert.alert('Setup failed', 'Could not create Escrow.com account. Please try again.');
  },
});
```

Update both Alert messages to tell the user they will be redirected back automatically
(replacing the previous generic "After setting your password, return here…" text).

### 6. Deep Link Handling — No Changes Needed

`expo-router` intercepts `buildmatchapp://escrow/{jobId}` and resolves it to
`app/escrow/[jobId].tsx` automatically because that route exists.

The escrow screen already calls `useEscrowOnboardStatus()` on mount. When the user returns
from Escrow.com, the query fires and reflects the updated `hasAccount: true` / `isVerified: true`
state. The UI transitions on its own.

## Flow Walkthrough

```
1. User taps "Set up account" on the escrow screen
2. App calls buildProfileCompletionUrl(jobId) → "buildmatchapp://escrow/cmq123abc"
3. App sends POST /api/escrow/onboard { profileCompletionUrl: "buildmatchapp://escrow/cmq123abc" }
4. Backend creates the Escrow.com customer with the redirect URL attached
5. Backend returns { escrowComEmail, message }
6. App shows Alert: "Account created. Check your email to set a password."
7. User opens email, clicks Escrow.com link
8. User sets password and completes identity verification on Escrow.com
9. Escrow.com redirects the browser to buildmatchapp://escrow/cmq123abc
10. Expo Router intercepts the deep link and opens the escrow screen
11. Escrow screen mounts, useEscrowOnboardStatus fires, sees hasAccount: true
12. UI updates: "Set up account" CTA disappears; fund/payment-protection view becomes available
```

## Edge Cases

| Scenario | Frontend Behavior |
|---|---|
| User closes browser before redirect | They can open the app manually. `useEscrowOnboardStatus` picks up the completed state on the next request. |
| User never completes onboarding | `hasAccount` stays `false`. The "Set up account" CTA remains. No retry logic — user retaps the button. |
| Backend does not support `profileCompletionUrl` | The field is silently ignored. Degrades to current behavior — no redirect, user returns manually. The frontend still sends the field; no breakage. |
| Invalid job ID in deep link | Expo Router shows its default unhandled-route screen. This should not happen in normal flow since the job ID comes from the current screen. |

## Environment Notes (Expo Go)

- The `buildmatchapp://` scheme is registered by Expo automatically in both Expo Go and
  production builds — no extra configuration needed.
- `expo-web-browser` is not involved here; the user goes through their email client, not
  an in-app browser.
- The redirect URL in `profileCompletionUrl` is consumed by Escrow.com's server-side
  redirect, not opened by the app directly.
