# Feedback Screen

This screen is where any user sends product feedback directly to the BuildMatch founders. It is
framed as a warm, personal **conversation with the founding team** rather than a sterile form: an
editorial headline invites the user to speak candidly, a sentiment toggle lets them frame the
feedback as positive or critical, a founder message bubble opens the dialogue, and a pill-shaped
composer pinned to the bottom captures the message.

The tone is intentionally human and "indie founder" — the founders are present, listening, and
genuinely want one honest thing the user would change.

## MVP Scope

- A single scrollable feedback screen reachable from settings / profile / help.
- A **status widget** showing the founders are "online and listening" (stacked founder avatars,
  a live green dot, a short status line) with an overflow menu.
- An **editorial headline** section ("SPEAK YOUR TRUTH.") with a supporting subtitle.
- A **sentiment toggle** (Positive / Negative) that tags the submitted feedback — defaults to
  Positive.
- A **founder message bubble** with a warm opening prompt.
- A **pill-shaped composer** pinned near the bottom: text input, an attach/extra action, and a
  primary send button.
- Submitting feedback calls a single hook seam (`useSubmitFeedback`) — an **MVP stub** that
  simulates success (artificial delay → confirmation), with a clear seam to swap for a real
  endpoint later.
- A success confirmation state ("Thank you — the founders got your note") after sending.

## Out of Scope for MVP

- A real feedback backend, ticketing, or email delivery (documented under Future Backend
  Requirements).
- A threaded, two-way conversation / live reply from founders — this is fire-and-forget for MVP
  (the founder bubble is a static prompt, not a live chat).
- Attachments / screenshots upload (the composer's secondary action is a placeholder for MVP;
  wire it to attachment handling later).
- Categorization, ratings (NPS / stars), or routing by topic.
- Editing or viewing past submitted feedback history.

## Roles & Access Control

- Available to **any authenticated user** (Contractor or Developer) — feedback is universal.
- No ownership or job-scoped checks. The only requirement is an authenticated session so the
  submission can be attributed to `user.id`.

## Data Models

No existing model covers feedback. Introduce a small client-facing type (place alongside other API
types, e.g. `lib/api/types.ts`); no schema change is wired for MVP since submission is stubbed.

```typescript
export type FeedbackSentiment = 'POSITIVE' | 'NEGATIVE';

export interface FeedbackSubmission {
  id: string;
  authorId: string;          // user.id from global auth state
  sentiment: FeedbackSentiment;
  message: string;
  createdAt: string;
}

// Static content for the "founders listening" widget — hardcoded for MVP.
export interface FounderPresence {
  founders: { name: string; avatarUrl?: string }[]; // stacked avatars
  isOnline: boolean;         // drives the green live dot
  statusLine: string;        // e.g. "Founders are listening"
}
```

## Hooks to Implement / Reuse

- `useSubmitFeedback()` — **MVP stub**. A mutation that takes `{ sentiment, message }`, simulates a
  network round-trip (artificial delay → success), and is the single seam to swap for the real
  `feedbackService.submit` later. Exposes `isPending` / `isSuccess` / `error` for the composer and
  confirmation states.
- Reuse existing auth/global state to read the current `user.id` for attribution.

## Route & Entry Point

- Route: `app/feedback/index.tsx`.
- Entry points: a "Send feedback" / "Talk to the founders" row in settings, profile, or a help
  menu.
- Header: a centered `Stack.Screen` header titled **"Feedback"** with `headerShadowVisible: false`
  and the brand `background` color, consistent with the escrow and agreement screens. The Figma's
  custom translucent top app bar (blurred `rgba(247,249,251,0.7)` bar with a circular back button
  and an uppercase "FEEDBACK" title) maps onto this standard header — keep the back affordance and
  uppercase title, drop the bespoke blur unless it comes for free.

## System Requirements & Global UI States

- **Loading State:** Minimal — the screen content is mostly static, so no full-screen spinner is
  needed. The send action shows an inline pending state on the button.
- **Empty input State:** The send button is disabled until the input is non-empty (trimmed).
- **Submitting State:** Send button shows a spinner / disabled state; the input is locked.
- **Success State:** Replace or overlay the composer with a confirmation ("Thank you — the founders
  got your note"), and either clear the input or dismiss the screen.
- **Error State:** `bg-danger/10` card with `text-danger` copy and a retry affordance, consistent
  with existing screens; keep the typed message intact so the user does not lose it.

## Layout & Components

Build with NativeWind and the existing `ui/` primitives (`Button`, `Badge`, `Card`). **Brand tokens
are the source of truth, not the Figma hex values.** The Figma defines the *layout*; every color,
surface, and radius must resolve to the brand tokens in `global.css` (`@theme`) and `lib/theme.ts`.
Use the Figma palette only as a hint for which brand token to reach for.

| Brand token (use this) | Defined as | Replaces Figma value |
|---|---|---|
| `foreground` — `bg-foreground`, `text-foreground` | `hsl(240 10% 4%)` | Figma `#000000` / `#191C1E` black surfaces (toggle track, send button), headline + body text |
| `primary-foreground` / `surface` — `bg-surface`, `text-primary-foreground` | `#ffffff` | Figma `#FFFFFF` white cards, active toggle pill, input background, send icon |
| `secondary` — `text-secondary`, `bg-secondary` | `hsl(142 76% 36%)` → #16a34a | Figma live green dot `#0A6E00` and the neon glow `rgba(121,255,95,…)` — use brand green; the neon glow is decorative only |
| `background` — `bg-background` | `hsl(0 0% 98%)` | Figma page gradient `#F7F9FB` |
| `border` — `border-border` | `hsl(240 5% 84%)` | Figma hairline borders (`rgba(198,198,205,…)`, `rgba(121,255,95,0.3)` input ring) |
| `danger` — `text-danger`, `bg-danger/10` | `hsl(0 84% 60%)` | Figma negative-sentiment red `rgba(186,26,26,…)` |
| Muted text — `text-foreground/60` (and `/40` for placeholder) | derived from `foreground` | Figma `#45464D`, `rgba(69,70,77,0.4/0.8)` muted/label/placeholder text |
| Radius — `rounded-3xl` (32px), `rounded-2xl` (24px), `rounded-full` | brand radius scale | Figma 24/32px cards and `9999px` pills |
| Font — `font-extrabold` / `font-bold` / `font-medium` (Plus Jakarta Sans) | brand font cuts | Figma `Plus Jakarta Sans` 800/700/500 (exact brand match — keep the real weight utilities) |

Known token gaps (decide before building):
- **No brand "muted surface" token.** The Figma `#F2F4F6` founder bubble and `#ECEEF0` round icon
  button have no brand equivalent. Use `bg-foreground/5` so they derive from a brand token rather
  than hardcoding slate. If this surface recurs, add a `--color-muted` token to `global.css`.
- **Neon accent green (`#79FF5C`).** Used only as a soft glow / shadow behind the active toggle and
  the center watermark. It is *not* a brand token; treat it as a decorative shadow (low-opacity
  `secondary` or drop it) rather than introducing a new color token.

Keep the screen in a single `ScrollView` (`contentContainerStyle={{ padding: 24, gap: 24 }}`) with
the composer pinned to the bottom (absolute / keyboard-avoiding), matching the Figma where the input
floats above the safe area.

### 1. Founder Presence / Status Widget

Create `components/feedback/founder-status-widget.tsx`.

- `bg-surface` `rounded-2xl` card, hairline `border-border`, soft shadow.
- Left: **stacked, overlapping founder avatars** (circular, 2px white ring, second avatar offset
  left to overlap). Fall back to initials/placeholder when no `avatarUrl`.
- A small **live dot** (`bg-secondary`, 8px circle) + uppercase label (`text-foreground/60`,
  `font-bold`, letter-spaced) e.g. "ONLINE", with a `text-foreground/80` `font-medium` status line
  beneath ("Founders are listening").
- Right: a circular `bg-foreground/5` overflow (•••) button — menu is decorative for MVP.

### 2. Editorial Headline

Create `components/feedback/feedback-headline.tsx` (or inline).

- Large uppercase headline — **"SPEAK YOUR TRUTH."** — `font-extrabold`, tight letter-spacing,
  `text-foreground`, ~40–45px scaled responsibly for mobile (clamp so it does not overflow narrow
  screens).
- A `text-foreground/80` `font-medium` subtitle inviting honest feedback.

### 3. Sentiment Toggle

Create `components/feedback/sentiment-toggle.tsx`.

- A pill-shaped `bg-foreground` (black) track, `rounded-full`, holding two equal segments.
- **Positive** segment (selected by default): `bg-surface` (white) pill, `text-foreground`
  `font-extrabold` uppercase label, with an optional soft green glow shadow (decorative neon — keep
  subtle or use low-opacity `secondary`).
- **Negative** segment: translucent red (`bg-danger/10`), `text-primary-foreground/80` uppercase
  label when unselected; mirror the selected/unselected treatment when toggled.
- Controlled component: `value: FeedbackSentiment` + `onChange`. Defaults to `POSITIVE`.
- Use clear, friendly labels (e.g. "LOVE IT" / "NEEDS WORK") — the exact copy from Figma; tie the
  selected value to the submission's `sentiment`.

### 4. Center Visual / Watermark

Create `components/feedback/feedback-watermark.tsx` (or inline).

- A large, low-opacity **BM watermark logo** centered, with a soft green radial glow behind it
  (decorative blur — `secondary` at low opacity, or omit the blur if it costs too much on RN).
- Purely decorative; no interaction. Should sit behind/around the founder bubble without blocking
  taps.

### 5. Founder Message Bubble

Create `components/feedback/founder-message-bubble.tsx`.

- A received-style speech bubble: `bg-foreground/5`, hairline `border-border`,
  `rounded-3xl` with a squared **bottom-left** corner (`rounded-bl-none`) to read as "from the
  founder" (left-aligned), per the Figma.
- `text-foreground` `font-medium` body with the opening prompt:
  *"Hey! Founder here. We're obsessing over making BuildMatch perfect. What's one thing we should
  change today?"*
- Static content for MVP (not a live message).

### 6. Pill-Shaped Composer

Create `components/feedback/feedback-composer.tsx`.

- Pinned near the bottom (absolute over the scroll content / keyboard-avoiding), centered with
  horizontal padding.
- A `bg-surface` `rounded-full` bar, hairline ring (`border-border`), with a soft elevation shadow.
- Left: a circular **send/primary action** is on the *right* per Figma — a `bg-foreground` (black)
  `rounded-full` button with a white send icon (paper-plane / arrow). Disabled until the trimmed
  input is non-empty; shows a pending state while submitting.
- A multiline-capable `TextInput` filling the middle with placeholder
  *"Tell us what makes you smile... ❤️"* (`text-foreground/40` placeholder, `text-foreground`
  `font-semibold` input text).
- An optional secondary action button (the Figma's extra icon) — **placeholder** for attachments;
  no-op / hidden for MVP.
- On send: call `useSubmitFeedback({ sentiment, message })`. On success, clear the input and show
  the confirmation state; on error, surface the error card and keep the text.

## Future Backend Requirements

When a feedback backend lands, replace the `useSubmitFeedback` stub with a real service. Proposed
contract (`lib/api/services/feedback.ts`):

- `submit({ sentiment, message })` → persists a `FeedbackSubmission` attributed to the authenticated
  user; returns the created record. Should capture `sentiment`, `message`, `authorId`, app version /
  platform metadata, and `createdAt`.
- (Later, out of scope here) `list()` for an internal founder inbox, and a `reply` path if feedback
  ever becomes a true two-way thread.

Backend should also handle: rate limiting / spam protection, optional notification to the founders
(email / Slack), and (when attachments land) signed upload URLs for screenshots.
