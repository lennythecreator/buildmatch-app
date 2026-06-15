import type { Bid, Job, PaymentPreference, User } from '@/lib/api/types';
import { createProjectAgreementInput, type AgreementReadinessItem, type ProjectAgreementInput } from './project-agreement-input';

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
  template: {
    name: string;
    version: string;
    reviewStatus: string;
  };
  parties: AgreementParty[];
  contractSections: Array<{
    title: string;
    body: string;
  }>;
  developerSummary: string[];
  contractorSummary: string[];
  riskFlags: AgreementRiskFlag[];
  readinessItems: AgreementReadinessItem[];
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

function getRiskFlags(input: ProjectAgreementInput): AgreementRiskFlag[] {
  const riskFlags: AgreementRiskFlag[] = [];

  if (!input.bidId) {
    riskFlags.push({
      title: 'Accepted bid missing',
      description: 'The agreement needs the accepted bid amount and contractor before it can be sent for signature.',
      severity: 'high',
    });
  }

  if (input.scopeDescription.trim().length < 120) {
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

  if (input.template.reviewStatus !== 'approved') {
    riskFlags.push({
      title: 'Template needs legal review',
      description: 'The current template is a BuildMatch draft placeholder and should be replaced with an attorney-reviewed template before production use.',
      severity: 'high',
    });
  }

  return riskFlags;
}

export function generateProjectAgreementDraftFromInput(input: ProjectAgreementInput): ProjectAgreementDraft {
  const paymentAmount = input.contractAmount;
  const developerName = input.parties.developer.name;
  const contractorName = input.parties.contractor.name;
  const tradeType = formatTradeType(input.tradeType);
  const paymentTermsText = input.paymentPreference === 'LUMPSUM'
    ? 'The full contract amount will be released upon project completion and approval.'
    : 'Payment will be released incrementally as milestones in the draw schedule are completed and approved.';

  return {
    title: `${input.title} Project Agreement`,
    disclaimer:
      'Draft preview for review only. This is not legal advice and should be reviewed before signature.',
    template: {
      name: input.template.name,
      version: input.template.version,
      reviewStatus: input.template.reviewStatus,
    },
    parties: [
      { label: 'Developer', name: developerName, role: 'Project owner / investor' },
      { label: 'Contractor', name: contractorName, role: 'Service provider' },
    ],
    contractSections: [
      {
        title: 'Project Scope',
        body: `The contractor will provide ${tradeType} services for ${input.title} at ${input.location}. The current scope is based on the posted project description: ${input.scopeDescription}`,
      },
      {
        title: 'Contract Price',
        body: `The proposed contract price is ${formatCurrency(paymentAmount)}. ${paymentTermsText}`,
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
      `You are preparing to perform the posted ${tradeType} scope for ${formatCurrency(paymentAmount)}.`,
      'Confirm required evidence, materials responsibility, site access, permits, and change order terms.',
      'Do not begin extra work unless both parties approve a written change order.',
    ],
    riskFlags: getRiskFlags(input),
    readinessItems: input.readinessItems,
  };
}

export function generateProjectAgreementDraft(job: Job, bid?: Bid | null, paymentPreference?: PaymentPreference): ProjectAgreementDraft {
  return generateProjectAgreementDraftFromInput(createProjectAgreementInput(job, bid, paymentPreference));
}

export type { AgreementReadinessItem, AgreementRiskFlag, ProjectAgreementDraft };
