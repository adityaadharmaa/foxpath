import apiClient from "@/lib/axios"

export const applicantService = {
    getApplications: async(params: any) => {
        return await apiClient.get("/admin/applications", {params})
    },

    updateStatus: async (id: number, status: string) => {
        return await apiClient.patch(`/admin/applications/${id}/status`, {status})
    },

    getApplicationDetail: async(id: number) => {
        return await apiClient.get(`/admin/applications/${id}`)
    },

    reviewDocument: async (documentId: number, status: 'approved' | 'rejected', note?: string) => {
        return await apiClient.patch(`/admin/documents/${documentId}/review`, {
            status,
            review_note: note
        })
    }
}