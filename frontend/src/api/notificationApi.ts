import { request } from './client';

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  type: string;
  linkUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    return request<NotificationItem[]>('/notifications/my');
  },

  markAsRead: async (id: number): Promise<void> => {
    return request<void>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },
};

