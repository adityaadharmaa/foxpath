import apiClient from "@/lib/axios";

export const dashboardService = {
  getProgamrSummary: async () => {
    return await apiClient.get("/admin/programs/summary");
  },
  getUserSummary: async () => {
    return await apiClient.get("/admin/users/summary");
  },
  getRoleSummary: async () => {
    return await apiClient.get("/admin/roles/summary");
  },
  getRecentApplication: async () => {
    return await apiClient.get(
      "/admin/appications?per_page=5&sort=created_at_desc",
    );
  },
  getAnalytics: async () => {
    return await apiClient.get("/admin/dashboard/analytics");
  },
  getSchoolStats: async () => {
    return await apiClient.get("/admin/dashboard/stats/school");
  },
};
