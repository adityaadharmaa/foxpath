import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { roleService } from "@/services/roleService"
import { Loader2, Save, Shield, Tag, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

interface RoleModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess : () => void
    roleToEdit? : any
}

export default function RoleModal({isOpen, onClose, onSuccess, roleToEdit}: RoleModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        "name" : "",
        "description" : ""
    })

    useEffect(() => {
        if(roleToEdit) {
            setFormData({
                name: roleToEdit.name,
                description: roleToEdit.description || ""
            })
        } else {
            setFormData({name: "", description: ""})
        }
    }, [roleToEdit, isOpen])

    if(!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!formData.name) {
            toast.error("Nama Role wajib diisi.")
            return
        }

        setIsLoading(true)
        const toastId = toast.loading(roleToEdit ? "Mengupdate role..." : "Membuat role baru...")

        try{
            if(roleToEdit) {
                const res = await roleService.updateRole(roleToEdit.id, formData)
                toast.success(res.data.message, {id:toastId})
            } else {
                const res = await roleService.createRole(formData)
                toast.success(res.data.message, {id:toastId})
            }
            onSuccess()
            onClose()
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || "Gagal menyimpan role."
            toast.error(msg, {id: toastId})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-[500px] rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 mx-4">
                
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {roleToEdit ? "Edit Role" : "Tambah Role Baru"}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Role</label>
                        <Input 
                            name="name"
                            placeholder="Contoh: manager" 
                            startIcon={<Shield size={16} />}
                            className="h-11 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={roleToEdit?.name === 'admin'} // Admin tidak boleh ganti nama
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Deskripsi</label>
                        <div className="relative">
                            <Tag className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                            <textarea 
                                name="description"
                                placeholder="Deskripsi singkat tentang role ini..."
                                className="w-full min-h-[100px] pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4">
                        <Button type="button" variant="outline" className="h-11 rounded-xl border-slate-200 text-slate-600" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit" className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20" disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : <Save className="mr-2" size={18} />}
                            {isLoading ? "Menyimpan..." : "Simpan Role"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}