# Code Standards

## General

- [Principle —  Keep modules small and single-purpose]
- [Principle —  Fix root causes, do not layer workarounds]
- [Principle —  Do not mix unrelated concerns in one
  component or route]
- [Principle —  Files must never go above 250 lines and must be broke into smaller files if they do]

## TypeScript

- [Rule — e.g. Strict mode is required throughout the project]
- [Rule — e.g. Avoid any — use explicit interfaces or narrowly
  scoped types]
- [Rule — e.g. Validate unknown external input at system
  boundaries before trusting it]

## [Framework - Expo]

- [Convention — Routes belong in `app/` and stack structure should be defined with `_layout.tsx` files.]
- [Convention — Keep route files focused on one screen or navigation concern; move shared UI and logic into `components/` or `hooks/`.]
- [Convention — Prefer `Stack.Screen` options for page titles and header configuration instead of custom page headers.]
- [Convention — For stack screens, the first child should usually be a `ScrollView` with `contentInsetAdjustmentBehavior="automatic"` and safe-area-aware padding.]
- [Convention — Use `Link` from `expo-router` for navigation, and add previews or context menus when they improve the flow.]
- [Convention — Use `expo-image` for images instead of intrinsic image elements.]

## Styling

- [Rule — e.g. Use CSS custom property tokens — no
  hardcoded hex values]
- [Rule — e.g. Follow the border radius scale defined
  in ui-context.md]

## File Organization

- `app/` — Expo Router screens, layouts, and route-specific UI only.
- `components/` — Shared UI components and reusable screen building blocks.
- `hooks/` — Reusable data fetching, auth, and state hooks.
- `lib/` — API client code, services, utilities, constants, and storage helpers.
