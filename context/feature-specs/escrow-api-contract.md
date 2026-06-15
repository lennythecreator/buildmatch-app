# Escrow API — Frontend Contract

Base URL: `http://localhost:3001/api/escrow`

All requests (except webhooks) require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

All responses follow the shape:
```ts
{ success: boolean; data?: T; message?: string; errors?: unknown }
```

---

## 1. Onboarding

### POST /api/escrow/onboard

Create an Escrow.com customer account for the current user.

**Auth:** any authenticated user

**Body:** none

**Response 201:**
```json
{
  "success": true,
  "data": {
    "escrowComEmail": "user+escrow@example.com",
    "message": "Escrow.com account created. Check your email to set a password."
  }
}
```

**Errors:**
- 404 — User not found
- 500 — Escrow.com platform account not configured

---

### GET /api/escrow/onboard/status

Check whether the current user has completed Escrow.com onboarding.

**Auth:** any authenticated user

**Response 200:**
```json
{
  "success": true,
  "data": {
    "hasAccount": true,
    "isVerified": true
  }
}
```

`hasAccount` is false when no Escrow.com email is on file. `isVerified` currently mirrors `hasAccount` (simplified check).

---

## 2. Funding a Job

### POST /api/escrow/fund-job/:jobId

Create an escrow payment for an AWARDED job. Both investor and awarded contractor **must** have completed onboarding first.

**Auth:** INVESTOR (must be the job owner)

**Body:**
```json
{
  "milestones": [
    { "title": "Kickoff",            "description": "Initial site visit", "percentage": 25 },
    { "title": "Mid-point",          "description": "Framing complete",  "percentage": 50 },
    { "title": "Final",              "description": "Project done",     "percentage": 25 }
  ]
}
```

| Field | Type | Rules |
|---|---|---|
| `milestones` | array | Required, max 10 items |
| `milestones[].title` | string | 2–120 chars |
| `milestones[].description` | string? | Max 500 chars |
| `milestones[].percentage` | number | 1–100, all items must sum to exactly 100 |

If `milestones` is empty, the server auto-generates defaults based on bid amount.

**Response 201:**
```json
{
  "success": true,
  "data": {
    "paymentUrl": "https://www.escrow-sandbox.com/transactions/abc123/payment",
    "escrowPayment": {
      "id": "cmq...",
      "jobId": "cmq...",
      "investorId": "cmq...",
      "contractorId": "cmq...",
      "totalAmount": 10000,
      "platformFeeAmount": 500,
      "status": "PENDING",
      "escrowComTransactionId": "txn_abc123",
      "escrowComRef": "cmq...",
      "milestones": [
        {
          "id": "cmq...",
          "escrowPaymentId": "cmq...",
          "title": "Kickoff",
          "description": "Initial site visit",
          "percentage": 25,
          "amount": 2500,
          "order": 1,
          "status": "PENDING",
          "escrowComItemId": "item_xyz",
          "disputeReason": null,
          "completionNotes": null,
          "approvedAt": null,
          "releasedAt": null
        }
      ],
      "createdAt": "2026-06-12T00:00:00.000Z",
      "updatedAt": "2026-06-12T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- 403 — Not the job owner
- 404 — Job not found
- 409 — Escrow already exists for this job
- 422 — Job not in AWARDED status
- 422 — No accepted bid found
- 422 — Investor has not set up Escrow.com account
- 422 — Contractor has not set up Escrow.com account
- 422 — Milestone percentages must sum to 100

**Frontend flow:** After a successful response, redirect the investor to `paymentUrl` (Escrow.com payment page) to fund the transaction.

---

## 3. Get Escrow Details

### GET /api/escrow/:jobId

Retrieve escrow payment and milestone details for a job.

**Auth:** INVESTOR (job owner) or CONTRACTOR (awarded bidder)

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "cmq...",
    "jobId": "cmq...",
    "investorId": "cmq...",
    "contractorId": "cmq...",
    "totalAmount": 10000,
    "platformFeeAmount": 500,
    "status": "PENDING",
    "escrowComTransactionId": "txn_abc123",
    "escrowComRef": "cmq...",
    "milestones": [
      {
        "id": "cmq...",
        "escrowPaymentId": "cmq...",
        "title": "Kickoff",
        "percentage": 25,
        "amount": 2500,
        "order": 1,
        "status": "PENDING",
        "escrowComItemId": "item_xyz",
        "disputeReason": null,
        "completionNotes": null,
        "approvedAt": null,
        "releasedAt": null,
        "createdAt": "2026-06-12T00:00:00.000Z"
      }
    ],
    "createdAt": "2026-06-12T00:00:00.000Z",
    "updatedAt": "2026-06-12T00:00:00.000Z"
  }
}
```

**Errors:** 403 — Forbidden (not a party to the job), 404 — Escrow not found

---

## 4. Milestone Lifecycle

### POST /api/escrow/:jobId/milestones/:milestoneId/submit

Contractor marks a milestone as complete and submits it for investor review.

**Auth:** CONTRACTOR (awarded bidder)

**Body:**
```json
{
  "completionNotes": "All work completed per scope. Photos attached."
}
```

| Field | Type | Rules |
|---|---|---|
| `completionNotes` | string? | Max 1000 chars |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "cmq...",
    "status": "SUBMITTED",
    "completionNotes": "All work completed per scope. Photos attached."
  }
}
```

**Errors:** 403 — Forbidden, 404 — Milestone not found, 422 — Milestone not in PENDING/IN_PROGRESS status

---

### POST /api/escrow/:jobId/milestones/:milestoneId/approve

Investor approves a submitted milestone. Funds are disbursed on Escrow.com.

**Auth:** INVESTOR (job owner)

**Body:** none

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "cmq...",
    "status": "APPROVED",
    "approvedAt": "2026-06-12T12:00:00.000Z"
  }
}
```

When all milestones are approved, the escrow payment status changes to `FULLY_RELEASED`.

**Errors:** 403 — Forbidden, 404 — Milestone not found, 422 — Milestone not in SUBMITTED status, 422 — Escrow transaction not found

---

### POST /api/escrow/:jobId/milestones/:milestoneId/dispute

Investor disputes a submitted milestone.

**Auth:** INVESTOR (job owner)

**Body:**
```json
{
  "reason": "The work does not match the scope. The electrical wiring is not up to code and needs to be redone."
}
```

| Field | Type | Rules |
|---|---|---|
| `reason` | string | 20–1000 chars |

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "cmq...",
    "status": "DISPUTED",
    "disputeReason": "The work does not match the scope..."
  }
}
```

The escrow payment status is also set to `DISPUTED`.

**Errors:** 403 — Forbidden, 404 — Milestone not found, 422 — Milestone not in SUBMITTED status

---

## 5. Milestone Statuses

```
PENDING → (contractor submits) → SUBMITTED → (investor approves) → APPROVED
                                              → (investor disputes) → DISPUTED
DISPUTED → (admin resolves RELEASE) → APPROVED
         → (admin resolves REFUND)  → RELEASED
```

## 6. Escrow Payment Statuses

```
PENDING → FUNDED → IN_PROGRESS → FULLY_RELEASED
         → DISPUTED → IN_PROGRESS
                    → REFUNDED
```

## 7. Error Response Format

All errors follow this shape:
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

Validation errors (422) may include an `errors` field with field-level details:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "reason": ["String must contain at least 20 character(s)"]
  }
}
```

## 8. Notes for Mobile Frontend

- **Payment flow:** `POST /api/escrow/fund-job/:jobId` returns a `paymentUrl`. The investor needs to open this URL in a browser (WebView or system browser) to complete funding on Escrow.com. BuildMatch never handles payment credentials directly.
- **Polling:** After the investor completes payment on Escrow.com, the webhook updates the escrow status. The mobile app should poll `GET /api/escrow/:jobId` or refresh after the webhook fires (eventual consistency).
- **Milestone UI:** Show milestones as a list with their current `status`. The contractor can only submit PENDING milestones; the investor can only approve/dispute SUBMITTED milestones.
- **`resolve-dispute` is admin-only.** This endpoint exists on the server but is not exposed via the public API — it's triggered through the admin panel. Mobile users do not call it.
