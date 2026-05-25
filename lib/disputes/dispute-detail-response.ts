import type { DisputeEvidence, DisputeMessage } from '@/lib/api/types';

interface DetailListItemsResponse<TItem> {
  items?: TItem[];
  evidence?: TItem[];
  messages?: TItem[];
}

type EvidenceListLikeResponse = DisputeEvidence[] | DetailListItemsResponse<DisputeEvidence> | undefined;
type MessageListLikeResponse = DisputeMessage[] | DetailListItemsResponse<DisputeMessage> | undefined;

function isArrayOfUnknown(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function normalizeDisputeEvidenceResponse(
  response: EvidenceListLikeResponse
): DisputeEvidence[] {
  if (isArrayOfUnknown(response)) {
    return response as DisputeEvidence[];
  }

  if (isArrayOfUnknown(response?.evidence)) {
    return response.evidence;
  }

  if (isArrayOfUnknown(response?.items)) {
    return response.items;
  }

  return [];
}

export function normalizeDisputeMessagesResponse(
  response: MessageListLikeResponse
): DisputeMessage[] {
  if (isArrayOfUnknown(response)) {
    return response as DisputeMessage[];
  }

  if (isArrayOfUnknown(response?.messages)) {
    return response.messages;
  }

  if (isArrayOfUnknown(response?.items)) {
    return response.items;
  }

  return [];
}
