This screen is responsible for where contractors can view the jobs/bids that they have been awarded and are currently working on. 

## Search Bar 
Requirements:
- A simple rounded search bar 
- expandable filter to filter by (date awarded, deadline, price)
- keep the search and filter state active while switching tabs

## Tabs
Requirements:
- To show the completed/awarded/pending(not awarded)
- have a proper active state to let user know what tab they are viewing.
- show the result count for each tab when available
- Search results and filters also apply to the tabs. 
- Content here should also be scrollable. 

## Job Card
Use the reusable `components/job-card.tsx`.

Requirements:
- show the job title, status, trade type, budget range, location, posted date, and bid count when available
- open the job detail screen when the card is tapped
- keep the card compact, scannable, and easy to compare across tabs

## Pagination
Use the pagination component in components/ui. 
Requirements:
- Leverage pagination when results returned from the API or the number of items on the screen exceeds 5. 
- preserve the current search, filter, and tab state while paginating
- show a loading state while fetching the next page
- stop requesting more jobs when there are no additional results