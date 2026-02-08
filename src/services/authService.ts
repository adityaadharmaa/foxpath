import apiClient from "@/lib/axios";
import type { LoginPayload, LoginResponse, User } from "@/types/auth";
import { email } from "zod";

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  },

  fetchMe: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      const freshUser = response.data.data.user;

      localStorage.setItem("user", JSON.stringify(freshUser));

      return freshUser;
    } catch (error) {
      console.error("Failed to fetch fresh user data", error);
      return null;
    }
  },

  register: async (payload: any): Promise<any> => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  },

  verifyEmail: async (id: string, hash: string, query: string) => {
    const response = await apiClient.get(
      `/auth/email/verify/${id}/${hash}?${query}`,
    );
    return response.data;
  },

  resendVerification: async () => {
    const response = await apiClient.post("/auth/email/resend");
    return response.data;
  },

  resendVerificationByEmail: async (email: string) => {
    const response = await apiClient.post("/auth/email/resend-public", {
      email,
    });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  updatePassword: async (values: any) => {
    const response = await apiClient.patch("/auth/account/password", values);
    return response.data;
  },

  resetPassword: async (payload: any) => {
    const response = await apiClient.post("/auth/reset-password", payload);
    return response.data;
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.log("Gagal logout dari server, membersihkan sesi lokal saja.");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getSession: async () => {
    const response = await apiClient.get("/auth/user/sessions");
    return response.data;
  },

  revokeSession: async (id: number) => {
    const response = await apiClient.delete(`/auth/user/sessions/${id}`);
    return response.data;
  },

  setSession: (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    return !!token;
  },
};
