import apiClient from "@/lib/axios";

export interface Notification {
  id: string;
  title: string;
  type: string;
  message: string;
  notifiable_type: string;
  notifiable_id: number;
  is_read: boolean;
  created_at_human: string;
}

export const notificationService = {
  getAll: async (params?: { type?: string; per_page: number }) => {
    const response = await apiClient.get("/notifications", { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get("/notifications/unread-count");
    return response.data;
  },

  markAsRead: async (id?: string) => {
    const response = await apiClient.post("/notifications/mark-read", { id });
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/notifications/${id}`);
  },

  clearReadAll: async () => {
    const response = await apiClient.delete("/notifications/clear-read");
    return response.data;
  },
};
