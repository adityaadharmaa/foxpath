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
};
