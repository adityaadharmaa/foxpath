import { useEffect, useState, useRef } from "react";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService"; // Import authService
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
  User,
  GraduationCap,
  Plus,
  Mail,
  ListFilter,
  MoreVertical,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import AddUserModal from "./modal/AddUserModal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

// --- ACTION MENU COMPONENT ---
function ActionMenu({
  userId,
  onToggle,
  onDelete,
  onResend,
  onUpdateRole,
  currentRole,
  isActive,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // LOGIC PROTEKSI: Menggunakan ID dari localStorage
  const loggedInUser = authService.getUser();
  const isSelf = loggedInUser?.id === userId; // Perbandingan berbasis ID

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = currentRole === "admin";
  const targetRole = isAdmin ? "users" : "admin";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-90"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-52 origin-top-right bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200",
            "z-[100]",
          )}
        >
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => {
                onResend();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
            >
              <Mail size={14} className="text-blue-500" /> Kirim Verifikasi
              Email
            </button>

            {/* Proteksi berbasis ID */}
            {!isSelf ? (
              <>
                <button
                  onClick={() => {
                    onUpdateRole(targetRole);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
                >
                  {isAdmin ? (
                    <User size={14} className="text-slate-500" />
                  ) : (
                    <Shield size={14} className="text-purple-500" />
                  )}
                  {isAdmin ? "Ubah ke User Biasa" : "Jadikan Administrator"}
                </button>
                <button
                  onClick={() => {
                    onToggle();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
                >
                  {isActive ? (
                    <UserX size={14} className="text-amber-500" />
                  ) : (
                    <UserCheck size={14} className="text-emerald-500" />
                  )}
                  {isActive ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg transition-colors"
                >
                  <Trash2 size={14} /> Hapus Permanen
                </button>
              </>
            ) : (
              <div className="px-4 py-2.5 text-[10px] font-black text-amber-600 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg italic flex items-center gap-2">
                <Shield size={12} /> Akun Sedang Digunakan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totals: { users: 0, active: 0, admin: 0 },
    by_applicant_type: { siswa: 0, mahasiswa: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
  });

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, [pagination.current_page, pagination.per_page, search]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await userService.getUsers(
        pagination.current_page,
        pagination.per_page,
        search,
      );
      setUsers(response.data);
      if (response.meta?.pagination) setPagination(response.meta.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await userService.getSummary();
      if (res.data) setSummary(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await userService.toggleStatus(user.id, user.is_active);
      toast.success(`Status user berhasil diperbarui`);
      fetchData();
      fetchSummary();
    } catch (error) {
      toast.error("Gagal mengubah status");
    }
  };

  const handleResendVerification = async (user: any) => {
    const toastId = toast.loading(`Mengirim email ke ${user.email}...`);
    try {
      await userService.resendVerification(user.id);
      toast.success("Email verifikasi terkirim!", { id: toastId });
    } catch (error) {
      toast.error("Gagal mengirim email.", { id: toastId });
    }
  };

  const handleUpdateRole = async (user: any, newRole: string) => {
    const toastId = toast.loading("Mengubah role...");
    try {
      const response = await userService.updateRole(user.id, newRole);
      toast.success(response.data.message, { id: toastId });
      fetchData();
      fetchSummary();
    } catch (error) {
      toast.error("Gagal mengubah role.", { id: toastId });
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deleteId);
      toast.success("User berhasil dihapus");
      fetchData();
      fetchSummary();
      setDeleteId(null);
    } catch (error) {
      toast.error("Gagal menghapus user");
    } finally {
      setIsDeleting(false);
    }
  };

  const getAvatarUrl = (path: string | null) => {
    if (!path) return null;

    // Jika path dari API sudah URL lengkap (http://...), langsung gunakan
    if (path.startsWith("http")) return path;

    const storageBase =
      import.meta.env.VITE_STORAGE_URL || "http://192.168.110.250:8000";
    const baseUrl = storageBase.endsWith("/")
      ? storageBase.slice(0, -1)
      : storageBase;

    let cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (!cleanPath.startsWith("/storage/")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-0 mt-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <BreadCrumbs items={[{ label: "User Management" }]} />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Otorisasi dan kontrol data pengguna FoxPath.
          </p>
        </div>
        <Button
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl h-12 px-8 font-bold"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} /> Tambah User
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={summary.totals.users}
          icon={<Users className="text-blue-500" />}
        />
        <StatCard
          title="Active Status"
          value={summary.totals.active}
          icon={<UserCheck className="text-emerald-500" />}
          indicator="bg-emerald-500"
        />
        <StatCard
          title="Administrators"
          value={summary.totals.admin}
          icon={<Shield className="text-purple-500" />}
        />
        <StatCard
          title="Total Pelamar"
          value={
            summary.by_applicant_type.siswa +
            summary.by_applicant_type.mahasiswa
          }
          icon={<GraduationCap className="text-orange-500" />}
        />
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Input
            placeholder="Cari nama atau email..."
            className="pl-11 h-12"
            startIcon={<Search size={18} className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            Rows per page:
          </span>
          <select
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-3 outline-none font-bold dark:text-white"
            value={pagination.per_page}
            onChange={(e) =>
              setPagination({
                ...pagination,
                per_page: Number(e.target.value),
                current_page: 1,
              })
            }
          >
            {[5, 10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Menyinkronkan Data...
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-6 gap-2">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-50 dark:border-slate-700 shadow-sm">
                      {u.profile?.profile_picture_url ? (
                        <img
                          src={getAvatarUrl(u.profile?.profile_picture_url)}
                          alt={u.username}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-400" size={28} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="font-black text-slate-900 dark:text-white text-lg leading-tight break-all truncate">
                        {u.username}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Fingerprint size={12} className="text-slate-400" />
                        <p className="text-[10px] text-slate-400 font-black uppercase">
                          ID: #{u.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 z-20">
                    {/* KIRIM userId KE SINI */}
                    <ActionMenu
                      userId={u.id}
                      isActive={u.is_active}
                      currentRole={u.role.name}
                      onDelete={() => confirmDelete(u.id)}
                      onToggle={() => handleToggleStatus(u)}
                      onResend={() => handleResendVerification(u)}
                      onUpdateRole={(r: string) => handleUpdateRole(u, r)}
                    />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-50 dark:border-slate-800/50 pt-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Email Address
                    </span>
                    <span className="text-sm font-bold dark:text-slate-200 break-all">
                      {u.email}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Peran
                      </span>
                      <Badge
                        className={cn(
                          "w-fit uppercase text-[9px] font-black px-2 h-6 border-none",
                          u.role.name === "admin"
                            ? "bg-purple-500/10 text-purple-600"
                            : "bg-blue-500/10 text-blue-600",
                        )}
                      >
                        {u.role.name}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Status
                      </span>
                      <Badge
                        className={cn(
                          "w-fit uppercase text-[9px] font-black px-2 h-6 border-none",
                          u.is_active
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-red-500/10 text-red-600",
                        )}
                      >
                        {u.is_active ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
            <table className="w-full text-left text-sm table-auto">
              <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[10px] tracking-widest font-black text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5 text-center w-20">Profile</th>
                  <th className="px-6 py-5">User Account</th>
                  <th className="px-6 py-5">Email Address</th>
                  <th className="px-6 py-5 text-center">Role</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group relative font-medium"
                  >
                    <td className="px-6 py-4">
                      <div className="h-10 w-10 mx-auto rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border dark:border-slate-700 shadow-sm transition-all">
                        {u.profile?.profile_picture_url ? (
                          <img
                            src={getAvatarUrl(u.profile?.profile_picture_url)}
                            alt={u.username}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="text-slate-400" size={18} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {u.username}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        ID: #{u.id}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 truncate max-w-[220px]">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          "uppercase text-[10px] font-black border-none px-0",
                          u.role.name === "admin"
                            ? "text-purple-500"
                            : "text-blue-500",
                        )}
                      >
                        {u.role.name}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div
                        className={cn(
                          "inline-flex items-center gap-2 text-xs font-bold",
                          u.is_active ? "text-emerald-600" : "text-red-500",
                        )}
                      >
                        <div
                          className={cn(
                            "h-1.5 w-1.5 rounded-full animate-pulse",
                            u.is_active ? "bg-emerald-500" : "bg-red-500",
                          )}
                        />
                        {u.is_active ? "Active" : "Disabled"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* KIRIM userId KE SINI */}
                      <ActionMenu
                        userId={u.id}
                        isActive={u.is_active}
                        currentRole={u.role.name}
                        onDelete={() => confirmDelete(u.id)}
                        onToggle={() => handleToggleStatus(u)}
                        onResend={() => handleResendVerification(u)}
                        onUpdateRole={(r: string) => handleUpdateRole(u, r)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Page {pagination.current_page} of {pagination.last_page}{" "}
          <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />{" "}
          {pagination.total} Users Total
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none h-12 rounded-2xl font-bold dark:bg-slate-900"
            disabled={pagination.current_page === 1}
            onClick={() =>
              setPagination({
                ...pagination,
                current_page: pagination.current_page - 1,
              })
            }
          >
            <ChevronLeft size={18} className="mr-1" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none h-12 rounded-2xl font-bold dark:bg-slate-900"
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              setPagination({
                ...pagination,
                current_page: pagination.current_page + 1,
              })
            }
          >
            Next <ChevronRight size={18} className="ml-1" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Arsipkan User?"
        description="Tindakan ini tidak dapat dibatalkan secara instan."
        confirmText="Ya, Arsipkan"
        variant="danger"
        isLoading={isDeleting}
      />
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}

function StatCard({ title, value, icon, indicator }: any) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-blue-500/50">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl shadow-inner">
          {icon}
        </div>
      </div>
      {indicator && (
        <div
          className={cn(
            "absolute top-6 right-16 w-2 h-2 rounded-full animate-pulse",
            indicator,
          )}
        ></div>
      )}
    </div>
  );
}
