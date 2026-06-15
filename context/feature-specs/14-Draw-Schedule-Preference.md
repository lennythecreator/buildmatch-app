# Draw Schedule Preference

Rename "Payment Schedule" → "Draw Schedule" across the app and add a payment
preference option so the investor chooses between milestone-based draws or a
lump-sum payout when accepting a bid.

## Intended Behaviour

### 1. Terminology change: "Payment Schedule" → "Draw Schedule"

Every user-facing label that currently reads "Payment Schedule" is renamed to
**"Draw Schedule"**. This includes:

- The card title in `components/escrow/payment-schedule.tsx` (line 39 and 53:
  `"Payment Schedule"` → `"Draw Schedule"`).
- The empty-state text (line 43: `"No milestones defined yet. Fund the escrow
  to create a payment schedule."` → `"No draw schedule defined yet. Fund the
  escrow to create a draw schedule."`).
- The escrow spec reference in `context/feature-specs/08-Escrow-Payment.md`
  section 3 heading.
- Any spec references to "payment schedule" in the context of milestones /
  draws should use "draw schedule" instead.

The **file name** `components/escrow/payment-schedule.tsx` may be kept as-is
for git history continuity, but the **exported component name** should be
renamed from `PaymentSchedule` to `DrawSchedule`, and the import in
`components/escrow/escrow-screen.tsx` updated accordingly.

### 2. Payment preference on bid acceptance

When an investor accepts a bid, they are prompted to choose how they want to
pay **before** the escrow screen is shown:

- **Option A — Draw Schedule (milestones):** Payments are released in stages
  as work completes. A draw schedule with milestones is generated. This is the
  existing flow.
- **Option B — Pay on completion (lump sum):** The full bid amount is held in
  escrow and released as a single payment when the contractor marks the job as
  complete.

The choice is stored so the escrow screen, the agreement, and the milestone UI
all respect it.

### 3. Flow changes by screen

#### a) Bid acceptance action (app/job/[id].tsx or bid detail)

When the investor taps "Accept Bid", instead of proceeding directly to the
agreement/escrow flow, show a bottom-sheet or inline selector:

```
How would you like to pay?

[Draw Schedule] – Pay in stages as work completes
[Pay on completion] – Release full amount when job is done
```

Selection is required before continuing. After selection, proceed to the
existing agreement flow.

#### b) Escrow screen (app/escrow/[jobId].tsx)

- If **Draw Schedule** was selected: render the full milestone list (existing
  `DrawSchedule` component, now renamed to `DrawSchedule`).
- If **Pay on completion** was selected: render a simplified view with a
  single milestone labelled "Project Completion — Full Payment" equal to the
  bid amount, and skip the multi-milestone draw schedule UI. The contractor
  submits one completion request, the investor approves, and the full amount
  releases.

#### c) Payment Schedule component (components/escrow/payment-schedule.tsx)

Renamed from `PaymentSchedule` to `DrawSchedule`. The existing milestone
rendering logic stays unchanged for draw-schedule jobs. For lump-sum jobs,
the component receives a single default milestone and renders it as a single
row with simplified status tracking.

#### d) Agreement draft (lib/agreements/project-agreement-draft.ts)

The agreement text should reflect the chosen payment method:

- Draw Schedule: `"Payment will be released incrementally as milestones in the
  draw schedule are completed and approved."`
- Pay on completion: `"The full contract amount will be released upon project
  completion and approval."`

### 4. Data model changes

Add an optional field to the job or the accepted-bid relationship:

```typescript
// In lib/api/types.ts
export type PaymentPreference = 'DRAW_SCHEDULE' | 'LUMPSUM';

// Extend the existing Job or Bid type
export interface Job {
  // …existing fields…
  paymentPreference?: PaymentPreference;
}
```

The `paymentPreference` field is set at bid-acceptance time and sent to the
backend. The escrow screen reads this field to decide which UI to render.

### 5. Confirmed API contract

#### PUT /api/jobs/:jobId/bids/:bidId/accept

```
Authorization: Bearer <token>
Content-Type: application/json

{ "paymentPreference": "DRAW_SCHEDULE" }
```

- Omit body entirely for default behaviour (no paymentPreference → stored as
  `DRAW_SCHEDULE`).

Response 200:
```json
{
  "success": true,
  "data": { /* bid object */ },
  "message": "Bid accepted"
}
```

#### GET /api/jobs/:id — single job

```json
{
  "success": true,
  "data": {
    "id": "cmq...",
    "title": "Garden Installation",
    "paymentPreference": "DRAW_SCHEDULE",
    "bidAmountFunded": 5000,
    "escrowStatus": "NOT_STARTED",
    "drawSchedule": { ... },
    "acceptedBid": { ... }
  }
}
```

#### GET /api/jobs — job list

Every job object includes `paymentPreference`:
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "cmq...",
        "paymentPreference": "LUMPSUM"
      }
    ]
  }
}
```

#### POST /api/jobs/:jobId/draws/generate — guarded

Returns **422** if the job has `paymentPreference: "LUMPSUM"`:
```json
{
  "success": false,
  "message": "Draw schedule cannot be generated for lump-sum payment jobs"
}
```

The frontend must not call `draws/generate` for lump-sum jobs.

### 6. Implementation order

1. Rename `PaymentSchedule` → `DrawSchedule` (component, imports, labels).
2. Add `PaymentPreference` type and extend `CreateJobInput` / `Job` if needed.
3. Add the preference selector to the bid-acceptance flow.
4. Thread `paymentPreference` through the escrow screen and conditionally
   render the draw-schedule or lump-sum views.
5. Update the agreement draft text based on preference.
6. Update spec (`08-Escrow-Payment.md`) to reference Draw Schedule.

## Out of Scope

- Editing payment preference after bid acceptance (lock it at acceptance time).
- Backend persistence of payment preference (covered by MVP local fallback).
- Partial / custom draw schedules — the draw schedule is always generated by
  the existing AI or manual flow; this spec only gates whether draws are used
  at all.
