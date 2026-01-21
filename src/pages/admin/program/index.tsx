import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { programService } from "@/services/programService";
import { Archive, Calendar, Check, CheckCircle, ChevronLeft, ChevronRight, Clock, Edit, Layers, Loader2, MoreHorizontal, PlayCircle, Plus, RefreshCcw, Search, Shield, ToggleLeft, ToggleRight, Trash2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProgramModal from "./modal/ProgramModal";

function ColumnToggle({columns, onChange} : {columns: any[], onChange: (key: string) => void}) {
    const [isOpen, setIsOpen] = useState(false);
        const menuRef = useRef<HTMLDivElement>(null);
    
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);
    
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

function ProgramActionMenu({program, onEdit, onDelete, onRestore, onToggle}: any) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent){
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)} 
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <MoreHorizontal size={18}/>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                        {program.is_deleted ? (
                            <button onClick={() => {onRestore(); setIsOpen(false)}} className="w-full text-left px-3 py-2 text-xs font-medium text-green-600 hover:bg-green-50 flex items-center gap-2 rounded-lg">
                                <RefreshCcw size={14} /> Restore Program
                            </button>
                        ) : (
                            <>
                                <button onClick={() => {onEdit(); setIsOpen(false)}} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded-lg">
                                    <Edit size={14} className="text-blue-500" /> Edit Program
                                </button>
                                <button onClick={() => {onToggle(); setIsOpen(false)}} className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded-lg">
                                    {program.is_active ? <ToggleRight size={14} className="text-green-500" /> : <ToggleLeft size={14} className="text-slate-400" />}
                                    {program.is_active ? 'Nonaktif' : 'Aktifkan'} 
                                </button>
                                <div className="border-t border-slate-100 my-1"></div>
                                <button onClick={() => {onDelete(); setIsOpen(false)}} className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg">
                                    <Trash2 size={14} /> Hapus Program
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ProgramManagementPage() {
    const [programs, setPrograms] = useState<any[]>([])
    const [summary, setSummary] = useState<any>({total_programs: 0, active_programs: 0, deleted_programs: 0})
    const [isLoading, setIsLoading] = useState(true)

    // Params
    const [search, setSearch] = useState("")
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
    })
    const [includeDeleted, setIncludeDeleted] = useState(false)

    const [visibleColumns, setVisibleColumns] = useState([
        { key: 'name', label: 'Program Info', visible: true},
        { key: 'dates', label: 'Registration Date', visible: true },
        { key: 'capacity', label: 'Capacity', visible: true },
        { key: 'cohort', label: 'Cohort & Duration', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'applicants', label: 'Applicants', visible: true },
        { key: 'action', label: 'Actions', visible: true },
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [programToEdit, setProgramToEdit] = useState<any>(null)

    useEffect(() => {
        fetchData()
        fetchSummary()
    }, [pagination.current_page, pagination.per_page, search, includeDeleted])

    const fetchData = async () => {
        setIsLoading(true)
        try{
            const params = {
                page: pagination.current_page,
                per_page: pagination.per_page,
                q: search,
                include_deleted: includeDeleted ? 1: 0
            }

            const response = await programService.getPrograms(params)

            setPrograms(response.data.data || [])

            if(response.data.meta && response.data.meta.pagination) {
                setPagination({
                    current_page: response.data.meta.pagination.current_page,
                    per_page: response.data.meta.pagination.per_page,
                    total: response.data.meta.pagination.total,
                    last_page: response.data.meta.pagination.last_page
                })
            }
        } catch (error) {
            console.error("Error fetching programs", error)
            setPrograms([])
        } finally {
            setIsLoading(false)
        }
    }

    const fetchSummary = async () => {
        try{
            const res = await programService.getSummary()
            if(res.data && res.data.data) {
                setSummary(res.data.data)
            }
        } catch (error) {console.error(error)}
    }

    const handleDelete = async (id: number) => {
        if(!confirm("Yakin ingin menghapus program ini?")) return
        const toastId = toast.loading("Menghapus...")
        try{
            await programService.deleteProgram(id)
            toast.success("Program berhasil dihapus.", {id:toastId})
            fetchData()
            fetchSummary()
        } catch(error: any) {
            const msg = error.response?.data?.message || "Gagal menghapus."
            toast.error(msg, {id: toastId})
        }
    }

    const handleRestore = async (id: number) => {
        const toastId = toast.loading("Mengembalikan...")
        try{
            const res = await programService.restoreProgram(id)
            toast.success(res.data.message, {id: toastId})
            fetchData()
            fetchSummary()
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gagal Restore", {id: toastId})
        }
    }

    const handleToggle = async (id: number) => {
        const toastId = toast.loading("Mengupdate status...")
        try {
            const res = await programService.toggleStatus(id)
            toast.success(res.data.message, {id: toastId})
            fetchData()
            fetchSummary()
        } catch  (error: any) {
            toast.error(error.response?.data?.message || "Gagal update status.", {id: toastId})
        }
    }

    const toggleColumn = (key: string) => {
        setVisibleColumns(cols => cols.map(c => c.key === key ? { ...c, visible: !c.visible } : c));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                   <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Program Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola program magang, periode pendaftaran, dan status.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant={includeDeleted ? "destructive" : "outline"}
                        onClick={() => setIncludeDeleted(!includeDeleted)}
                        className="gap-2"
                    >
                        <Archive size={16} /> {includeDeleted ? "Hide Deleted" : "Show Deleted"}
                    </Button>
                    <Button onClick={() => { setProgramToEdit(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20">
                        <Plus size={16} /> Add Program
                    </Button>
                </div>
            </div>
        {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    title="Total Programs" 
                    value={summary.total_programs} 
                    icon={<Layers className="text-blue-500" />} 
                    border="border-blue-200"
                />
                <StatCard 
                    title="Active Programs" 
                    value={summary.active_programs} 
                    icon={<CheckCircle className="text-green-500" />} 
                    border="border-green-200"
                    indicator="bg-green-500"
                />
                <StatCard 
                    title="Total Applicants" 
                    value={summary.total_applications} 
                    icon={<Users className="text-purple-500" />} 
                    border="border-purple-200"
                    subtitle="Across all programs"
                />
            </div>

            {/* MAIN TABLE */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
                    <div className="relative w-full sm:w-80 group">
                        <Input 
                            placeholder="Cari nama program..." 
                            className="pl-10 bg-white border-slate-200"
                            value={search}
                            startIcon={<Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />}
                            onChange={(e) => { setSearch(e.target.value); setPagination({...pagination, current_page: 1}); }}
                        />
                    </div>
                    {/* Rows Per Page & Columns (Simple Version) */}
                    <div className="flex items-center gap-3">
                         <span className="text-xs text-slate-500">Rows:</span>
                         <select 
                                className="h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
                        <thead className="bg-slate-50 uppercase text-[11px] tracking-wider font-semibold text-slate-500 border-b border-slate-200">
                            <tr>
                                {visibleColumns.find(c => c.key === 'name')?.visible && <th className="px-6 py-4">Program Name</th>}
                                {visibleColumns.find(c => c.key === 'dates')?.visible && <th className="px-6 py-4">Registration</th>}
                                {visibleColumns.find(c => c.key === 'capacity')?.visible && <th className="px-6 py-4">Kapasitas</th>}
                                {visibleColumns.find(c => c.key === 'cohort')?.visible && <th className="px-6 py-4">Cohort & Duration</th>}
                                {visibleColumns.find(c => c.key === 'status')?.visible && <th className="px-6 py-4">Status</th>}
                                {visibleColumns.find(c => c.key === 'applicants')?.visible && <th className="px-6 py-4">Applicants</th>}
                                {visibleColumns.find(c => c.key === 'action')?.visible && <th className="px-6 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-500"><Loader2 className="animate-spin h-6 w-6 mx-auto mb-2"/>Loading...</td></tr>
                            ) : programs.length === 0 ? (
                                <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-500">Data tidak ditemukan.</td></tr>
                            ) : (
                                programs.map((program) => (
                                    <tr key={program.id} className={`group transition-colors ${program.is_deleted ? 'bg-red-50/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                        
                                        {/* 1. Name & Desc: Hapus flex-col berlebihan, buat compact */}
                                        {visibleColumns.find(c => c.key === 'name')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div>
                                                    <span className={`block font-semibold text-slate-900 dark:text-white ${program.is_deleted ? 'text-red-600 line-through' : ''}`}>
                                                        {program.name}
                                                    </span>
                                                    <span className="block text-xs text-slate-500 mt-0.5 truncate max-w-[200px]" title={program.description}>
                                                        {program.description || '-'}
                                                    </span>
                                                </div>
                                            </td>
                                        )}

                                        {/* 2. Registration: Format tanggal yang lebih rapi */}
                                        {visibleColumns.find(c => c.key === 'dates')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400 w-10">Start:</span>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {program.registration_starts_at ? new Date(program.registration_starts_at).toLocaleDateString() : '-'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-slate-400 w-10">End:</span>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {program.registration_ends_at ? new Date(program.registration_ends_at).toLocaleDateString() : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {/* 3. Capacity: Simple Badge */}
                                        {visibleColumns.find(c => c.key === 'capacity')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    {program.capacity || '∞'}
                                                </span>
                                            </td>
                                        )}

                                        {/* 4. Cohort: Gabung icon dan teks sebaris */}
                                        {visibleColumns.find(c => c.key === 'cohort')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        <PlayCircle size={14} className="text-indigo-500" />
                                                        {program.cohort_starts_at ? new Date(program.cohort_starts_at).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : '-'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Clock size={14} className="text-slate-400" />
                                                        {program.placement_duration_months ? `${program.placement_duration_months} Bulan` : '-'}
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {/* 5. Status: Badge Kecil */}
                                        {visibleColumns.find(c => c.key === 'status')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                {program.is_deleted ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">Deleted</span>
                                                ) : program.is_active ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                        )}

                                        {/* 6. Applicants */}
                                        {visibleColumns.find(c => c.key === 'applicants')?.visible && (
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-center gap-2">
                                                    <Users size={14} className="text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{program.applications_count || 0}</span>
                                                </div>
                                            </td>
                                        )}

                                        {/* 7. Action */}
                                        {visibleColumns.find(c => c.key === 'action')?.visible && (
                                            <td className="px-6 py-4 text-right align-top">
                                                <ProgramActionMenu 
                                                    program={program}
                                                    onEdit={() => { setProgramToEdit(program); setIsModalOpen(true); }}
                                                    onDelete={() => handleDelete(program.id)}
                                                    onRestore={() => handleRestore(program.id)}
                                                    onToggle={() => handleToggle(program.id)}
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
                <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <p className="text-xs text-slate-500">Showing {programs.length} of {pagination.total} data</p>
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

            <ProgramModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => { fetchData(); fetchSummary(); }} 
                programToEdit={programToEdit}
            />
        </div>
    );
}

// Simple Stat Card
function StatCard({ title, value, icon, border, indicator, subtitle }: any) {
    return (
        <div className={`p-6 rounded-2xl bg-white border shadow-sm ${border || 'border-slate-200'} relative overflow-hidden`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
                    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
            </div>
            {indicator && <div className={`absolute top-6 right-16 w-2 h-2 rounded-full ${indicator} animate-pulse`}></div>}
        </div>
    );
}