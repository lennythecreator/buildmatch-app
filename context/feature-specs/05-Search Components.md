# Search Components Consistency

This spec defines the shared visual and interaction rules for the app's search-related components so they feel like one system even when they support different workflows.

## Goal

Create a consistent search experience across the app for jobs, contractors, and messaging without forcing every search component to expose the same functionality.

## Scope

This spec applies to:

- Job search controls
- Contractor search bars and filters
- Messaging search bars
- Any new search surface added later in the app

## Shared Visual System

All search surfaces should use the same base design language.

Requirements:

- Use the same input height, border treatment, radius, and spacing across search bars where possible.
- Use a consistent leading search icon size and muted icon color.
- Use one clear button pattern for resetting typed search values.
- Use the same typography scale for helper text, section labels, and filter labels.
- Use the app's shared color tokens instead of hardcoded one-off colors.
- Use shared card and input primitives from `components/ui/` for the container and field shell.

## Shared Interaction Rules

All search components should behave consistently when users interact with them.

Requirements:

- Search input should always feel lightweight and mobile friendly.
- Clearing text should be easy and should not reset unrelated filters unless the component explicitly includes a reset action.
- Active filter states should be visually obvious at a glance.
- Expanded filter sections should feel like part of the same search family, even when they expose different controls.
- Search controls should remain easy to reach while browsing results.

## Allowed Variations

Different search surfaces may still differ in function and structure.

Examples of allowed differences:

- Job search can include trade chips, location inputs, and budget filters.
- Contractor search can include specialty, rating, and availability filters.
- Messaging search can remain a lightweight single-field search with a clear action.
- Some screens may use a carded search panel while others use a compact inline bar, as long as the shell treatment stays consistent.

## Component Standards

Use the following implementation approach when building or refactoring search UI.

Requirements:

- Extract a reusable search shell component for common layout, spacing, and icon treatment.
- Extract shared filter chip styling so active and inactive states look related across screens.
- Keep feature-specific controls inside each screen or feature component.
- Prefer slot-based composition over copying and pasting whole search layouts.
- Keep each file under the repository's size limit by splitting shared pieces into focused components when needed.

## Acceptance Criteria

The search system is considered consistent when:

- Search surfaces look related even when they serve different workflows.
- Users can predict where to type, how to clear text, and how filters behave across screens.
- Helper text, labels, chips, and clear actions use the same design language.
- Feature-specific differences remain obvious enough to support each workflow without visual clutter.

## Priority Ordering

When there is a conflict, preserve the following order:

1. Feature behavior
2. Shared search shell consistency
3. Shared filter styling
4. Cosmetic screen-specific tuning
