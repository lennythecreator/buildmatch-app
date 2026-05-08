# UI Context

## Theme

Light-first marketplace UI with soft layered surfaces, strong typography, and restrained accent color. The experience should feel clean, premium, and trustworthy rather than playful. Use rounded white cards, subtle borders, and light depth to separate content. Keep navigation and content dense enough for mobile commerce workflows without feeling cramped.

## Colors

[Define your color tokens as CSS custom properties.
All components must use these tokens — no hardcoded
hex values.]

| Role            | CSS Variable       | Value    |
| --------------- | ------------------ | -------- |
| Page background | `--bg-base`        | `#f8fafc` |
| Surface         | `--bg-surface`     | `#ffffff` |
| Primary text    | `--text-primary`   | `#0f172a` |
| Muted text      | `--text-muted`     | `#64748b` |
| Primary accent  | `--accent-primary` | `#00264d` |
| Border          | `--border-default` | `#e2e8f0` |
| Error           | `--state-error`    | `#ef4444` |
| Success         | `--state-success`  | `#10b981` |

## Typography

| Role      | Font              | Variable      |
| --------- | ----------------- | ------------- |
| UI text   | System UI / SF Pro | `--font-sans` |
| Code/mono | System monospace   | `--font-mono` |

## Border Radius

| Context           | Class            |
| ----------------- | ---------------- |
| Inline / small UI | `rounded-lg` |
| Cards / panels    | `rounded-2xl` |
| Modals / overlays | `rounded-3xl` |

## Component Library

Custom internal React Native components in `components/ui/` built on Tailwind/Uniwind primitives.

## Layout Patterns

- [Pattern — Root tabs: bottom tab navigation with role-aware visibility]
- [Pattern — Stack screens: scrollable content with automatic safe-area inset handling]
- [Pattern — Summary cards: white rounded cards with subtle shadow and consistent spacing]
- [Pattern — Lists and filters: stacked card sections with collapsible controls and pagination]

## Icons

[Tabler Icons, Sizes:
h-4 w-4 for inline, h-5 w-5 for buttons, h-6 w-6 for primary actions.]

## Design System
- `[Desgin.md]` - Design system.