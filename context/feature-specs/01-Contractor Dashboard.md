The dashboard screen that contractors will be able to view once they log into the application.
## Active Bid Widget
Create `components/active-bids.tsx`.

Requirments:
- Should have a empty proper state that encourages the user to find jobs with a Find Job button If they have no active jobs they have bid on.
- Should display their bids on projects as well as the status of those bids. 
- User should be able to tap on these bits to view the full details of the project and thier bid. 
- Limit the number of bids displayed to 3 and have a "Review more" option that the user can use to view all their bids. 

## Reliability score widget 
Create `components/reliability-score.tsx`.
Create `hooks/useReliabilityScore.ts`.

Requirements:
- Should show their reliability score out of a hundred. 
- Should show the parts that make up the reliability score. Which is response rate(25), on-time completion(25), Bid accuracy(20), completion rate(10),Dispute history(10).  
- Should rely on a custom hook called `useReliabilityScore.ts` for its data

## Track performance 
Create `components/track-performance.tsx`

Requirements:
- Should display the income the contractor has earned this month. 
- Should display the contractor's success score. 
- There should be a custom hook that gets this information. 