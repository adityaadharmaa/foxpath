import apiClient from "@/lib/axios"

export interface Notification {
    id: string
    type: string
    message: string
    notifiable_type: string
    notifiable_id: number
    is_read: boolean
    created_at_human: string
}

export const notificationService = {
    getAll: async () => {
        const response = await apiClient.get("/notifications")
        return response.data
    },

    getUnreadCount: async () => {
        const response = await apiClient.get("/notifications/unread-count")
        return response.data
    },

    markAsRead: async (id?: string) => {
        const response = await apiClient.post("/notifications/mark-read", {id})
        return response.data
    }, 

    delete: async (id: string) => {
        await apiClient.delete(`/notifications/${id}`)
    }
}