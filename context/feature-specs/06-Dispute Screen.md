This screen is where users will go to view and handle disputes. Its main purpose is for it to be a place where users can:
- View disputes
- File disputes
- Handle disputes

## Data Models

The following Data Models map to our backend for disputes. We will use these throughout the features and hooks:

```typescript
// types/dispute.ts

export type DisputeCategory = "WORK_NOT_STARTED" | "POOR_QUALITY" | "PAYMENT_ISSUE" | "OTHER";
export type DisputeStatus = "UNDER_REVIEW" | "AWAITING_EVIDENCE" | "PENDING_RULING" | "RESOLVED" | "WITHDRAWN";

export interface DisputeUser {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: "INVESTOR" | "CONTRACTOR" | "ADMIN";
}

export interface Dispute {
  id: string;
  jobId: string;
  jobTitle: string;
  filedById: string;
  againstId: string;
  milestoneDraw: string | null;
  amountDisputed: number;
  category: DisputeCategory;
  description: string;
  desiredOutcome: string;
  status: DisputeStatus;
  ruling: string | null; // Leave room for future resolution implementations
  rulingNote: string | null;
  resolvedAt: string | null;
  lastActivityAt: string;
  createdAt: string;
  filedBy: DisputeUser;
  against: DisputeUser;
  evidenceCount: number;
  messageCount: number;
}
```

## System Requirements & Global UI Statuses
- **Access Control:** Dispute details must strictly verify that the current user viewing the page is either the Developer (Investor) or the Contractor correctly associated with the dispute.
- **Loading State:** Utilize a short contextual message accompanied by a ring spinner.
- **Empty State:** Utilize a brief prompt explaining the lack of data (e.g., "No disputes filed" or "No evidence uploaded yet").
- **Resolution State & Settlements:** Currently, there are NO settlement actions enabled between users. The resolution UI implementation will be defined in the future, so keep the architectural room for it but no immediate UI builds are needed.

## Hooks to Implement
We will create custom hooks in `hooks/useDisputes.ts` for interacting with the backend:
- `useDisputes()`: Fetch list of disputes.
- `useDisputeDetails(id)`: Fetch specific dispute.
- `useCreateDispute()`: Mutation to submit a new dispute.
- `useUploadEvidence()`: Mutation to add evidence to an existing dispute.
- `useWithdrawDispute()`: Mutation to close/withdraw an active dispute.

## Main Layout 
This is the main layout that holds all these components and the screen where users will be able to see disputes. Think of it as the anchor page. 

Create `app/disputes/index.tsx`

Requirements:
- Should use a header to let people on what screen they are on.
- Should have a button that says File dispute that navigates user to the form that they fill out.
- it should make use of the `dispute-tabs` component.
- **Loading State:** Display the ring spinner + short message while fetching the list.

## Dispute Tabs
This is a group of tabs that let the user navigate between the types of disputes based on their status. The categories are All, Active, Under Review, Awaiting Evidence, Resolved, Withdrawn. 

Create `components/disputes/dispute-tabs.tsx`

Requirements:
- Should have an active state that shows the user what tab they are on.
- Should have metrics next to the tab name to show how many disputes fall under that tab (this should rely on a custom hook).
- Should be horizontally scrollable for the user so we don't squeeze them all into a single width.

## Dispute Card
This component is an item that displays a dispute. It is an interactable item that allows the user to have a quick and easy idea of what the dispute is about.

Create `components/disputes/dispute-card.tsx`

Requirements:
- Display the job title.
- Display the status of the dispute.
- Depending on the user it should show "filed against" if it is by the user or "filed by" if it is against the user.
- It should display the amount disputed.
- It should show the number of pieces of evidence. If there is no evidence, then have a proper empty state prompt.

## File Dispute Flow
This multi-step flow allows users to formally file a claim.

Create `app/disputes/new.tsx`

Requirements:
- **Step 1: Select Job** — Present a list of jobs currently tied to the user (jobs they have awarded, or jobs they have been awarded).
- **Step 2: Dispute Details** — A form capturing:
  - Dispute Category (dropdown).
  - Amount Disputed (numeric input).
  - Description / What happened? (multiline text).
  - Desired Outcome (multiline text).
- **Step 3: Preview** — A review screen summarizing all the entered information before the user commits to submitting the dispute.
- **Action**: A definitive "Submit Dispute" button that triggers the creation.

## Dispute Details 
This screen displays the full details of the dispute.

Create `app/disputes/[id].tsx`

Requirements:
- Title and amount disputed at the top.
- Depending on the user it should show "filed against" if it is by the user or "filed by" if it is against the user. eg: "[User 1 (filed by)] vs [User 2 (filed against)]".
- Show the description in 2 parts: "What happened?" and "Desired outcome?".
- Should have a timeline that shows the status of the dispute. Filed -> Under Review -> Evidence Collection -> Pending Ruling -> Resolved.
- Should render the **Evidence Carousel** and **Upload Evidence** components.
- Should include the **Mediation Thread** component in a tab or visible section.
- The person filing the dispute should also be able to see a withdrawn dispute button.

## Upload & View Evidence
This component is responsible for allowing the users to upload evidence for the dispute. Both parties should be able to do this.

Create `components/disputes/upload-evidence.tsx` & `components/disputes/evidence-carousel.tsx`

Requirements:
- **Upload Component**:
  - Should be a container with short description text for its purposes.
  - Should have a button that says upload evidence.
- **Evidence Carousel**:
  - Should display the evidence uploaded by both parties natively as a horizontal carousel.
  - Group or label evidence by who uploaded it (using the corresponding user's name).
  - Include an Empty State (brief prompt) if no evidence is available.

## Mediation Thread
This component provides a dedicated communication channel within the dispute details.

Create `components/disputes/mediation-thread.tsx`

Requirements:
- Acts as a general messaging thread between BuildMatch (admin) and the parties involved.
- Standard chat features (message bubbles, timestamps, and an input field to send new messages).
- Differentiate roles visually to distinguish who is sending what. 