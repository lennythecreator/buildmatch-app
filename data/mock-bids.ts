import { Bid } from '@/types/bid';
import { mockJobs } from './mock-jobs';

export const mockBids: Bid[] = [
  {
    id: 'b1',
    jobId: '1',
    contractorId: 'contractor1',
    amount: 18500,
    message: 'We specialize in full kitchen remodels. We can start next month.',
    status: 'PENDING',
    createdAt: new Date('2026-04-12'),
    updatedAt: new Date('2026-04-12'),
    job: mockJobs.find(job => job.id === '1'),
  },
  {
    id: 'b2',
    jobId: '2',
    contractorId: 'contractor1',
    amount: 3200,
    message: 'Licensed plumber with 15 years experience. I can fix this quickly.',
    status: 'ACCEPTED',
    createdAt: new Date('2026-04-14'),
    updatedAt: new Date('2026-04-15'),
    job: mockJobs.find(job => job.id === '2'),
  },
  {
    id: 'b3',
    jobId: '1',
    contractorId: 'contractor2',
    amount: 22000,
    message: 'High-end finish carpentry is our specialty.',
    status: 'PENDING',
    createdAt: new Date('2026-04-13'),
    updatedAt: new Date('2026-04-13'),
    job: mockJobs.find(job => job.id === '1'),
  }
];
