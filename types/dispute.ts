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
  ruling: string | null;
  rulingNote: string | null;
  resolvedAt: string | null;
  lastActivityAt: string;
  createdAt: string;
  filedBy: DisputeUser;
  against: DisputeUser;
  evidenceCount: number;
  messageCount: number;
}
