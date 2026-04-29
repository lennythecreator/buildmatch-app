import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/lib/api/services';
import type { CreateMessageInput } from '@/lib/api/types';

export const MESSAGE_QUERY_KEY = ['messages'] as const;

export function useConversations() {
  return useQuery({
    queryKey: [...MESSAGE_QUERY_KEY, 'conversations'],
    queryFn: () => messageService.listConversations(),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: [...MESSAGE_QUERY_KEY, 'unread-count'],
    queryFn: () => messageService.getUnreadCount(),
    refetchInterval: 30000,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: [...MESSAGE_QUERY_KEY, 'conversation', id],
    queryFn: () => messageService.getConversation(id),
    enabled: !!id,
  });
}

export function useMessages(conversationId: string, params?: { before?: string; limit?: number }) {
  return useQuery({
    queryKey: [...MESSAGE_QUERY_KEY, 'conversation', conversationId, 'messages', params],
    queryFn: () => messageService.getMessages(conversationId, params),
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, recipientId }: { jobId: string; recipientId: string }) =>
      messageService.getOrCreateConversation(jobId, recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...MESSAGE_QUERY_KEY, 'conversations'] });
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, input }: { conversationId: string; input: CreateMessageInput }) =>
      messageService.sendMessage(conversationId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...MESSAGE_QUERY_KEY, 'conversation', variables.conversationId, 'messages'],
      });
      queryClient.invalidateQueries({
        queryKey: [...MESSAGE_QUERY_KEY, 'conversation', variables.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: [...MESSAGE_QUERY_KEY, 'conversations'],
      });
    },
  });
}

export function useEditMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      messageService.editMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_QUERY_KEY });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => messageService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_QUERY_KEY });
    },
  });
}
