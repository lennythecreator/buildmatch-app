import { Job } from './job';

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export interface Bid {
  id: string;
  jobId: string;
  contractorId: string;
  amount: number;
  message?: string;
  status: BidStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations mapped from API responses
  job?: Job; 
}
