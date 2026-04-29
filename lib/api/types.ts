export const UserRole = {
  ADMIN: 'ADMIN',
  INVESTOR: 'INVESTOR',
  CONTRACTOR: 'CONTRACTOR',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
  phone?: string;
  bio?: string;
  city?: string;
  state?: string;
  company?: string;
  title?: string;
  website?: string;
  displayName?: string;
  pronouns?: string;
  timezone?: string;
  locale?: string;
  dateFormat?: string;
  numberFormat?: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  profilePublic?: boolean;
  projectPreference?: string;
  aiPreference?: string;
  avatarUrl?: string;
  googleLinked?: boolean;
  isEmailVerified?: boolean;
  isIdVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  isNewUser?: boolean;
}

export interface NotificationPreferences {
  messages: boolean;
  bidActivity: boolean;
  jobUpdates: boolean;
  disputeUpdates: boolean;
  drawUpdates: boolean;
}

export interface ContractorProfile {
  id: string;
  userId: string;
  bio?: string;
  yearsExperience?: number;
  specialties: ContractorSpecialty[];
  city?: string;
  state?: string;
  averageRating?: number;
  totalReviews?: number;
  isAvailable: boolean;
  isLicenseVerified: boolean;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
}

export type ContractorSpecialty =
  | 'GENERAL'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'HVAC'
  | 'ROOFING'
  | 'FLOORING'
  | 'PAINTING'
  | 'LANDSCAPING'
  | 'DEMOLITION'
  | 'OTHER';

export interface ContractorListResponse {
  contractors: ContractorProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface ContractorFilters {
  search?: string;
  state?: string;
  city?: string;
  minRating?: number;
  available?: boolean;
  specialty?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export type JobTradeType =
  | 'GENERAL'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'HVAC'
  | 'ROOFING'
  | 'FLOORING'
  | 'PAINTING'
  | 'LANDSCAPING'
  | 'DEMOLITION'
  | 'OTHER';

export type JobStatus = 'OPEN' | 'AWARDED' | 'CANCELLED' | 'COMPLETED';

export interface Job {
  id: string;
  title: string;
  description: string;
  tradeType: JobTradeType;
  budgetMin: number;
  budgetMax: number;
  city: string;
  state: string;
  zipCode: string;
  status: JobStatus;
  postedById: string;
  awardedContractorId?: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
  bidCount?: number;
  hasBid?: boolean;
  postedBy?: Pick<User, 'id' | 'firstName' | 'lastName'>;
}

export interface JobListResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateJobInput {
  title: string;
  description: string;
  tradeType: JobTradeType;
  budgetMin: number;
  budgetMax: number;
  city: string;
  state: string;
  zipCode: string;
  photos?: string[];
}

export interface JobFilters {
  tradeType?: string;
  state?: string;
  city?: string;
  minBudget?: number;
  maxBudget?: number;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Bid {
  id: string;
  jobId: string;
  contractorId: string;
  amount: number;
  message?: string;
  status: BidStatus;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  contractor?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>;
}

export interface BidListResponse {
  bids: Bid[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateBidInput {
  amount: number;
  message?: string;
}

export interface Conversation {
  id: string;
  jobId?: string;
  participants: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'>[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isFiltered: boolean;
  editedAt?: string;
  deletedAt?: string;
  replyToId?: string;
  replyTo?: Pick<Message, 'id' | 'senderId' | 'content'>;
  createdAt: string;
  sender: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>;
}

export interface CreateMessageInput {
  content: string;
  replyToId?: string;
}

export type DisputeCategory =
  | 'QUALITY'
  | 'PAYMENT'
  | 'TIMELINE'
  | 'COMMUNICATION'
  | 'SCOPE'
  | 'OTHER';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED';

export interface Dispute {
  id: string;
  jobId: string;
  filedById: string;
  respondentId: string;
  category: DisputeCategory;
  amountDisputed: number;
  description: string;
  desiredOutcome: string;
  status: DisputeStatus;
  ruling?: string;
  rulingNote?: string;
  splitPct?: number;
  createdAt: string;
  updatedAt: string;
  job?: Job;
  filedBy?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  respondent?: Pick<User, 'id' | 'firstName' | 'lastName'>;
}

export interface DisputeMessage {
  id: string;
  disputeId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>;
}

export interface DisputeEvidence {
  id: string;
  disputeId: string;
  type: string;
  url: string;
  description?: string;
  uploadedById: string;
  createdAt: string;
}

export interface DisputeSummary {
  OPEN: number;
  UNDER_REVIEW: number;
  RESOLVED: number;
  CLOSED: number;
}

export interface DrawMilestone {
  id: string;
  drawScheduleId: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  isCompleted: boolean;
  order: number;
  request?: DrawRequest;
}

export interface DrawRequest {
  id: string;
  milestoneId: string;
  contractorId: string;
  status: 'PENDING' | 'APPROVED' | 'DISPUTED';
  evidence?: DrawEvidence[];
  createdAt: string;
  updatedAt: string;
}

export interface DrawEvidence {
  id: string;
  requestId: string;
  url: string;
  description?: string;
  uploadedById: string;
  createdAt: string;
}

export interface DrawSchedule {
  id: string;
  jobId: string;
  milestones: DrawMilestone[];
  status: 'PENDING' | 'APPROVED' | 'LOCKED';
  investorApproved: boolean;
  contractorApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contract {
  id: string;
  jobId: string;
  bidId: string;
  investorId: string;
  contractorId: string;
  terms: string;
  investorSigned: boolean;
  contractorSigned: boolean;
  signedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedList {
  id: string;
  name: string;
  isDefault: boolean;
  savedCount: number;
  contractors?: ContractorProfile[];
}

export interface SavedIdsResponse {
  [contractorProfileId: string]: string;
}

export interface Property {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: PropertyType;
  yearBuilt?: number;
  sqftEstimate?: number;
  bedrooms: number;
  bathrooms: number;
  hasBasement?: boolean;
  hasGarage?: boolean;
  stories?: number;
  userId: string;
  latestEstimate?: EstimateSummary;
  createdAt: string;
  updatedAt: string;
}

export type PropertyType =
  | 'SINGLE_FAMILY'
  | 'DUPLEX'
  | 'TRIPLEX'
  | 'FOURPLEX'
  | 'TOWNHOUSE'
  | 'CONDO'
  | 'MULTI_FAMILY'
  | 'COMMERCIAL';

export type RenovationPurpose =
  | 'FLIP'
  | 'RENTAL'
  | 'PRIMARY_RESIDENCE'
  | 'WHOLESALE';

export type PrimaryIssue =
  | 'COSMETIC'
  | 'FULL_GUT'
  | 'WATER_DAMAGE'
  | 'FIRE_DAMAGE'
  | 'NEGLECT'
  | 'STRUCTURAL'
  | 'PARTIAL';

export interface EstimateSummary {
  id: string;
  status: EstimateStatus;
  totalLow?: number;
  totalHigh?: number;
  updatedAt: string;
}

export interface Estimate {
  id: string;
  propertyId: string;
  renovationPurpose: RenovationPurpose;
  primaryIssue: PrimaryIssue;
  questionnaireAnswers: Record<string, string>;
  status: EstimateStatus;
  totalLow?: number;
  totalHigh?: number;
  lineItems?: EstimateLineItem[];
  createdAt: string;
  updatedAt: string;
}

export type EstimateStatus = 'PROCESSING' | 'COMPLETE' | 'FAILED';

export interface EstimateLineItem {
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitCostLow: number;
  unitCostHigh: number;
  totalLow: number;
  totalHigh: number;
}

export interface PropertyPhoto {
  id: string;
  propertyId: string;
  areaKey: string;
  areaLabel: string;
  url: string;
  storagePath: string;
  caption?: string;
  sortOrder?: number;
  createdAt: string;
}

export interface BillingMethod {
  id: string;
  type: 'CARD' | 'PAYPAL' | 'VENMO';
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  readAt?: string;
  createdAt: string;
}

export interface PresignedUpload {
  signedUrl: string;
  token: string;
  path: string;
}

export interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  pageUrl?: string;
  userAgent?: string;
  screenshotUrls?: string[];
  status: string;
  createdAt: string;
}
