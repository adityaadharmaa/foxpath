import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { userService } from "@/services/userService"
import { Loader2, Lock, Mail, Save, Shield, User, X } from "lucide-react"
import React, { useState } from "react"
import { toast } from "sonner"

interface AddUserModalProps {
    isOpen: boolean,
    onClose: () => void
    onSuccess: () => void
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "users",
    })

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.username || !formData.email || !formData.password || !formData.password_confirmation) {
            toast.error("Mohon lengkapi semua data")
            return
        }

        setIsLoading(true)
        const toastId = toast.loading("Membuat user baru...")

        try {
            const response = await userService.createUser(formData)

            toast.success(response.data.message, { id: toastId })
            onSuccess()
            onClose()

            setFormData({ username: "", email: "", password: "", password_confirmation: "", role: "users" })
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Gagal membuat user."
            const validationErrors = error.response?.data?.errors

            if (validationErrors) {
                const firstError = Object.values(validationErrors)[0] as string[]
                toast.error(firstError[0], { id: toastId })
            } else {
                toast.error(msg, { id: toastId })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            
            {/* MODAL CARD: Tampilan Clean White & Rounded-2xl */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-[500px] rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 mx-4">
                
                {/* HEADER: Clean tanpa background */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah User Baru</h2>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Username */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Username</label>
                        <Input 
                            name="username"
                            placeholder="Contoh: johndoe" 
                            startIcon={<User size={16} />}
                            className="h-11 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Email</label>
                        <Input 
                            name="email"
                            type="email"
                            placeholder="email@domain.com"
                            startIcon={<Mail size={16} />}
                            className="h-11 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Password</label>
                        <Input 
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            startIcon={<Lock size={16} />}
                            className="h-11 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Confirmation */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Konfirmasi Password</label>
                        <Input 
                            name="password_confirmation"
                            type="password"
                            placeholder="••••••••"
                            startIcon={<Lock size={16} />}
                            className="h-11 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Role Pengguna</label>
                        <div className="relative">
                            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <select 
                                name="role"
                                className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-200 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none cursor-pointer text-slate-900 dark:text-slate-100"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="users">Users</option>
                                <option value="admin">Administrator</option>
                            </select>
                            {/* Chevron Icon Custom Position */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* BUTTONS: Side by Side (Berdampingan) */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                            onClick={onClose}
                        >
                            Batal
                        </Button>
                        <Button 
                            type="submit" 
                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                            Simpan User
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}