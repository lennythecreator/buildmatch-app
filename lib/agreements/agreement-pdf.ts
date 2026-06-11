import type { ProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';

interface AgreementPdfDocument {
  fileName: string;
  mimeType: 'application/pdf';
  base64: string;
  byteLength: number;
}

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const LEFT_MARGIN = 50;
const TOP_MARGIN = 752;
const LINE_HEIGHT = 14;
const MAX_LINE_LENGTH = 92;
const MAX_LINES_PER_PAGE = 48;

function normalizePdfText(value: string) {
  return value
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapePdfText(value: string) {
  return normalizePdfText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function sanitizeFileName(value: string) {
  const normalized = normalizePdfText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${normalized || 'buildmatch-agreement'}.pdf`;
}

function wrapText(value: string, maxLength = MAX_LINE_LENGTH) {
  const words = normalizePdfText(value).split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      currentLine = word;
      continue;
    }

    if (`${currentLine} ${word}`.length <= maxLength) {
      currentLine = `${currentLine} ${word}`;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function pushWrappedLines(lines: string[], text: string, options?: { prefix?: string; indent?: string }) {
  const prefix = options?.prefix ?? '';
  const indent = options?.indent ?? '';
  const wrappedLines = wrapText(`${prefix}${text}`, MAX_LINE_LENGTH - indent.length);

  for (const [index, line] of wrappedLines.entries()) {
    lines.push(index === 0 ? `${indent}${line}` : `${indent}${line}`);
  }
}

function buildPdfLines(draft: ProjectAgreementDraft) {
  const lines: string[] = [];

  lines.push(draft.title);
  lines.push('');
  lines.push(draft.disclaimer);
  lines.push('');
  lines.push(`Template: ${draft.template.name} v${draft.template.version}`);
  lines.push(`Template review status: ${draft.template.reviewStatus.replace(/-/g, ' ')}`);
  lines.push('');
  lines.push('Parties');

  for (const party of draft.parties) {
    pushWrappedLines(lines, `${party.label}: ${party.name} - ${party.role}`, { indent: '  ' });
  }

  lines.push('');
  lines.push('Shared Contract Draft');

  for (const [index, section] of draft.contractSections.entries()) {
    lines.push('');
    lines.push(`${index + 1}. ${section.title}`);
    pushWrappedLines(lines, section.body, { indent: '  ' });
  }

  lines.push('');
  lines.push('Developer Summary');

  for (const item of draft.developerSummary) {
    pushWrappedLines(lines, item, { prefix: '- ', indent: '  ' });
  }

  lines.push('');
  lines.push('Contractor Summary');

  for (const item of draft.contractorSummary) {
    pushWrappedLines(lines, item, { prefix: '- ', indent: '  ' });
  }

  lines.push('');
  lines.push('Clause Risk Review');

  for (const riskFlag of draft.riskFlags) {
    pushWrappedLines(lines, `${riskFlag.title} (${riskFlag.severity}): ${riskFlag.description}`, {
      prefix: '- ',
      indent: '  ',
    });
  }

  lines.push('');
  lines.push('Draft Readiness');

  for (const item of draft.readinessItems) {
    const status = item.isComplete ? 'complete' : 'needs review';
    pushWrappedLines(lines, `${item.label} (${status}): ${item.detail}`, { prefix: '- ', indent: '  ' });
  }

  return lines;
}

function paginateLines(lines: string[]) {
  const pages: string[][] = [];

  for (let index = 0; index < lines.length; index += MAX_LINES_PER_PAGE) {
    pages.push(lines.slice(index, index + MAX_LINES_PER_PAGE));
  }

  return pages.length ? pages : [[]];
}

function buildPageContent(lines: string[], pageNumber: number, totalPages: number) {
  const textCommands = lines
    .map((line) => `(${escapePdfText(line)}) Tj T*`)
    .join('\n');

  return [
    'BT',
    '/F1 11 Tf',
    `${LINE_HEIGHT} TL`,
    `${LEFT_MARGIN} ${TOP_MARGIN} Td`,
    textCommands,
    'ET',
    'BT',
    '/F1 9 Tf',
    `${LEFT_MARGIN} 34 Td`,
    `(BuildMatch agreement draft - Page ${pageNumber} of ${totalPages}) Tj`,
    'ET',
  ].join('\n');
}

function bytesToBase64(value: string) {
  if (typeof btoa === 'function') {
    return btoa(value);
  }

  const bufferCtor = (
    globalThis as typeof globalThis & {
      Buffer?: { from(input: string, encoding: string): { toString(encoding: string): string } };
    }
  ).Buffer;

  if (bufferCtor) {
    return bufferCtor.from(value, 'binary').toString('base64');
  }

  throw new Error('No base64 encoder is available for PDF generation.');
}

function buildPdfDocument(pages: string[][]) {
  const pageObjectIds = pages.map((_, index) => 3 + index * 2);
  const contentObjectIds = pages.map((_, index) => 4 + index * 2);
  const objects: string[] = [];

  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>\nendobj\n`);

  pages.forEach((pageLines, index) => {
    const pageObjectId = pageObjectIds[index];
    const contentObjectId = contentObjectIds[index];
    const content = buildPageContent(pageLines, index + 1, pages.length);

    objects.push(
      `${pageObjectId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> /Contents ${contentObjectId} 0 R >>\nendobj\n`
    );
    objects.push(`${contentObjectId} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
  });

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (const offset of offsets.slice(1)) {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

export function generateAgreementPdf(draft: ProjectAgreementDraft, fileName = sanitizeFileName(draft.title)): AgreementPdfDocument {
  const pages = paginateLines(buildPdfLines(draft));
  const pdfDocument = buildPdfDocument(pages);

  return {
    fileName,
    mimeType: 'application/pdf',
    base64: bytesToBase64(pdfDocument),
    byteLength: pdfDocument.length,
  };
}

export type { AgreementPdfDocument };
