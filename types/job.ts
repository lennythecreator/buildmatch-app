export type JobTradeType = 'GENERAL' | 'ELECTRICAL' | 'PLUMBING' | 'HVAC' | 'ROOFING' | 'FLOORING' | 'PAINTING' | 'LANDSCAPING' | 'DEMOLITION' | 'OTHER';
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
  
  // Relations and metadata
  postedById: string;
  createdAt: Date;
  updatedAt: Date;
  bidCount?: number;
}

