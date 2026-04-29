import { apiClient } from '../client';
import type {
  Conversation,
  Message,
  CreateMessageInput,
} from '../types';

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
}

export interface MessageListResponse {
  messages: Message[];
  total: number;
  page: number;
  limit: number;
}

export const messageService = {
  getOrCreateConversation: (jobId: string, recipientId: string) =>
    apiClient.post<Conversation>('/api/messages/conversations', { jobId, recipientId }),

  listConversations: () =>
    apiClient.get<ConversationListResponse>('/api/messages/conversations'),

  getUnreadCount: () =>
    apiClient.get<{ total: number }>('/api/messages/conversations/unread-count'),

  getConversation: (id: string) =>
    apiClient.get<Conversation>(`/api/messages/conversations/${id}`),

  getMessages: (id: string, params?: { before?: string; limit?: number }) =>
    apiClient.get<MessageListResponse>(
      `/api/messages/conversations/${id}/messages`,
      { searchParams: params }
    ),

  sendMessage: (id: string, input: CreateMessageInput) =>
    apiClient.post<Message>(`/api/messages/conversations/${id}/messages`, input),

  editMessage: (messageId: string, content: string) =>
    apiClient.put<Message>(`/api/messages/${messageId}`, { content }),

  deleteMessage: (messageId: string) =>
    apiClient.delete<void>(`/api/messages/${messageId}`),

  reportMessage: (messageId: string, reason: string, description?: string) =>
    apiClient.post<{ success: boolean }>(`/api/messages/${messageId}/report`, {
      reason,
      description,
    }),
};
