Save this as `BuildMatch-Splash-Screen.md`:

````markdown
# BuildMatch Splash Screen Animation Specification

## Overview

The BuildMatch splash screen introduces the brand through a short, high-impact animation centered around the initials **B** and **M**.

Rather than immediately displaying the full company name, the animation creates anticipation by showing the two anchor letters separately before bringing them together through a magnetic attraction effect. Once connected, the remaining letters are revealed to form the complete wordmark:

**BuildMatch**

The entire sequence should feel premium, modern, and energetic while remaining concise enough to avoid delaying the user experience.

---

# Animation Goals

## Brand Objectives

- Reinforce the BuildMatch name
- Create a memorable first impression
- Communicate connection and matching
- Feel modern and premium
- Complete within 2 seconds

## Emotional Response

The animation should feel:

- Fast
- Confident
- Technical
- Purposeful
- Polished

---

# Animation Timeline

Total Duration: **~1.8 seconds**

| Phase | Duration |
|---------|---------|
| Magnetic Pull | 0ms - 500ms |
| Collision & Spark | 500ms - 580ms |
| BuildMatch Reveal | 580ms - 1530ms |
| Fade Out | 1530ms - 1880ms |

---

# Phase 1: Magnetic Pull

## Duration

0ms – 500ms

## Initial State

The screen displays only the two anchor letters.

```text
B                    M
```

### Positioning

- B begins off-screen or near the left edge.
- M begins off-screen or near the right edge.
- Both letters are vertically centered.

### Motion

The letters accelerate toward one another using a strong ease-in curve.

The movement should feel magnetic rather than mechanical.

```text
B                    M

   B              M

      B        M

         BM
```

### Design Notes

Avoid linear motion.

The letters should gain velocity as they approach the center so the collision feels intentional and energetic.

---

# Phase 2: Collision

## Duration

500ms – 580ms

## Impact State

The letters meet perfectly at the center.

```text
BM
```

### Collision Effects

When the letters connect:

- Trigger a small spark effect
- Briefly scale the logo upward
- Add a subtle glow pulse

Example:

```text
BM
✦
```

### Motion

Recommended scale animation:

```text
1.0x → 1.08x → 1.0x
```

### Purpose

The collision represents:

- Connection
- Matching
- Successful pairing
- Brand formation

---

# Phase 3: BuildMatch Reveal

## Duration

580ms – 1530ms

After the collision, the logo remains:

```text
BM
```

The remaining characters are then revealed through an outward expansion.

### Reveal Sequence

The hidden letters expand from the center:

```text
B + uild
M + atch
```

Result:

```text
BuildMatch
```

### Animation Style

- Width expansion
- Fade-in opacity
- Smooth easing
- Slight spring effect

### Motion Principles

The reveal should feel like the logo is unfolding naturally rather than appearing instantly.

The letters should emerge from the BM lockup.

### Final State

```text
BuildMatch
```

Centered on screen.

---

# Phase 4: Hold & Handoff

## Duration

1530ms – 1880ms

The completed BuildMatch wordmark remains visible briefly.

```text
BuildMatch
```

### Exit Animation

The splash screen then fades away.

Recommended:

- Fade opacity from 100% to 0%
- Duration: 350ms
- Linear easing

### Transition

The application's initial screen becomes visible underneath.

The transition should feel seamless.

---

# Visual Style

## Background

Recommended:

```css
background-color: #09090D;
```

A deep charcoal background creates contrast and gives the animation a premium appearance.

---

## Typography

### Wordmark

BuildMatch

### Style

- Modern sans-serif
- Medium to bold weight
- Tight letter spacing
- Clean geometric forms

Examples:

- Inter
- SF Pro Display
- Geist
- Satoshi

---

## Color Palette

### Primary Text

```css
#FFFFFF
```

### Accent Color (BM)

```css
#39F3BB
```

Neo-mint accent used for the anchor letters.

### Spark Color

```css
#FFD700
```

Warm gold used only during collision.

---

# Motion References

The animation should feel similar in quality to:

- Linear
- Stripe
- Arc Browser
- Vercel
- Modern SaaS onboarding experiences

---

# Animation Summary

```text
B                    M

↓ Magnetic Attraction

        BM

↓ Impact Spark

        BM
         ✦

↓ Expansion

     BuildMatch

↓ Hold

     BuildMatch

↓ Fade Out

     Application
```

---

---

# Dependencies

## `react-native-reanimated`

Required for performant, synchronous animations on the UI thread. All phase transitions (magnetic pull, collision scale, spark burst, letter reveal, fade out) should use Reanimated shared values and `withTiming` / `withSpring` to ensure smooth 60fps animation without JS thread blocking.

### Installation

```bash
npx expo install react-native-reanimated
```

After installation, add the Reanimated Babel plugin to `babel.config.js` if not already present:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

> **Note:** The Reanimated Babel plugin must be listed as the **last** plugin in the array.

---

# Components

The following components should be created to implement the splash screen animation described above.

## `components/splash/splash-screen.tsx`

**Purpose:** Root orchestrator that manages the 4-phase animation timeline (Magnetic Pull → Collision & Spark → BuildMatch Reveal → Fade Out). Renders child components in sequence, drives phase transitions via `Animated.Value` or Reanimated shared values, and signals completion to the root layout so `SplashScreen.hideAsync()` can be called.

**Props:** None (self-contained).

**Key responsibilities:**
- Phase state machine (idle → pulling → colliding → revealing → fading → done)
- Timing orchestration (~1.8s total per spec)
- Rendering `AnimatedLetter`, `CollisionSpark`, and `BuildMatchLogo` at the appropriate phases
- Calling an `onComplete` callback (or resolving a promise) so `app/_layout.tsx` can hide the native splash

---

## `components/splash/animated-letter.tsx`

**Purpose:** Displays a single animated letter (used for **B** and **M**) with configurable starting position, target position, scale, and opacity. Handles the magnetic pull motion with a strong ease-in curve (non-linear, accelerating toward center).

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `letter` | `string` | The character to display |
| `startX` | `number` | Starting X offset (off-screen or near edge) |
| `targetX` | `number` | Center position (where letter lands) |
| `color` | `string` | Text color (accent `#39F3BB`) |
| `phase` | `'pulling' \| 'colliding' \| 'revealing' \| 'fading'` | Current animation phase to drive behavior |

**Key responsibilities:**
- Animating from `startX` → `targetX` during the pulling phase
- Scaling up during collision phase
- Fading out (or transitioning into the wordmark) during reveal phase

---

## `components/splash/collision-spark.tsx`

**Purpose:** Visual spark/glow effect that appears when B and M meet at center (~500ms–580ms). Renders a brief animated burst (e.g., radial gradient, particle burst, or scale-up circle) that fades out quickly.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `visible` | `boolean` | Whether the spark is currently active |
| `color` | `string` | Spark color (`#FFD700` gold) |

**Key responsibilities:**
- Animated scale-up + fade-out of a spark shape centered between the letters
- Duration: ~80ms (matching collision phase window)

---

## `components/splash/buildmatch-logo.tsx`

**Purpose:** Renders the full **BuildMatch** wordmark after the collision. The remaining letters (`uild` and `atch`) animate outward from the center using width expansion and opacity fade-in, with a slight spring effect.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `phase` | `'revealing' \| 'holding' \| 'fading'` | Current phase to drive reveal animation |
| `accentColor` | `string` | Color for anchor letters BM (`#39F3BB`) |
| `textColor` | `string` | Color for remaining letters (`#FFFFFF`) |
| `onRevealComplete` | `() => void` | Callback when reveal animation finishes |

**Key responsibilities:**
- Splitting wordmark into anchor (`BM`) + expansion parts (`uild` / `atch`)
- Animating width expansion from 0 → full for the trailing letters
- Applying opacity fade-in to trailing letters
- Holding the full wordmark on screen during the hold phase (~950ms)
- Triggering fade-out animation during the fade phase

---

## `hooks/use-splash-animation.ts` (optional, recommended)

**Purpose:** Custom hook that encapsulates the animation timeline logic. Manages shared values for each phase (letter positions, scale, opacity, spark trigger, reveal progress) and exposes a simple imperative API to the `SplashScreen` component.

**Key responsibilities:**
- Managing Reanimated shared values (`letterBX`, `letterMX`, `sparkOpacity`, `revealProgress`, `logoOpacity`)
- Scheduling phase transitions via `withTiming` / `withDelay` chains
- Exposing a `start()` function that kicks off the sequence
- Exposing an `isComplete` shared value the root layout can read

---

# Integration Notes

The root layout (`app/_layout.tsx`) currently calls `SplashScreen.hideAsync()` once fonts are ready. With the animated splash, the flow becomes:

1. Native splash screen shows the static `splash-icon.png` (as configured in `app.json`).
2. Once fonts load, instead of immediately hiding the native splash, render `<SplashScreen />` on top of the app (or as a modal).
3. After the 4-phase animation completes (~1.8s), call `SplashScreen.hideAsync()` and unmount `<SplashScreen />`, revealing the actual app UI beneath.

This can be implemented by conditionally rendering `<SplashScreen />` in `app/_layout.tsx` while keeping the native splash hidden behind it.

---

# Success Criteria

The animation is successful if:

1. Users can immediately recognize the BuildMatch name.
2. The animation feels premium and intentional.
3. The entire sequence completes in under 2 seconds.
4. The transition into the application feels seamless.
5. The magnetic attraction effect communicates connection and matching without requiring explanation.
````
