import apiClient from "@/lib/axios";

export const programService = {
  getPrograms: async (params: any) => {
    return await apiClient.get("/admin/programs", { params });
  },

  getProgramDetail: async (id: number) => {
    return await apiClient.get(`/admin/programs/${id}`);
  },

  getSummary: async () => {
    return await apiClient.get("/admin/programs/summary");
  },

  createProgram: async (data: any) => {
    return await apiClient.post("/admin/programs", data);
  },

  updateProgram: async (id: number, data: any) => {
    return await apiClient.put(`/admin/programs/${id}`, data);
  },

  deleteProgram: async (id: number) => {
    return await apiClient.delete(`/admin/programs/${id}`);
  },

  restoreProgram: async (id: number) => {
    return await apiClient.patch(`/admin/programs/${id}/restore`);
  },

  toggleStatus: async (id: number) => {
    return await apiClient.patch(`/admin/programs/${id}/toggle`);
  },

  exportPrograms: async (format: "xlsx" | "csv") => {
    return await apiClient.post(
      "/admin/programs/export",
      { format },
      { responseType: "blob" },
    );
  },

  calculateSAW: async (id: number) => {
    return await apiClient.post(`/admin/programs/${id}/calculate-saw`);
  },

  getSAWDetails: async (id: number) => {
    return await apiClient.get(`/admin/programs/${id}/saw-details`);
  },

  finalizeDecision: async (id: number) => {
    return await apiClient.post(`/admin/programs/${id}/decide`);
  },

  // User Service
  getAvailablePrograms: async (params?: any) => {
    return await apiClient.get("/user/prorams", { params });
  },
};
