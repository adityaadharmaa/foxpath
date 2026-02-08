import { useEffect, useState, useRef } from "react";
import { roleService } from "@/services/roleService";
import {
  Search,
  Edit,
  Trash2,
  Shield,
  Plus,
  Users,
  CheckCircle,
  ListFilter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Columns,
  Check,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import RoleModal from "./modal/RoleModal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

// --- ACTION MENU COMPONENT ---
function RoleActionMenu({
  onEdit,
  onDelete,
  isProtected,
}: {
  onEdit: () => void;
  onDelete: () => void;
  isProtected: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-90"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
            >
              <Edit size={14} className="text-blue-500" /> Edit Role
            </button>
            {!isProtected && (
              <>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg transition-colors"
                >
                  <Trash2 size={14} /> Hapus Role
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function RoleManagementPage() {
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [displayedRoles, setDisplayedRoles] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totals: { roles: 0, most_used: "-", most_used_count: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<any>(null);

  useEffect(() => {
    fetchData();
    fetchSummary();
  }, []);

  useEffect(() => {
    let filtered = allRoles;
    if (search) {
      filtered = allRoles.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          (r.description &&
            r.description.toLowerCase().includes(search.toLowerCase())),
      );
    }
    const total = filtered.length;
    const last_page = Math.ceil(total / pagination.per_page) || 1;
    const currentPage = Math.min(pagination.current_page, last_page);
    const paginatedData = filtered.slice(
      (currentPage - 1) * pagination.per_page,
      currentPage * pagination.per_page,
    );

    setDisplayedRoles(paginatedData);
    setPagination((prev) => ({
      ...prev,
      total,
      last_page,
      current_page: currentPage,
    }));
  }, [allRoles, search, pagination.per_page, pagination.current_page]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await roleService.getRoles();
      setAllRoles(response.data.data || []);
    } catch (error) {
      setAllRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await roleService.getSummary();
      if (res.data?.data) setSummary(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // --- KEMBALIKAN FUNGSI MODAL ---
  const openCreateModal = () => {
    setRoleToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role: any) => {
    setRoleToEdit(role);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deleteName?.toLowerCase() === "admin") {
      toast.error("Role Admin tidak dapat dihapus!");
      setDeleteId(null);
      return;
    }
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await roleService.deleteRole(deleteId);
      toast.success("Role berhasil dihapus");
      fetchData();
      fetchSummary();
      setDeleteId(null);
    } catch (error: any) {
      toast.error("Gagal menghapus role.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 mt-4 px-4 md:px-0">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <BreadCrumbs items={[{ label: "Role Management" }]} />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Role Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Kelola tingkatan akses dan departemen pengguna FoxPath.
          </p>
        </div>
        <Button
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20 rounded-2xl h-12 px-8 font-bold"
          onClick={openCreateModal}
        >
          <Plus size={18} /> Tambah Role
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Roles"
          value={summary.totals.roles}
          icon={<Shield className="text-blue-500" />}
        />
        <StatCard
          title="Populer"
          value={summary.totals.most_used}
          icon={<Users className="text-purple-500" />}
          subtitle={`${summary.totals.most_used_count} Users`}
        />
        <StatCard
          title="Status"
          value="Active"
          icon={<CheckCircle className="text-emerald-500" />}
          indicator="bg-emerald-500"
        />
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Input
            placeholder="Cari role..."
            className="pl-11 h-12"
            startIcon={<Search size={18} className="text-slate-400" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 self-end px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Rows:
          </span>
          <select
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-3 outline-none font-bold"
            value={pagination.per_page}
            onChange={(e) =>
              setPagination({
                ...pagination,
                per_page: Number(e.target.value),
                current_page: 1,
              })
            }
          >
            {[10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DATA CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Menyinkronkan Peran...
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (Card List) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {displayedRoles.map((role) => (
              <div
                key={role.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative"
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center shadow-inner">
                      <Shield size={24} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white text-base leading-tight uppercase tracking-tight">
                        {role.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        ID: #{role.id}
                      </p>
                    </div>
                  </div>
                  <RoleActionMenu
                    onEdit={() => openEditModal(role)}
                    onDelete={() => {
                      setDeleteId(role.id);
                      setDeleteName(role.name);
                    }}
                    isProtected={role.name.toLowerCase() === "admin"}
                  />
                </div>
                <div className="space-y-4 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Description
                    </span>
                    <p className="text-xs font-bold dark:text-slate-200 leading-relaxed line-clamp-2">
                      {role.description || "Tidak ada deskripsi."}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-blue-500" />
                      <span className="text-xs font-black dark:text-slate-100">
                        {role.users_count || 0} Pengguna
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold">
                        {new Date(role.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (Table) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[10px] tracking-widest font-black text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5">Role Identity</th>
                  <th className="px-6 py-5">Role Description</th>
                  <th className="px-6 py-5">Usage</th>
                  <th className="px-6 py-5">Created Date</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {displayedRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group font-medium"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center border dark:border-blue-900/30">
                          <Shield size={16} />
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-tight">
                          {role.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                      {role.description || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="rounded-lg font-black text-[10px] bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      >
                        {role.users_count || 0} USERS
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">
                      {new Date(role.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <RoleActionMenu
                        onEdit={() => openEditModal(role)}
                        onDelete={() => {
                          setDeleteId(role.id);
                          setDeleteName(role.name);
                        }}
                        isProtected={role.name.toLowerCase() === "admin"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* PAGINATION SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Page {pagination.current_page} of {pagination.last_page}
          <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-800" />
          {pagination.total} Roles Configured
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none h-12 rounded-2xl font-bold dark:bg-slate-900 dark:border-slate-800"
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
            className="flex-1 sm:flex-none h-12 rounded-2xl font-bold dark:bg-slate-900 dark:border-slate-800"
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
        title="Hapus Role?"
        description={`Tindakan ini permanen. Seluruh data terkait role "${deleteName}" akan dihapus.`}
        confirmText="Ya, Hapus Permanen"
        variant="danger"
        isLoading={isDeleting}
      />
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchData();
          fetchSummary();
        }}
        roleToEdit={roleToEdit}
      />
    </div>
  );
}

function StatCard({ title, value, icon, indicator, subtitle }: any) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:border-blue-500/50">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase tabular-nums">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1 italic">
              {subtitle}
            </p>
          )}
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
