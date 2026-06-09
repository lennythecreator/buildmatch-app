interface AgreementTemplateClause {
  id: string;
  title: string;
  purpose: string;
  required: boolean;
}

interface AgreementTemplate {
  id: string;
  version: string;
  name: string;
  source: string;
  reviewStatus: 'draft' | 'attorney-review-needed' | 'approved';
  clauses: AgreementTemplateClause[];
}

const RENOVATION_TEMPLATE: AgreementTemplate = {
  id: 'renovation-services-standard',
  version: '0.1.0',
  name: 'Standard Renovation Services Agreement',
  source: 'BuildMatch internal draft placeholder',
  reviewStatus: 'attorney-review-needed',
  clauses: [
    {
      id: 'project-scope',
      title: 'Project Scope',
      purpose: 'Defines included work, property location, trade category, and scope basis.',
      required: true,
    },
    {
      id: 'contract-price',
      title: 'Contract Price',
      purpose: 'Defines the accepted bid amount and payment expectation.',
      required: true,
    },
    {
      id: 'milestone-review',
      title: 'Milestone Review',
      purpose: 'Connects payment release to documented completion review.',
      required: true,
    },
    {
      id: 'change-orders',
      title: 'Change Orders',
      purpose: 'Requires written approval for scope, budget, or schedule changes.',
      required: true,
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution',
      purpose: 'Routes disagreements into BuildMatch mediation before additional releases.',
      required: true,
    },
  ],
};

export const AGREEMENT_TEMPLATES = {
  RENOVATION_TEMPLATE,
} as const;

export type { AgreementTemplate, AgreementTemplateClause };
