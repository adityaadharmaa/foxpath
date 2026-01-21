import apiClient from "@/lib/axios";

export const userService = {
    getUsers: async (page = 1, perPage = 10, search = "") => {
       const params = {page, perPage, search}
       const response = await apiClient.get("/admin/users", {params})
        return response.data
    }, 

    createUser: async(data: any) => {
        return await apiClient.post("/admin/users", data)
    },

    resendVerification: async (id: number) => {
        return await apiClient.post(`/admin/users/${id}/resend-verification`)
    },

    getSummary: async () => {
        const response = await apiClient.get("/admin/users/summary")
        return response.data
    }, 

    exportUser: async (format: 'xlsx' | 'csv') => {
        return await apiClient.post("/admin/users/export",
            {format: format},
            {responseType: 'blob'}
        )
    },

    toggleStatus: async (id:number, isActive:boolean) => {
        const endpoint = isActive
            ? `/admin/users/${id}/deactivate`
            : `/admin/users/${id}/activate`
        return await apiClient.patch(endpoint)
    },

    updateRole: async(id: number, roleName: string) => {
        return await apiClient.patch(`/admin/users/${id}/role`, { role: roleName })
    },

    deleteUser: async (id:number) => {
        return await apiClient.delete(`/admin/users/${id}`)
    }
}