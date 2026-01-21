import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { applicantService } from "@/services/applicantService";
import { Briefcase, Calendar, Check, CheckCircle, CheckLine, ChevronLeft, ChevronRight, Clock, Eye, Layers, Loader2, MoreHorizontal, Search, ShieldCheck, User, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ApplicantDetailModal from "./modal/ApplicantDetailModal";

function ColumnToggle({columns, onChange} : {columns: any[], onChange: (key: string) => void}) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="outline" 
                className="gap-2 border-slate-200 dark:border-slate-800" 
                onClick={() => setIsOpen(!isOpen)}
            >
                <Layers size={16} /> Columns
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Toggle Columns</p>
                    {columns.map((col) => (
                        <button 
                            key={col.key}
                            onClick={() => onChange(col.key)}
                            className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between rounded-md"
                        >
                            {col.label}
                            {col.visible && <Check size={14} className="text-blue-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

function ApplicantActionMenu({ applicant, onUpdateStatus, onViewDetail }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors">
                <MoreHorizontal size={18}/>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                        <button 
                        onClick={() => { onViewDetail(); setIsOpen(false) }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded-lg">
                            <Eye size={14} className="text-blue-500" /> Detail & Dokumen
                        </button>
                        <div className="border-t border-slate-100 my-1"></div>
                        <button onClick={() => onUpdateStatus('accepted')} className="w-full text-left px-3 py-2 text-xs font-medium text-green-600 hover:bg-green-50 flex items-center gap-2 rounded-lg">
                            <CheckCircle size={14} /> Terima Lamaran
                        </button>
                        <button onClick={() => onUpdateStatus('rejected')} className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg">
                            <XCircle size={14} /> Tolak Lamaran
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- MAIN PAGE ---

export default function ApplicantManagementPage() {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null)
    
    // Params
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // pending, verified, accepted, rejected
    const [pagination, setPagination] = useState({ current_page: 1, per_page: 10, total: 0, last_page: 1 });

    const [visibleColumns, setVisibleColumns] = useState([
        { key: 'applicant', label: 'Applicant', visible: true},
        { key: 'program', label: 'Program', visible: true },
        { key: 'date', label: 'Applied Date', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'action', label: 'Actions', visible: true },
    ]);

    useEffect(() => {
        fetchData();
    }, [pagination.current_page, pagination.per_page, search, statusFilter]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const params = {
                page: pagination.current_page,
                per_page: pagination.per_page,
                q: search,
                status: statusFilter
            };
            const response = await applicantService.getApplications(params);
            setApplicants(response.data.data || []);
            
            if(response.data.meta && response.data.meta.pagination) {
                setPagination({
                    current_page: response.data.meta.pagination.current_page,
                    per_page: response.data.meta.pagination.per_page,
                    total: response.data.meta.pagination.total,
                    last_page: response.data.meta.pagination.last_page
                });
            }
        } catch (error) {
            console.error("Error fetching applicants", error);
            setApplicants([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        const toastId = toast.loading("Mengupdate status...");
        try {
            await applicantService.updateStatus(id, status);
            toast.success(`Status berhasil diubah menjadi ${status}.`, {id: toastId});
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal update status.", {id: toastId});
        }
    };

    const toggleColumn = (key: string) => {
        setVisibleColumns(cols => cols.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
    };

    // Helper Status Badge
    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'accepted': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200"><CheckCircle size={12}/> Accepted</span>;
            case 'rejected': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"><XCircle size={12}/> Rejected</span>;
            case 'verified': return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-600"><ShieldCheck size={12}/> Verified</span>;
            default: return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200"><Clock size={12}/> Pending</span>;
        }
    };

    const getAvatarUrl = (path: string | null) => {
        if (!path) return null
        if (path.startsWith('http')) return path
        return `${import.meta.env.VITE_APP_URL || 'http://localhost:8000'}/storage/${path}`
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Data Pendaftar</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Pantau semua lamaran masuk dari berbagai program.</p>
                </div>
            </div>

            {/* MAIN TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-950/30">
                    <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                        <div className="relative w-full sm:w-80 group">
                            <Input 
                                placeholder="Cari nama pelamar atau program..." 
                                className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                startIcon={<Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPagination({...pagination, current_page: 1}); }}
                            />
                        </div>
                        {/* Filter Status Dropdown Simpel */}
                        <select 
                            className="h-10 rounded-md border border-slate-200 bg-white text-sm px-3 outline-none focus:ring-2 focus:ring-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <span className="text-xs text-slate-500 hidden sm:inline">Rows:</span>
                        <select 
                            className="h-9 rounded-md border border-slate-200 bg-white text-xs px-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            value={pagination.per_page}
                            onChange={(e) => setPagination(prev => ({ ...prev, per_page: Number(e.target.value), current_page: 1 }))}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                        </select>
                        <ColumnToggle columns={visibleColumns} onChange={toggleColumn} />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[11px] tracking-wider font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                {visibleColumns.find(c => c.key === 'applicant')?.visible && <th className="px-6 py-4">Applicant</th>}
                                {visibleColumns.find(c => c.key === 'program')?.visible && <th className="px-6 py-4">Program</th>}
                                {visibleColumns.find(c => c.key === 'date')?.visible && <th className="px-6 py-4">Applied Date</th>}
                                {visibleColumns.find(c => c.key === 'status')?.visible && <th className="px-6 py-4">Status</th>}
                                {visibleColumns.find(c => c.key === 'action')?.visible && <th className="px-6 py-4 text-right w-20"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-500"><Loader2 className="animate-spin h-6 w-6 mx-auto mb-2"/>Loading...</td></tr>
                            ) : applicants.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-20 text-center text-slate-500">Belum ada pendaftar.</td></tr>
                            ) : (
                                applicants.map((app) => (
                                    <tr key={app.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        
                                        {/* Applicant Info */}
                                        {visibleColumns.find(c => c.key === 'applicant')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 overflow-hidden shrink-0">
                                                        {app.user?.profile?.profile_picture ? (
                                                            <img 
                                                                src={getAvatarUrl(app.user.profile.profile_picture)}
                                                                alt="Avatar"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none'
                                                                    e.currentTarget.parentElement?.classList.add('fallback-icon')
                                                                }}
                                                            />
                                                        ) : (
                                                            <User size={16} className="text-slate-500" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{app.user?.profile?.full_name || "Tanpa Nama"}</p>
                                                        <p className="text-xs text-slate-500">{app.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {/* Program Info */}
                                        {visibleColumns.find(c => c.key === 'program')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                                    <Briefcase size={14} className="text-slate-400" />
                                                    <span className="text-sm font-medium">{app.program?.name}</span>
                                                </div>
                                            </td>
                                        )}

                                        {/* Date */}
                                        {visibleColumns.find(c => c.key === 'date')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                    <Calendar size={14} />
                                                    {app.created_at ? new Date(app.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'}) : '-'}
                                                </div>
                                            </td>
                                        )}

                                        {/* Status */}
                                        {visibleColumns.find(c => c.key === 'status')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                {getStatusBadge(app.status)}
                                            </td>
                                        )}

                                        {/* Action */}
                                        {visibleColumns.find(c => c.key === 'action')?.visible && (
                                            <td className="px-6 py-4 text-right align-top">
                                                <ApplicantActionMenu 
                                                    applicant={app}
                                                    onUpdateStatus={(status: string) => handleUpdateStatus(app.id, status)}
                                                    onViewDetail={() => {setSelectedApplicantId(app.id); setIsDetailOpen(true)}}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30">
                    <p className="text-xs text-slate-500">Showing {applicants.length} of {pagination.total} applicants</p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" size="sm" className="h-8 text-xs bg-white"
                            disabled={pagination.current_page === 1}
                            onClick={() => setPagination(p => ({...p, current_page: p.current_page - 1}))}
                        >
                            <ChevronLeft size={12} className="mr-1"/> Prev
                        </Button>
                        <Button 
                            variant="outline" size="sm" className="h-8 text-xs bg-white"
                            disabled={pagination.current_page === pagination.last_page}
                            onClick={() => setPagination(p => ({...p, current_page: p.current_page + 1}))}
                        >
                            Next <ChevronRight size={12} className="ml-1"/>
                        </Button>
                    </div>
                </div>
            </div>
            <ApplicantDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                applicationId={selectedApplicantId}
            />
        </div>
    );
}