import apiClient from "@/lib/axios";

export const profileService = {
  getFullProfile: async () => {
    const response = await apiClient.get("/user/profile-full");
    return response.data;
  },

  updateGeneral: async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined)
        formData.append(key, data[key]);
    });
    formData.append("_method", "PUT");

    return await apiClient.post("/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getEducation: async () => {
    return await apiClient.get("/user/profile/educations");
  },
  updateEducation: async (data: any) => {
    return await apiClient.post("/user/profile/educations", data);
  },
};
