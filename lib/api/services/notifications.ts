import { apiClient } from '../client';
import type { Notification } from '../types';

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}

export const notificationService = {
  list: () =>
    apiClient.get<NotificationListResponse>('/api/notifications'),
};
