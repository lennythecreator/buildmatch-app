import type { AgreementRiskFlag, ProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';

interface AiAgreementContent {
  contractSections?: unknown;
  developerSummary?: unknown;
  contractorSummary?: unknown;
  riskFlags?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toList(value: unknown) {
  if (Array.isArray(value)) {
    return value;
  }

  if (isRecord(value)) {
    return Object.values(value);
  }

  return [];
}

function textFromUnknown(value: unknown) {
  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (!isRecord(value)) {
    return '';
  }

  const preferredKeys = ['body', 'description', 'text', 'content', 'summary', 'value', 'detail'];

  for (const key of preferredKeys) {
    const text = textFromUnknown(value[key]);

    if (text) {
      return text;
    }
  }

  return Object.values(value)
    .map((item) => textFromUnknown(item))
    .filter(Boolean)
    .join(' ')
    .trim();
}

function cleanSections(content: AiAgreementContent, fallback: ProjectAgreementDraft) {
  const sections = toList(content.contractSections)
    .map((section, index) => {
      if (typeof section === 'string') {
        return {
          title: fallback.contractSections[index]?.title ?? `Section ${index + 1}`,
          body: section.trim(),
        };
      }

      if (!isRecord(section)) {
        return null;
      }

      const title = textFromUnknown(section.title ?? section.heading ?? section.name)
        || fallback.contractSections[index]?.title
        || `Section ${index + 1}`;
      const body = textFromUnknown(section.body ?? section.description ?? section.text ?? section.content ?? section.summary);

      return body ? { title, body } : null;
    })
    .filter((section): section is { title: string; body: string } => Boolean(section));

  return sections.length ? sections : fallback.contractSections;
}

function cleanSummary(summary: unknown, fallback: string[]) {
  const items = toList(summary)
    .map((item) => textFromUnknown(item))
    .filter(Boolean);

  return items.length ? items : fallback;
}

function cleanRiskFlags(content: AiAgreementContent, fallback: ProjectAgreementDraft) {
  const riskFlags = toList(content.riskFlags)
    .map((risk, index) => {
      if (typeof risk === 'string') {
        return {
          title: fallback.riskFlags[index]?.title ?? `Risk ${index + 1}`,
          description: risk.trim(),
          severity: 'medium' as const,
        };
      }

      if (!isRecord(risk)) {
        return null;
      }

      const title = textFromUnknown(risk.title ?? risk.heading ?? risk.name)
        || fallback.riskFlags[index]?.title
        || `Risk ${index + 1}`;
      const description = textFromUnknown(risk.description ?? risk.body ?? risk.text ?? risk.content ?? risk.summary);
      const severity = risk.severity === 'low' || risk.severity === 'medium' || risk.severity === 'high'
        ? risk.severity
        : 'medium';

      return description ? { title, description, severity } : null;
    })
    .filter((risk): risk is AgreementRiskFlag => Boolean(risk));

  return riskFlags.length ? riskFlags : fallback.riskFlags;
}

function mergeAiAgreementContent(content: AiAgreementContent, fallback: ProjectAgreementDraft) {
  return {
    ...fallback,
    contractSections: cleanSections(content, fallback),
    developerSummary: cleanSummary(content.developerSummary, fallback.developerSummary),
    contractorSummary: cleanSummary(content.contractorSummary, fallback.contractorSummary),
    riskFlags: cleanRiskFlags(content, fallback),
  };
}

export { mergeAiAgreementContent };
export type { AiAgreementContent };
