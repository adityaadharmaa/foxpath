import apiClient from "@/lib/axios"

export const criteriaService = {
    getCriteria: async(params:any) => {
        return await apiClient.get("/admin/criteria", {params})
    },

    createCriteria: async(data: any) => {
        return await apiClient.post("/admin/criteria", data)
    },

    updateCriteria: async(id:number, data: any) => {
        return await apiClient.patch(`/admin/criteria/${id}`, data)
    },

    deleteCriteria: async(id:number) => {
        return await apiClient.delete(`/admin/criteria/${id}`)
    },

    restoreCriteria: async(id:number) => {
        return await apiClient.patch(`/admin/criteria/${id}/restore`)
    },

    toggleStatus: async(id:number) => {
        return await apiClient.patch(`/admin/criteria/${id}/toggle`)
    },
}