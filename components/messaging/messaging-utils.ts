import type { Conversation, User } from '@/lib/api/types';

function pad(number: number): string {
  return number.toString().padStart(2, '0');
}

export function getInitials(firstName?: string, lastName?: string): string {
  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((name) => name?.[0]?.toUpperCase())
    .join('');

  return initials || 'BM';
}

export function getConversationPartner(conversation: Conversation | null, currentUserId?: string | null) {
  if (!conversation) {
    return null;
  }

  const participant = conversation.participants.find((person) => person.id !== currentUserId);

  return participant ?? conversation.participants[0] ?? null;
}

export function formatConversationPreviewTime(timestamp?: string): string {
  if (!timestamp) {
    return '';
  }

  const date = new Date(timestamp);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();
  if (isSameDay) {
    return `${date.getHours() % 12 || 12}:${pad(date.getMinutes())} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getConversationDisplayName(conversation: Conversation | null, currentUserId?: string | null): string {
  const participant = getConversationPartner(conversation, currentUserId);

  if (!participant) {
    return 'Conversation';
  }

  return `${participant.firstName} ${participant.lastName}`.trim() || 'Conversation';
}

export function getConversationSnippet(conversation: Conversation | null): string {
  return conversation?.lastMessage?.content?.trim() || 'No messages yet';
}

export function formatUserName(user?: Pick<User, 'firstName' | 'lastName'> | null): string {
  if (!user) {
    return 'Conversation';
  }

  return `${user.firstName} ${user.lastName}`.trim() || 'Conversation';
}