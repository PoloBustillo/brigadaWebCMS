import apiClient from "./client";
import {
  Notification,
  NotificationListResponse,
  UnreadCountResponse,
} from "@/types";

export const notificationService = {
  /**
   * Get all notifications with unread count.
   * Only fetched when the user opens the bell panel.
   */
  async getAll(params?: {
    skip?: number;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationListResponse> {
    const response = await apiClient.get<NotificationListResponse>(
      "/admin/notifications",
      { params }
    );
    return response.data;
  },

  /**
   * Lightweight poll — returns only the integer count.
   * Called every 30 s to update the badge.
   */
  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<UnreadCountResponse>(
      "/admin/notifications/unread-count"
    );
    return response.data.count;
  },

  async markRead(id: number): Promise<Notification> {
    const response = await apiClient.patch<Notification>(
      `/admin/notifications/${id}/read`
    );
    return response.data;
  },

  async markAllRead(): Promise<{ updated: number }> {
    const response = await apiClient.patch<{ updated: number }>(
      "/admin/notifications/read-all"
    );
    return response.data;
  },

  async deleteOne(id: number): Promise<void> {
    await apiClient.delete(`/admin/notifications/${id}`);
  },
};
