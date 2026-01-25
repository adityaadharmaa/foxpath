import { useEffect, useState, useRef } from "react";
import { userService } from "@/services/userService";
import { 
    Search, 
    MoreHorizontal, 
    Loader2, 
    UserCheck, 
    UserX, 
    Shield, 
    Trash2, 
    ChevronLeft,
    ChevronRight,
    Users,
    Clock,
    User,
    GraduationCap,
    BookOpen,
    Mail,
    Download,
    FileSpreadsheet,
    FileText,
    Columns,
    Check,
    ListFilter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AddUserModal from "./modal/AddUserModal";
import ConfirmDialog from "@/components/ui/confirm-dialog";

function ActionMenu({ onToggle, onDelete, onResend, onUpdateRole, currentRole, isActive }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const roleStr = String(currentRole || '').toLowerCase()
    const isAdmin = roleStr === 'admin'

    const targetRole = isAdmin ? 'users' : 'admin'
    const roleLabel = isAdmin ? 'Jadikan User' : 'Jadikan Admin'
    const RoleIcon = isAdmin ? User : Shield

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
                <MoreHorizontal size={18} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1">
                        <button
                            onClick={() => { onResend(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                            <Mail size={14} className="text-blue-500" />
                            Kirim Email Verifikasi
                        </button>
                        <button
                        onClick={() => {onUpdateRole(targetRole); setIsOpen(false)}}
                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                        <RoleIcon size={14} className={currentRole === 'admin' ? 'text-slate-500' : 'text-purple-500'} />    
                        {roleLabel}
                        </button>
                        <button 
                            onClick={() => { onToggle(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                            {isActive ? <UserX size={14} className="text-red-500"/> : <UserCheck size={14} className="text-green-500"/>}
                            {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <button 
                            onClick={() => { onDelete(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                            <Trash2 size={14} /> Hapus User
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function ExportMenu({onExport} : {onExport: (format: 'xlsx' | 'csv') => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <Button 
                variant="outline"
                className="gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Download size={16} /> Export
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="py-1">
                        <button
                            onClick={() => {onExport('xlsx'); setIsOpen(false)}}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                            <FileSpreadsheet size={14} className="text-green-600"/>
                            Export Excel (.xlsx)
                        </button>
                        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                        <button
                            onClick={() => {onExport('csv'); setIsOpen(false)}}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                            <FileText size={14} className="text-green-600"/>
                            Export CSV (.csv)
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function ColumnToggle({columns, onChange}: {columns:any[], onChange:(key: string) => void}){
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
            <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-800" onClick={() => setIsOpen(!isOpen)}>
                <Columns size={16}/>Columns
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                    <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Toggle Columns</p>
                    {columns.map((col) => (
                        <button
                            key={col.key}
                            onClick={() => onChange(col.key)} 
                            className="w-full tex-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hoverLbg-slate-800 flex items-center justify-between rounded-md"
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

export default function UserManagementPage() {
    const [users, setUsers] = useState<any[]>([]);
    // Sesuaikan initial state dengan struktur response backend Anda
    const [summary, setSummary] = useState({ 
        totals: { users: 0, active: 0, inactive: 0, deleted_users: 0, admin: 0 },
        by_applicant_type: { siswa: 0, mahasiswa: 0 }
    });

    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [search, setSearch] = useState("");
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10
    });

    const [visibleColumns, setVisibleColumns] = useState([
        {key: 'user', label: 'User Info', visible: true},
        {key: 'email', label: 'Email', visible: true},
        {key: 'role', label: 'Role', visible: true},
        {key: 'status', label: 'Status', visible: true},
        {key: 'created_at', label: 'Bergabung', visible: true},
        {key: 'action', label: 'Aksi', visible: true}
    ])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500)
        return () => clearTimeout(timer)
    }, [pagination.current_page, pagination.per_page ,search]);

    useEffect(() => {
        fetchSummary()
    }, [])

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await userService.getUsers(pagination.current_page, pagination.per_page, search);
            setUsers(response.data);
            if(response.meta && response.meta.pagination) {
                setPagination({
                    current_page: response.meta.pagination.current_page,
                    last_page: response.meta.pagination.last_page,
                    total: response.meta.pagination.total,
                    per_page: response.meta.pagination.per_page
                });
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await userService.getSummary();
            if(res.data) {
                setSummary(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleStatus = async (user: any) => {
        try {
            await userService.toggleStatus(user.id, user.is_active);
            toast.success(`User berhasil ${user.is_active ? 'dinonaktifkan' : 'diaktifkan'}`);
            fetchData();
            fetchSummary();
        } catch (error) {
            toast.error("Gagal mengubah status user");
        }
    };

    const handleResendVerification = async (user: any) => {
        const toastId = toast.loading(`Mengirim email ke ${user.email}...`)

        try{
            await userService.resendVerification(user.id)
            toast.success("Email verifikasi berhasil dikirim!", {id: toastId})
        } catch (error: any) {
            const msg = error.response?.data?.message || "Gagal mengirim email verifikasi."
            toast.error(msg, {id: toastId})
        }
    }

    const handleUpdateRole = async(user: any, newRole: string) => {
        const toastId = toast.loading("Memproses perubahan role...")

        try {
            const response = await userService.updateRole(user.id, newRole)

            toast.success(response.data.message, {id: toastId})

            fetchData()
            fetchSummary()
        } catch (error: any) {
            const errMsg = error.response?.data?.message || "Gagal mengubah role."
            toast.error(errMsg, {id: toastId})
        }
    }

    const handleExport = async (format: 'xlsx' | 'csv') => {
        const toastId = toast.loading(`Mengekspor data ke ${format.toUpperCase()}...`)

        try {
            const response = await userService.exportUser(format)

            const type = format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv'

            const url = window.URL.createObjectURL(new Blob([response.data], {type: type}))

            const link = document.createElement('a')
            link.href = url

            const timestampt = new Date().toISOString().split('T')[0]
            link.setAttribute('download', `users_export_${timestampt}.${format}`)

            document.body.appendChild(link)
            link.click()
            link.parentNode?.removeChild(link)

            toast.success("Data berhasil di-download", {id: toastId})
        } catch (error) {
            console.error(error)
            toast.error("Gagal mengekspor data.", {id:toastId})
        }
    }

    const confirmDelete = (id: number) => {
        setDeleteId(id)
    }

    const handleDelete = async () => {
        if(!deleteId) return 
        setIsDeleting(true)
        try {
            const res = await userService.deleteUser(deleteId);
            toast.success(res.data.message);
            fetchData();
            fetchSummary();
            setDeleteId(null)
        } catch (error) {
            toast.error("Gagal menghapus user");
        } finally {
            setIsDeleting(false)
        }
    };

    // Helper untuk URL Gambar (Sesuaikan path storage Anda)
    const getAvatarUrl = (path: string) => {
        if (!path) return null;
        // Jika path sudah full URL (http...), pakai langsung. Jika tidak, tambahkan base url storage
        if (path.startsWith('http')) return path;
        return `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${path}`;
    };

    const toggleColumn = (key: string) => {
        setVisibleColumns(cols => cols.map(c => c.key === key ? {...c, visible: !c.visible} : c))
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola data pengguna sistem pendaftaran magang.</p>
                </div>
                <div className="flex gap-3">
                    <ExportMenu onExport={handleExport}/>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20"
                    onClick={() => setIsAddModalOpen(true)}
                    >
                        <Users size={16} /> Add User
                    </Button>
                </div>
            </div>

            {/* --- STATS CARDS (ADAPTIVE LIGHT/DARK) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard 
                    title="Total Users" 
                    value={summary.totals.users} 
                    icon={<Users className="text-blue-500" />} 
                    border="border-blue-200 dark:border-blue-900"
                />
                <StatCard 
                    title="Active Users" 
                    value={summary.totals.active} 
                    icon={<UserCheck className="text-green-500" />} 
                    indicator="bg-green-500"
                    border="border-green-200 dark:border-green-900"
                />
                <StatCard 
                    title="Inactive / Pending" 
                    value={summary.totals.inactive} 
                    icon={<Clock className="text-orange-500" />} 
                    indicator="bg-orange-500"
                    border="border-orange-200 dark:border-orange-900"
                />
                <StatCard 
                    title="Administrator"
                    value={summary.totals.admin}
                    icon={<Shield className="text-red-500"/>}
                    border="border-red-200 dark:border-red-900"
                />
                <StatCard 
                    title="Mahasiswa" 
                    value={summary.by_applicant_type.mahasiswa} 
                    icon={<GraduationCap className="text-purple-500" />} 
                    border="border-purple-200 dark:border-purple-900"
                />
                <StatCard 
                    title="Siswa"
                    value={summary.by_applicant_type.siswa}
                    icon={<BookOpen className="text-cyan-500"/>}
                    border="border-cyan-200 dark:border-cyan-900"
                />
            </div>

            {/* --- MAIN TABLE CARD --- */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-950/30">
                    <div className="relative w-full sm:w-72">
                        {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" /> */}
                        <Input 
                            placeholder="Cari nama atau email..." 
                            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            startIcon={<Search size={18} className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors"/>}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="hidden sm:inline">Rows:</span>
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
                        </div>

                        <ColumnToggle columns={visibleColumns} onChange={toggleColumn} />
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto relative min-h-75">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[11px] tracking-wider font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
                            <tr>
                                {visibleColumns.find(c => c.key === 'user')?.visible && <th className="px-6 py-4">User Info</th>}
                                {visibleColumns.find(c => c.key === 'email')?.visible && <th className="px-6 py-4">Email</th>}
                                {visibleColumns.find(c => c.key === 'role')?.visible && <th className="px-6 py-4">Role</th>}
                                {visibleColumns.find(c => c.key === 'status')?.visible && <th className="px-6 py-4">Status</th>}
                                {visibleColumns.find(c => c.key === 'created_at')?.visible && <th className="px-6 py-4">Bergabung</th>}
                                {visibleColumns.find(c => c.key === 'action')?.visible && <th className="px-6 py-4 text-right">Aksi</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={visibleColumns.filter(c => c.visible).length} className="px-6 py-20 text-center text-slate-500">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                                            <p className="text-xs">Memuat data pengguna...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={visibleColumns.filter(c => c.visible).length} className="px-6 py-20 text-center text-slate-500">
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <ListFilter className="h-10 w-10 text-slate-300" />
                                            <p>Tidak ada data user ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        {/* USER INFO */}
                                        {visibleColumns.find(c => c.key === 'user')?.visible && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-bold overflow-hidden shrink-0 shadow-sm group-hover:border-blue-200 transition-colors">
                                                        {user.profile_picture ? (
                                                            <img 
                                                                src={getAvatarUrl(user.profile_picture)} 
                                                                alt={user.username} 
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('fallback-text'); }}
                                                            />
                                                        ) : (
                                                            <span className="uppercase text-xs">{user.username?.substring(0, 2)}</span>
                                                        )}
                                                        <span className="hidden uppercase text-xs">{user.username?.substring(0, 2)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{user.username}</p>
                                                        <p className="text-[11px] text-slate-500 uppercase tracking-wider">ID: #{user.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                        )}

                                        {/* EMAIL */}
                                        {visibleColumns.find(c => c.key === 'email')?.visible && (
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-medium">
                                                {user.email}
                                            </td>
                                        )}

                                        {/* ROLE */}
                                        {visibleColumns.find(c => c.key === 'role')?.visible && (
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                                                    user.role_name === 'admin' 
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' 
                                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                                                }`}>
                                                    {user.role_name === 'admin' ? <Shield size={10}/> : <User size={10}/>}
                                                    {user.role_name || 'User'}
                                                </span>
                                            </td>
                                        )}

                                        {/* STATUS */}
                                        {visibleColumns.find(c => c.key === 'status')?.visible && (
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                                                    user.is_active 
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                                }`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                        )}

                                        {/* JOINED AT */}
                                        {visibleColumns.find(c => c.key === 'created_at')?.visible && (
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'}) : '-'}
                                            </td>
                                        )}

                                        {/* ACTION */}
                                        {visibleColumns.find(c => c.key === 'action')?.visible && (
                                            <td className="px-6 py-4 text-right">
                                                <ActionMenu 
                                                    isActive={user.is_active}
                                                    currentRole={user.role_name} 
                                                    onToggle={() => handleToggleStatus(user)}
                                                    onDelete={() => confirmDelete(user.id)}
                                                    onResend={() => handleResendVerification(user)}
                                                    onUpdateRole={(newRole: string) => handleUpdateRole(user, newRole)}
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
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
                    <p className="text-xs text-slate-500">
                        Menampilkan <span className="font-medium text-slate-900 dark:text-white">{users.length}</span> dari <span className="font-medium text-slate-900 dark:text-white">{pagination.total}</span> data
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" size="sm" 
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-8 text-xs"
                            onClick={() => setPagination(prev => ({...prev, current_page: prev.current_page - 1}))}
                            disabled={pagination.current_page === 1 || isLoading}
                        >
                            <ChevronLeft size={12} className="mr-1" /> Previous
                        </Button>
                        <Button 
                            variant="outline" size="sm" 
                            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-8 text-xs"
                            onClick={() => setPagination(prev => ({...prev, current_page: prev.current_page + 1}))}
                            disabled={pagination.current_page === pagination.last_page || isLoading}
                        >
                            Next <ChevronRight size={12} className="ml-1" />
                        </Button>
                    </div>
                </div>

            </div>

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchData()
                    fetchSummary()
                }}
            />

            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Hapus User?"
                description="Tindakan ini tidak dapat dibatalkan. User yang dihapus akan masuk ke arsip (soft delete)."
                confirmText="Ya, Hapus"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}

// --- SUB COMPONENT FOR STATS (ADAPTIVE) ---
function StatCard({ title, value, icon, border, indicator }: any) {
    return (
        <div className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm ${border || 'border-slate-200 dark:border-slate-800'} relative overflow-hidden group hover:shadow-md transition-all`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    {icon}
                </div>
            </div>
            {indicator && (
                 <div className={`absolute top-6 right-16 w-2 h-2 rounded-full ${indicator} animate-pulse`}></div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs text-slate-500">
                <span className="text-green-600 dark:text-green-400 font-medium mr-1 flex items-center">
                   <Users size={12} className="mr-1" /> Live Data
                </span>
                from database
            </div>
        </div>
    );
}