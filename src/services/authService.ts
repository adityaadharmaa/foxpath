import apiClient from "@/lib/axios"
import type { LoginPayload, LoginResponse, User } from "@/types/auth"
import { email } from "zod"

export const authService = {
    login: async(payload: LoginPayload): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>("/auth/login", payload)
        return response.data
    },

    register: async (payload: any): Promise<any> => {
        const response = await apiClient.post("/auth/register", payload) 
        return response.data
    },

    verifyEmail: async(id: string, hash:string, query:string) => {
        const response = await apiClient.get(`/auth/email/verify/${id}/${hash}?${query}`)
        return response.data
    },

    resendVerification: async() => {
        const response = await apiClient.post("/auth/email/resend")
        return response.data
    },

    resendVerificationByEmail: async (email:string) => {
        const response = await apiClient.post("/auth/email/resend-public", {email})
        return response.data
    },

    forgotPassword: async (email: string) => {
        const response = await apiClient.post("/auth/forgot-password", { email })
        return response.data
    },

    resetPassword: async (payload: any) => {
        const response = await apiClient.post("/auth/reset-password", payload)
        return response.data
    },

    logout: async () => {
        try{
            await apiClient.post("/auth/logout")
        } catch (error) {
            console.log("Gagal logout dari server, membersihkan sesi lokal saja.")
        } finally {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
        }
    },

    setSession: (token: string, user: User) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
    },

    getUser: (): User | null => {
        const userStr = localStorage.getItem("user")
        return userStr ? JSON.parse(userStr) : null
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem("token")
    }
}