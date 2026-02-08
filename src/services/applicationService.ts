import apiClient from "@/lib/axios";

export const applicationService = {
  submitScore: async (
    id: number,
    payload: { scores: { criteria_id: number; value: number }[] },
  ) => {
    return await apiClient.post(`/admin/applications/${id}/score`, payload);
  },
  updatePlacement: async (
    id: number,
    data: { start_date?: string; end_date?: string; duration_months?: number },
  ) => {
    return await apiClient.patch(`/admin/applications/${id}/placement`, data);
  },

  // User Service
  getMyApplication: async () => {
    return await apiClient.get("/user/applications");
  },
  getApplicationDetails: async (id: number) => {
    return await apiClient.get(`/user/applications/${id}`);
  },
  applyProgram: async (payload: { programs_id: number }) => {
    return await apiClient.post("/user/applications", payload);
  },
  uploadDocument: async (applicationId: number, formData: FormData) => {
    return await apiClient.post(
      `/user/applications/${applicationId}/documents`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
  },
  getDocumentStatus: async (applicationId: number) => {
    return await apiClient.get(
      `/user/applications/${applicationId}/document-status`,
    );
  },
};
