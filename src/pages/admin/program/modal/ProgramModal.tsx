import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { programService } from "@/services/programService"
import { Calendar, Clock, Database, FileText, Loader2, PlayCircle, Save, Type, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

interface ProgramModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    programToEdit?: any
}

export default function ProgramModal({isOpen, onClose, onSuccess, programToEdit} : ProgramModalProps) {
    const [isLoading, setIsLoading] = useState(false)

    const formatDateForInput = (dateString: string | null) => {
        if(!dateString) return ""
        return new Date(dateString).toISOString().slice(0, 16)
    }

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        registration_starts_at: "",
        registration_ends_at: "",
        cohort_starts_at: "",
        placement_duration_months: "",
        capacity: "",
        is_active: 1,
    })

    useEffect(() => {
        if(programToEdit) {
            setFormData({
                name: programToEdit.name,
                description: programToEdit.description || "",
                registration_starts_at: formatDateForInput(programToEdit.registration_starts_at),
                registration_ends_at: formatDateForInput(programToEdit.registration_ends_at),
                cohort_starts_at: formatDateForInput(programToEdit.cohort_starts_at),
                placement_duration_months: programToEdit.placement_duration_months || "",
                capacity: programToEdit.capacity || "",
                is_active: programToEdit.is_active
            })
        } else {
            setFormData({
                name: "", description: "",
                registration_starts_at: "", registration_ends_at: "",
                cohort_starts_at: "", placement_duration_months: "6",
                is_active: 1, capacity: ""
            })
        }
    }, [programToEdit, isOpen])

    if(!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(!formData.name) {
            toast.error("Nama program wajib diisi.")
            return 
        }

        setIsLoading(true)
        const toastId = toast.loading(programToEdit ? "Memperbarui program..." : "Membuat program baru...")

        try {
            let response
            if(programToEdit) {
                response = await programService.updateProgram(programToEdit.id, formData)
            } else {
                response = await programService.createProgram(formData)
            }

            toast.success(response.data.message, {id: toastId})
            onSuccess()
            onClose()
        } catch (error: any) {
            console.error(error)
            const msg = error.response?.data?.message || error.message || "Gagal menyimpan program."
            toast.error(msg, {id: toastId})
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            {/* PERBAIKAN 1: max-w-[600px] agar lebar modal terkunci rapi */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-[600px] rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 mx-4 max-h-[90vh] overflow-y-auto">
                
                {/* PERBAIKAN 2: Typo 'justify-between' */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {programToEdit ? "Edit Program" : "Tambah Program Baru"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nama Program</label>
                        <div className="relative">
                            {/* PERBAIKAN 3: Icon manual absolute, bukan props startIcon */}
                            <Input 
                                name="name"
                                placeholder="Contoh: Magang Batch 1 2026"
                                className="h-11 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                startIcon={<Type className="absolute top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Kapasitas</label>
                        <div className="relative">
                            <Input 
                                name="capacity"
                                placeholder="Kapasitas magang"
                                className="h-11 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                startIcon={<Database className="absolute top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
                                value={formData.capacity}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Deskripsi</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3.5 text-slate-400" size={16}/>
                            <textarea 
                                name="description"
                                placeholder="Deskripsi program..."
                                className="w-full min-h-[80px] pl-10 pr-3 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-white resize-none"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Dates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Mulai Pendaftaran</label>
                            <div className="relative">
                                <Input 
                                    type="datetime-local"
                                    name="registration_starts_at"
                                    className="h-11 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    startIcon={<Calendar className="absolute top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
                                    value={formData.registration_starts_at}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tutup Pendaftaran</label>
                            <div className="relative">
                                <Input 
                                    type="datetime-local"
                                    name="registration_ends_at"
                                    className="h-11 pl-10 rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    startIcon={<Calendar className="absolute top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
                                    value={formData.registration_ends_at}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cohort & Duration Card */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Mulai Kegiatan (Cohort)</label>
                            <div className="relative">
                                <Input 
                                    type="datetime-local" 
                                    name="cohort_starts_at" 
                                    className="h-11 pl-10 rounded-xl border-blue-100 focus:border-blue-300 bg-white" 
                                    startIcon={<PlayCircle className="absolute top-1/2 -translate-y-1/2 text-blue-500" size={16} />}
                                    value={formData.cohort_starts_at} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Durasi (Bulan)</label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    name="placement_duration_months" 
                                    placeholder="6" 
                                    className="h-11 pl-10 rounded-xl border-orange-100 focus:border-orange-300 bg-white" 
                                    startIcon={ <Clock className="absolute top-1/2 -translate-y-1/2 text-orange-500" size={16} />}
                                    value={formData.placement_duration_months} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Button */}
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
                            {isLoading ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18}/>}
                            {programToEdit ? "Simpan Perubahan" : "Buat Program"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}