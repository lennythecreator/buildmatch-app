This screen is responsible for allowing contractors to search for jobs that they can bid on from the search tab. This is the contractor version of the search experience, where contractors browse open jobs instead of contractors.

## Search Bar
Create a search bar at the top of the screen.

Requirements:
- It should let contractors search by job title, description, trade, city, and state.
- It should stay visible or easy to access while browsing results, ideally as a sticky or always-available control.
- It should feel lightweight and mobile friendly.
- It should clearly support clearing the current query without forcing the user back through the whole filter stack.

## Filter
Create a filter area for narrowing job search results.

Requirements:
- Allow filtering by trade type.
- Allow filtering by city and state.
- Allow filtering by budget range.
- Include a clear filters action to reset all active filters.
- Keep the filter UI compact and easy to use on mobile.
- Prefer short, scannable controls such as chips, compact inputs, or other one-hand-friendly interactions over tall form blocks.
- Show an active-filter state so contractors can tell when results are narrowed at a glance.

## Job Search Screen
Create the main contractor job search screen.

Requirements:
- Show open jobs by default in the search tab.
- Display each job with title, trade type, budget range, location, and posted date.
- Show bid count when available.
- Support loading, empty, and error states.
- Tapping a job should open the job detail screen.
- Keep the screen scrollable and safe-area aware.
- Use the app’s existing card, input, and button components for consistency.
- Keep the browse flow hierarchical: title and summary up top, search and filters immediately accessible, then the results list.
- Surface a result count or similar summary so contractors know how many open jobs match the current view.
- Make each result card easy to scan in under a second, with title and trade prioritized over secondary metadata.

## Pagination
Add pagination to the job search results.

Requirements:
- Load jobs in pages from the API.
- Preserve the current search and filter state while paginating.
- Show a loading state while fetching more jobs.
- Stop requesting more jobs when there are no additional results.
- Keep pagination behavior smooth and mobile friendly.
- When the page changes, return the user to the top of the current results so the new page is immediately readable.
- Keep pagination controls lightweight and avoid letting them dominate the browse experience.