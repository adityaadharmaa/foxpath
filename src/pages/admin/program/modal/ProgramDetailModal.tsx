import { Button } from "@/components/ui/button";
import { programService } from "@/services/programService";
import { User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProgramDetailModal({isOpen, onClose, programId}: any) {
    const [program, setProgram] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(isOpen && programId) {
            fetchDetail()
        } else {
            setProgram(null)
        }
    }, [isOpen, programId])

    const fetchDetail = async () => {
        setIsLoading(true)
        try{
            const response = await programService.getProgramDetail(programId)
            toast.success(response.data.message)
            setProgram(response.data.data)
        } catch (error) {
            toast.error("Gagal memuat detail program")
            onClose()
        } finally {
            setIsLoading(false)
        }
    }

    if(!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow 2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detail Program</h2>
                        <p className="text-xs text-slate-500">Informasi program dan daftar pelamar.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
                </div>
                <div className="overflow-y-auto p-6 flex-1">
                    {isLoading || !program ? (
                        <div className="text-center py-10">Loading...</div>
                    ) : (
                        <div className="space-y-8">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                                <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">{program.name}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{program.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <span className="text-slate-400 block mb-1">Kapasitas</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{program.capacity}</span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <span className="text-slate-400 block mb-1">Durasi</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{program.placement_duration_months} Bulan</span>
                                    </div>
                                    {/* <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <span className="text-slate-400 block mb-1">Registrasi Mulai</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{new Date(program.registration_starts_at).toLocaleDateString()}</span>
                                    </div> */}
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <span className="text-slate-400 block mb-1">Registrasi</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{new Date(program.registration_ends_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <span className="text-slate-400 block mb-1">Status</span>
                                        <span className={`font-bold ${program.is_active ? 'text-green-600'  : 'text-slate-500'}`}>
                                            {program.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <User size={18} className="text-blue-500" /> Daftar Pelamar ({program.applications?.length || 0})
                                </h4>

                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Nama Pelamar</th>
                                                <th className="px-4 py-3">Tanggal Melamar</th>
                                                <th className="px-4 py-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {program.applications?.length > 0 ? (
                                                program.applications.map((app: any) => (
                                                    <tr className="hover:bg-slate-50 dark:hover-bg-slate-800/50">
                                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                                            {app.user?.profile?.full_name || app.user?.username || 'Tanpa Nama'}
                                                            <div className="text-xs text-slate-400 font-normal">{app.user?.email}</div>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-300">
                                                            {new Date(app.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                                        </td>
                                                        <div className="px-4 py-3">
                                                            <BadgeStatus status={app.status}/>
                                                        </div>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="px-4 py-8 text-center text-slate-500 italic">
                                                        Belum ada pelamar.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <Button variant='outline' onClick={onClose}>Tutup</Button>
                </div>
            </div>
        </div>
    )
}

function BadgeStatus({status} : {status: string}) {
    const styles: any = {
        pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
        verified: "bg-blue-50 text-blue-700 border-blue-200",
        accepted: "bg-green-50 text-green-700 border-green-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase border ${styles[status] || 'bg-slate-100'}`}>
            {status}
        </span>
    )
}