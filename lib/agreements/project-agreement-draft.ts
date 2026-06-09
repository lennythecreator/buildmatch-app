import type { Bid, Job, User } from '@/lib/api/types';

interface AgreementParty {
  label: string;
  name: string;
  role: string;
}

interface AgreementRiskFlag {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface ProjectAgreementDraft {
  title: string;
  disclaimer: string;
  parties: AgreementParty[];
  contractSections: Array<{
    title: string;
    body: string;
  }>;
  developerSummary: string[];
  contractorSummary: string[];
  riskFlags: AgreementRiskFlag[];
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTradeType(tradeType: string) {
  return tradeType.replace(/_/g, ' ').toLowerCase();
}

function getUserName(user?: Pick<User, 'firstName' | 'lastName'> | null) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  return name || 'To be confirmed';
}

function getContractorName(bid?: Bid | null) {
  return getUserName(bid?.contractor);
}

function getPaymentAmount(job: Job, bid?: Bid | null) {
  return bid?.amount ?? Math.round((job.budgetMin + job.budgetMax) / 2);
}

function getRiskFlags(job: Job, bid?: Bid | null): AgreementRiskFlag[] {
  const riskFlags: AgreementRiskFlag[] = [];

  if (!bid) {
    riskFlags.push({
      title: 'Accepted bid missing',
      description: 'The agreement needs the accepted bid amount and contractor before it can be sent for signature.',
      severity: 'high',
    });
  }

  if (job.description.trim().length < 120) {
    riskFlags.push({
      title: 'Scope may be too brief',
      description: 'Add more detail about included work, exclusions, materials, and acceptance criteria before signing.',
      severity: 'medium',
    });
  }

  riskFlags.push({
    title: 'Timeline not finalized',
    description: 'The current project data does not include start date, completion date, or delay handling terms.',
    severity: 'medium',
  });

  riskFlags.push({
    title: 'Permit and insurance responsibilities need review',
    description: 'Confirm who handles permits, licenses, insurance certificates, and inspection requirements.',
    severity: 'medium',
  });

  return riskFlags;
}

export function generateProjectAgreementDraft(job: Job, bid?: Bid | null): ProjectAgreementDraft {
  const paymentAmount = getPaymentAmount(job, bid);
  const developerName = getUserName(job.postedBy);
  const contractorName = getContractorName(bid);
  const location = `${job.city}, ${job.state} ${job.zipCode}`.trim();

  return {
    title: `${job.title} Project Agreement`,
    disclaimer:
      'Draft preview for review only. This is not legal advice and should be reviewed before signature.',
    parties: [
      { label: 'Developer', name: developerName, role: 'Project owner / investor' },
      { label: 'Contractor', name: contractorName, role: 'Service provider' },
    ],
    contractSections: [
      {
        title: 'Project Scope',
        body: `The contractor will provide ${formatTradeType(job.tradeType)} services for ${job.title} at ${location}. The current scope is based on the posted project description: ${job.description}`,
      },
      {
        title: 'Contract Price',
        body: `The proposed contract price is ${formatCurrency(paymentAmount)}. Payment terms should be tied to approved milestones, draw requests, or escrow release conditions before signature.`,
      },
      {
        title: 'Change Orders',
        body: 'Any work outside the approved scope should require a written change order describing the revised scope, price, schedule impact, and approval from both parties.',
      },
      {
        title: 'Milestone Review',
        body: 'The developer should review completed milestone work before payment release. The contractor should provide photos, notes, invoices, or other evidence requested by the project terms.',
      },
      {
        title: 'Dispute Resolution',
        body: 'If the parties disagree about scope, quality, payment, or timing, either party may open a BuildMatch dispute for mediation before additional funds are released.',
      },
    ],
    developerSummary: [
      `You are preparing to hire ${contractorName} for ${formatCurrency(paymentAmount)}.`,
      'Confirm the scope, exclusions, permits, timeline, and milestone approval process before signing.',
      'Payment release should remain tied to documented milestone completion and review.',
    ],
    contractorSummary: [
      `You are preparing to perform the posted ${formatTradeType(job.tradeType)} scope for ${formatCurrency(paymentAmount)}.`,
      'Confirm required evidence, materials responsibility, site access, permits, and change order terms.',
      'Do not begin extra work unless both parties approve a written change order.',
    ],
    riskFlags: getRiskFlags(job, bid),
  };
}

export type { AgreementRiskFlag, ProjectAgreementDraft };
