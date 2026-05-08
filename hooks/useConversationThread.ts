import { useMemo } from 'react';

import { useConversation, useMessages, useSendMessage } from '@/hooks';
import { useCurrentUser } from '@/hooks/useAuth';
import type { Conversation, Message } from '@/lib/api/types';

import { getConversationPartner } from '@/components/messaging/messaging-utils';

interface UseConversationThreadResult {
  conversation: Conversation | null;
  currentUserId: string | null;
  messages: Message[];
  otherParticipantName: string;
  otherParticipantAvatarUrl?: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetchConversation: () => void;
  refetchMessages: () => void;
  sendMessage: (content: string) => Promise<void>;
  isSending: boolean;
}

export function useConversationThread(conversationId: string): UseConversationThreadResult {
  const { data: currentUser } = useCurrentUser();
  const conversationQuery = useConversation(conversationId);
  const messagesQuery = useMessages(conversationId, { limit: 50 });
  const sendMessageMutation = useSendMessage();

  const conversation = conversationQuery.data ?? null;
  const messages = messagesQuery.data?.messages ?? [];

  const otherParticipant = useMemo(
    () => getConversationPartner(conversation, currentUser?.id),
    [conversation, currentUser?.id]
  );

  const errorMessage = conversationQuery.error instanceof Error
    ? conversationQuery.error.message
    : messagesQuery.error instanceof Error
      ? messagesQuery.error.message
      : null;

  async function sendMessage(content: string) {
    if (!conversationId) {
      return;
    }

    await sendMessageMutation.mutateAsync({
      conversationId,
      input: { content },
    });
  }

  return {
    conversation,
    currentUserId: currentUser?.id ?? null,
    messages,
    otherParticipantName: otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}`.trim() : 'Conversation',
    otherParticipantAvatarUrl: otherParticipant?.avatarUrl,
    isLoading: conversationQuery.isLoading || messagesQuery.isLoading || !currentUser,
    isError: conversationQuery.isError || messagesQuery.isError,
    errorMessage,
    refetchConversation: conversationQuery.refetch,
    refetchMessages: messagesQuery.refetch,
    sendMessage,
    isSending: sendMessageMutation.isPending,
  };
}