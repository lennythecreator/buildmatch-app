import type { AgreementTemplate } from '@/lib/agreements/agreement-templates';
import { AGREEMENT_TEMPLATES } from '@/lib/agreements/agreement-templates';
import type { Bid, Job, User } from '@/lib/api/types';

interface AgreementInputParty {
  id?: string;
  name: string;
  role: 'developer' | 'contractor';
}

interface AgreementReadinessItem {
  id: string;
  label: string;
  isComplete: boolean;
  detail: string;
}

interface ProjectAgreementInput {
  template: AgreementTemplate;
  jobId: string;
  bidId?: string;
  title: string;
  tradeType: string;
  location: string;
  scopeDescription: string;
  contractAmount: number;
  parties: {
    developer: AgreementInputParty;
    contractor: AgreementInputParty;
  };
  readinessItems: AgreementReadinessItem[];
}

function getUserName(user?: Pick<User, 'firstName' | 'lastName'> | null) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return name || 'To be confirmed';
}

function getContractAmount(job: Job, bid?: Bid | null) {
  return bid?.amount ?? Math.round((job.budgetMin + job.budgetMax) / 2);
}

function getReadinessItems(job: Job, bid?: Bid | null): AgreementReadinessItem[] {
  return [
    {
      id: 'accepted-bid',
      label: 'Accepted bid',
      isComplete: Boolean(bid),
      detail: bid ? 'Accepted bid amount and contractor are available.' : 'Accept a bid before sending for signature.',
    },
    {
      id: 'scope-detail',
      label: 'Detailed scope',
      isComplete: job.description.trim().length >= 120,
      detail: 'Add inclusions, exclusions, materials, and acceptance criteria before final signature.',
    },
    {
      id: 'timeline',
      label: 'Project timeline',
      isComplete: false,
      detail: 'Start date, target completion date, and delay handling are not in the current job payload.',
    },
    {
      id: 'permits-insurance',
      label: 'Permits and insurance',
      isComplete: false,
      detail: 'Confirm who owns permits, licenses, inspections, and insurance certificates.',
    },
    {
      id: 'template-review',
      label: 'Attorney-reviewed template',
      isComplete: false,
      detail: 'The current template is an internal placeholder and still needs legal review.',
    },
  ];
}

export function createProjectAgreementInput(job: Job, bid?: Bid | null): ProjectAgreementInput {
  return {
    template: AGREEMENT_TEMPLATES.RENOVATION_TEMPLATE,
    jobId: job.id,
    bidId: bid?.id,
    title: job.title,
    tradeType: job.tradeType,
    location: `${job.city}, ${job.state} ${job.zipCode}`.trim(),
    scopeDescription: job.description,
    contractAmount: getContractAmount(job, bid),
    parties: {
      developer: {
        id: job.postedById,
        name: getUserName(job.postedBy),
        role: 'developer',
      },
      contractor: {
        id: bid?.contractorId,
        name: getUserName(bid?.contractor),
        role: 'contractor',
      },
    },
    readinessItems: getReadinessItems(job, bid),
  };
}

export type { AgreementInputParty, AgreementReadinessItem, ProjectAgreementInput };
