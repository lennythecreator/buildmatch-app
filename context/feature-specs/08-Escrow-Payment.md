# Escrow Payment (Fund Escrow)

This feature is where a Developer (Investor) secures the agreed project funds in escrow after a
bid is accepted and the project agreement is in place. It gives both parties confidence that the
money exists and is protected before work begins.

The screen is **role-aware**: the Developer sees a funding / checkout experience, while the
Contractor sees a read-only **payment protection** view of the same deal (what they will be paid,
the fee structure, the schedule, and whether funds are secured yet).

## MVP Scope

- Show a single "Fund Escrow" screen for the awarded job.
- Use existing job, accepted bid, contractor, and draw-schedule data — no new data models.
- Present a payment summary: contractor, verified bid amount, and escrow protection fee.
- Present the **payment schedule** sourced from the existing `DrawSchedule` milestones, with
  completed / active / upcoming states.
- Present an order total (bid amount + escrow fee) and the amount to be secured in escrow.
- Developer view: a primary **Fund Escrow** action (simulated for MVP) plus a secondary
  "Review agreement" link.
- Contractor view: the same summary and schedule rendered read-only, with a status banner
  ("Awaiting client funding" / "Funds secured in escrow") instead of the funding action.
- Show a support / "How escrow works" helper card.
- Clearly label funding as a preview action that does not move real money yet.

## Out of Scope for MVP

- Real payment capture, charges, or money movement.
- A backend escrow ledger or funding endpoint (documented under Future Backend Requirements).
- Adding / editing billing methods inside this screen (uses the default `BillingMethod` only;
  full billing-method management is a separate feature).
- Releasing funds, milestone draw requests, refunds, or dispute payouts (covered by the existing
  draws + disputes features).
- Receipts, invoices, or tax handling.

## Roles & Access Control

- **Developer (Investor):** Sees the funding / checkout version with the Fund Escrow action.
  Must be the job owner (`job.investorId === user.id`).
- **Contractor:** Sees the read-only payment protection version. Must be the contractor on the
  accepted bid for this job.
- Any other user must be blocked with a "You don't have access to this escrow" message — mirror
  the strict access checks used in the Dispute Details screen.
- The screen is only meaningful once the job is `AWARDED` with an `ACCEPTED` bid. For earlier
  statuses, show a guarded empty state ("Escrow opens once a bid is accepted").

## Data Models

Reuse existing models — no schema changes. Relevant types live in `lib/api/types.ts`:

```typescript
// Existing — drives the payment schedule
export interface DrawMilestone {
  id: string;
  drawScheduleId: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  isCompleted: boolean;
  order: number;
  request?: DrawRequest;
}

export interface DrawSchedule {
  id: string;
  jobId: string;
  milestones: DrawMilestone[];
  status: 'PENDING' | 'APPROVED' | 'LOCKED';
  investorApproved: boolean;
  contractorApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Existing — funding source shown on the order total card
export interface BillingMethod {
  id: string;
  type: 'CARD' | 'PAYPAL' | 'VENMO';
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
  createdAt: string;
}
```

### Derived escrow summary (client-side, MVP)

Computed in a small helper (e.g. `lib/escrow/escrow-summary.ts`) from the job, accepted bid, and
draw schedule. Keep the fee rate in one constant so it is easy to change later.

```typescript
export const ESCROW_FEE_RATE = 0.02; // 2.0% protection fee (per Figma)

export interface EscrowSummary {
  contractorName: string;
  investorName: string; // name of the investor this can be gotten from global state if needed
  bidAmount: number;        // from the ACCEPTED bid
  escrowFee: number;        // round(bidAmount * ESCROW_FEE_RATE)
  orderTotal: number;       // bidAmount + escrowFee — amount secured in escrow
  feeRate: number;          // ESCROW_FEE_RATE, for the "2.0% Protection Fee" label
  schedule: DrawMilestone[]; // ordered milestones for the payment schedule
}
```

## Hooks to Implement / Reuse

- `useJob(jobId)` — existing.
- `useBids(jobId)` / `useMyBid(jobId)` — existing; resolve the `ACCEPTED` bid.
- `useDrawSchedule(jobId)` — wrap `drawService.getSchedule`; create in `hooks/useDraws.ts` if it
  does not exist yet.
- `useBillingMethods()` — wrap `billingService.list`; create in `hooks/useBilling.ts`. Used only to
  display the default method on the order total card.
- `useFundEscrow()` — **MVP stub**. A mutation that simulates funding (artificial delay → success)
  and is the single seam to swap for the real `escrowService.fund` later. Returns an optimistic
  "secured" state for the UI.

## Route & Entry Point

- Route: `app/escrow/[jobId].tsx`.
- Entry points (Developer): from the signed project agreement step **and** from the awarded job
  detail screen (`app/job/[id].tsx`) — add a "Fund Escrow" action next to the existing
  "Project agreement" button when `job.status === 'AWARDED'`.
- Entry point (Contractor): from the same awarded job detail screen — the action reads
  "View escrow" / "Payment protection".
- Use a centered `Stack.Screen` header titled "Escrow" with `headerShadowVisible: false` and the
  brand `background` color (`hsl(0 0% 98%)`), consistent with the job detail screen.

## System Requirements & Global UI States

- **Loading State:** Ring spinner + short contextual message ("Preparing escrow details…"),
  matching the agreement and dispute screens.
- **Empty / guarded State:** Brief prompt when there is no accepted bid or no draw schedule yet
  ("Escrow opens once a bid is accepted and a payment schedule is approved").
- **Error State:** `bg-danger/10` card with `text-danger` copy and a retry affordance, consistent
  with existing screens.
- **MVP funding notice:** A clear inline note that this is a protected-funds preview and no real
  charge occurs yet.

## Layout & Components

Build with NativeWind and the existing `ui/` primitives (`Button`, `Badge`, `Card`). **Brand
tokens are the source of truth, not the Figma hex values.** The Figma defines the *layout*; every
color, surface, and radius must resolve to the brand tokens in `global.css` (`@theme`) and
`lib/theme.ts`. Use the Figma palette only as a hint for which brand token to reach for.

| Brand token (use this) | Defined as | Replaces Figma value |
|---|---|---|
| `primary` / `accent` — `bg-primary`, `text-accent`, `Button variant="primary"` | `hsl(210 100% 15%)` → #00264d navy | Figma `#0F172A` dark surfaces + primary CTA → use **brand navy**, not slate-900 |
| `secondary` — `bg-secondary`, `text-secondary`, `Button variant="secondary"` | `hsl(142 76% 36%)` → #16a34a | Figma `#16A34A` verified green (exact brand match) |
| `background` — `bg-background` | `hsl(0 0% 98%)` | Figma `#F8FAFC` page background |
| `surface` — `bg-surface` | `#ffffff` | Figma white cards |
| `foreground` — `text-foreground`; `text-foreground/60` for muted | `hsl(240 10% 4%)` | Figma `#0F172A` body text / `#64748B` muted labels |
| `border` — `border-border` | `hsl(240 5% 84%)` | Figma hairline borders |
| `danger` — `text-danger` | `hsl(0 84% 60%)` | error / destructive states |
| Radius — `rounded-3xl` (`--radius-3xl` = 32px), `rounded-2xl` (24px), `rounded-xl` (16px), `rounded-lg` (12px) | brand radius scale (extended to `2xl`/`3xl`) | Figma 32/24/16/12px → all map cleanly to brand radii now |

Known token gaps (decide before building):
- **No brand "muted surface" token.** The Figma `#F1F5F9` subtle panels (info box, support card,
  schedule rows) have no brand equivalent. Use `bg-foreground/5` so it derives from a brand token
  rather than hardcoding `bg-slate-100`. If this surface recurs across features, add a
  `--color-muted` token to `global.css` instead.
- **No brand "muted text" CSS token.** Use `text-foreground/60` for uppercase labels and sublabels
  (matches the agreement screen), not raw `text-slate-500`.
- The shipped job-detail screen currently uses raw slate utilities and bypasses brand navy — this
  spec deliberately corrects course to brand tokens. Track that drift as a separate cleanup.

Keep the screen in a single `ScrollView` (`contentContainerStyle={{ padding: 24, gap: 24 }}`).

### 1. Magazine Hero Header

Create `components/escrow/escrow-hero.tsx`.

- Dark rounded card (`bg-primary` brand navy, `rounded-3xl`) using the job's primary photo as a
  dimmed background with a bottom-to-top gradient, falling back to a solid `bg-primary` card when no
  photo exists.
- A status pill — `secondary` (green) for funded/verified, muted (`bg-foreground/10`) for awaiting —
  e.g. "AWAITING ESCROW", "FUNDS SECURED".
- The job title in large `text-primary-foreground` (white) bold text.

### 2. Summary Card — Payment Verification

Create `components/escrow/escrow-summary-card.tsx`.

- `bg-surface` `rounded-3xl` card with a "Payment Verification" heading.
- Three labelled rows (uppercase `text-foreground/60` label → value):
  - **Contractor** — name, with a small `text-secondary` check + "Verified" line.
  - **Bid Amount** — the accepted bid amount, sublabel "Fixed-Price Contract".
  - **Escrow Fee** — computed fee, sublabel "2.0% Protection Fee".

### 3. Draw Schedule

Create `components/escrow/payment-schedule.tsx`.

- `bg-surface` `rounded-2xl` card titled "Draw Schedule".
- Render `DrawSchedule.milestones` (ordered by `order`) as rows: a numbered circle, the milestone
  title + sublabel (due date or description), and the milestone amount.
- State styling: completed milestones use a `bg-primary` filled circle; the active/next milestone is
  emphasized; upcoming milestones are dimmed (`opacity-60`), per the Figma.
- Empty state when no schedule exists yet, pointing the user to approve the draw schedule first.

### 4. Order Total / Finalize (Developer)

Create `components/escrow/escrow-order-total.tsx`.

- `bg-surface` `rounded-3xl` card titled "Order Total", sublabel "Amount to be secured in Escrow".
- Rows: Bid Amount, Escrow Fee, divider (`border-border`), then the bold **Total** in large type.
- A `bg-foreground/5` info box: short copy on how funds are protected (lock icon).
- Primary **Fund Escrow** button (`Button variant="primary"`) wired to `useFundEscrow` (stubbed),
  with a loading state. On success, transition the screen to the "Funds secured" state.
- Secondary text button: "Review agreement" → routes to `app/agreements/[jobId].tsx`.
- Show the default `BillingMethod` (e.g. "Visa •••• 4242") near the action; if none exists, prompt
  to add one (link out, since billing-method management is out of scope here).

### 5. Payment Protection (Contractor variant)

In the same `escrow-order-total.tsx` (role branch) or a sibling
`components/escrow/escrow-protection-status.tsx`.

- Replaces the funding action for contractors with a read-only status panel:
  - "Awaiting client funding" (muted, `text-foreground/60`) before funding, or "Funds secured in
    escrow" (`text-secondary`) after.
  - Restates the total they are protected for and the payout schedule.
- No Fund Escrow button; emphasis is on reassurance, not action.

### 6. Support Card

Create `components/escrow/escrow-support-card.tsx`.

- `bg-foreground/5` `rounded-2xl` row card with a circular `bg-surface` icon, a bold title
  ("Questions about escrow?"), and a `text-foreground/60` sublabel linking to help / support.

## Future Backend Requirements

When the backend escrow ledger lands, replace the `useFundEscrow` stub with a real service. Proposed
contract (`lib/api/services/escrow.ts`):

- `getEscrow(jobId)` → escrow account state: status (`UNFUNDED | HELD | PARTIALLY_RELEASED |
  RELEASED | REFUNDED`), funded amount, fee, held balance, funding method, timestamps.
- `fund(jobId, { billingMethodId })` → capture funds into escrow; returns updated escrow state.
- (Later, out of scope here) `release(jobId, milestoneId)` and `refund(jobId)` for the lifecycle.

Backend should also persist: the fee rate applied at funding time, the funding billing method, and
audit events for fund / release / refund so the UI can render an accurate history.
