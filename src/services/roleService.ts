import apiClient from "@/lib/axios"

export const roleService = {
    getRoles: async () => {
        return await apiClient.get("/admin/roles")
    },
    getSummary: async () => {
        return await apiClient.get("/admin/roles/summary")
    },
    createRole: async (data:any) => {
        return await apiClient.post("/admin/roles", data)
    },
    updateRole: async(id: number, data:any) => {
        return await apiClient.patch(`/admin/roles/${id}`, data)
    },
    deleteRole: async (id:number) => {
        return await apiClient.delete(`/admin/roles/${id}`)
    }
}