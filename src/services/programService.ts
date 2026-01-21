import apiClient from "@/lib/axios"

export const programService = {
    getPrograms: async (params: any) => {
        return await apiClient.get("/admin/programs", {params})
    },

    getSummary: async () => {
        return await apiClient.get("/admin/programs/summary")
    },

    createProgram: async (data: any) => {
        return await apiClient.post("/admin/programs", data)
    },

    updateProgram: async (id: number, data: any) => {
        return await apiClient.put(`/admin/programs/${id}`, data)
    },

    deleteProgram: async (id: number) => {
        return await apiClient.delete(`/admin/programs/${id}`)
    },

    restoreProgram: async (id: number) => {
        return await apiClient.patch(`/admin/programs/${id}/restore`)
    },

    toggleStatus: async (id: number) => {
        return await apiClient.patch(`/admin/programs/${id}/toggle`)
    },

    exportPrograms: async (format: 'xlsx' | 'csv') => {
        return await apiClient.post("/admin/programs/export", {format}, {responseType: 'blob'})
    }
}