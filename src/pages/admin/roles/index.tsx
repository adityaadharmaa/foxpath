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
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import RoleModal from "./modal/RoleModal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import BreadCrumbs from "@/components/ui/breadcrumbs";

function ColumnToggle({
  columns,
  onChange,
}: {
  columns: any[];
  onChange: (key: string) => void;
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
      <Button
        variant="outline"
        className="gap-2 border-slate-200 dark:border-slate-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Columns size={16} /> Columns
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
          <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">
            Toggle Columns
          </p>
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
  );
}

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
        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MoreHorizontal size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1">
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg"
            >
              <Edit size={14} className="text-blue-500" />
              Edit Role
            </button>

            {!isProtected && (
              <>
                <div className="border border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg"
                >
                  <Trash size={14} /> Hapus Role
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
  // Data State
  const [allRoles, setAllRoles] = useState<any[]>([]); // Menyimpan semua data mentah
  const [displayedRoles, setDisplayedRoles] = useState<any[]>([]); // Data yang ditampilkan (paginated)
  const [summary, setSummary] = useState({
    totals: { roles: 0, most_used: "-", most_used_count: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter & Pagination State
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  const [visibleColumns, setVisibleColumns] = useState([
    { key: "name", label: "Role Name", visible: true },
    { key: "desc", label: "Description", visible: true },
    { key: "count", label: "Users Count", visible: true },
    { key: "date", label: "Created At", visible: true },
    { key: "action", label: "Actions", visible: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState<any>(null);

  useEffect(() => {
    fetchData();
    fetchSummary();
  }, []);

  useEffect(() => {
    let filtered = allRoles;

    // 1. Filter Search
    if (search) {
      filtered = allRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(search.toLowerCase()) ||
          (role.description &&
            role.description.toLowerCase().includes(search.toLowerCase())),
      );
    }

    const total = filtered.length;
    const last_page = Math.ceil(total / pagination.per_page) || 1;

    const currentPage = Math.min(pagination.current_page, last_page);

    const startIdx = (currentPage - 1) * pagination.per_page;
    const endIdx = startIdx + pagination.per_page;
    const paginatedData = filtered.slice(startIdx, endIdx);

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
      const data = response.data.data || [];
      setAllRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setAllRoles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await roleService.getSummary();
      if (res.data && res.data.data) {
        setSummary(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id: number, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
  };

  const handleDelete = async () => {
    if (deleteName?.toLowerCase() === "admin") {
      toast.error("Role Admin tidak boleh dihapus!");
      setDeleteId(null);
      return;
    }

    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await roleService.deleteRole(deleteId);
      toast.success(res.data.message);
      fetchData();
      fetchSummary();
      setDeleteId(null);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal menghapus role.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const openCreateModal = () => {
    setRoleToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role: any) => {
    setRoleToEdit(role);
    setIsModalOpen(true);
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((cols) =>
      cols.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <BreadCrumbs items={[{ label: "Role Management" }]} />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Role Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Atur hak akses dan tipe pengguna dalam sistem.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus size={16} /> Add Role
        </Button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Roles"
          value={summary.totals.roles}
          icon={<Shield className="text-blue-500" />}
          border="border-blue-200 dark:border-blue-900"
        />
        <StatCard
          title="Most Used Role"
          value={summary.totals.most_used}
          icon={<Users className="text-purple-500" />}
          border="border-purple-200 dark:border-purple-900"
          subtitle={`${summary.totals.most_used_count} Users`}
        />
        <StatCard
          title="System Status"
          value="Active"
          icon={<CheckCircle className="text-green-500" />}
          indicator="bg-green-500"
          border="border-green-200 dark:border-green-900"
        />
      </div>

      {/* MAIN TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80 group">
            <Input
              placeholder="Cari role..."
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500 transition-all"
              startIcon={
                <Search
                  className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={14}
                />
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Rows Per Page Dropdown */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="hidden sm:inline">Rows:</span>
              <select
                className="h-9 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                value={pagination.per_page}
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    per_page: Number(e.target.value),
                    current_page: 1,
                  }))
                }
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>

            {/* Column Toggle */}
            <ColumnToggle columns={visibleColumns} onChange={toggleColumn} />
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto relative">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[11px] tracking-wider font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
              <tr>
                {visibleColumns.find((c) => c.key === "name")?.visible && (
                  <th className="px-6 py-4">Role Name</th>
                )}
                {visibleColumns.find((c) => c.key === "desc")?.visible && (
                  <th className="px-6 py-4">Description</th>
                )}
                {visibleColumns.find((c) => c.key === "count")?.visible && (
                  <th className="px-6 py-4">Users Count</th>
                )}
                {visibleColumns.find((c) => c.key === "date")?.visible && (
                  <th className="px-6 py-4">Created At</th>
                )}
                {visibleColumns.find((c) => c.key === "action")?.visible && (
                  <th className="px-6 py-4 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={visibleColumns.filter((c) => c.visible).length}
                    className="px-6 py-20 text-center text-slate-500"
                  >
                    <div className="flex flex-col justify-center items-center gap-2">
                      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                      <p className="text-xs">Memuat data role...</p>
                    </div>
                  </td>
                </tr>
              ) : displayedRoles.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumns.filter((c) => c.visible).length}
                    className="px-6 py-20 text-center text-slate-500"
                  >
                    <div className="flex flex-col justify-center items-center gap-2">
                      <ListFilter className="h-8 w-8 text-slate-300" />
                      Tidak ada data role ditemukan.
                    </div>
                  </td>
                </tr>
              ) : (
                displayedRoles.map((role) => (
                  <tr
                    key={role.id}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Name */}
                    {visibleColumns.find((c) => c.key === "name")?.visible && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                            <Shield size={16} />
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white uppercase">
                            {role.name}
                          </span>
                        </div>
                      </td>
                    )}

                    {/* Desc */}
                    {visibleColumns.find((c) => c.key === "desc")?.visible && (
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                        {role.description || "-"}
                      </td>
                    )}

                    {/* Count (Fix: Pastikan backend kirim users_count) */}
                    {visibleColumns.find((c) => c.key === "count")?.visible && (
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (role.users_count || 0) > 0
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {role.users_count || 0} Users
                        </span>
                      </td>
                    )}

                    {/* Date */}
                    {visibleColumns.find((c) => c.key === "date")?.visible && (
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {role.created_at
                          ? new Date(role.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>
                    )}

                    {/* Actions */}
                    {visibleColumns.find((c) => c.key === "action")
                      ?.visible && (
                      <td className="px-6 py-4 text-right">
                        <RoleActionMenu
                          onEdit={() => openEditModal(role)}
                          onDelete={() => confirmDelete(role.id, role.name)}
                          isProtected={role.name.toLowerCase === "admin"}
                        />
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-950/30">
          <p className="text-xs text-slate-500">
            Menampilkan{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {displayedRoles.length}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-slate-900 dark:text-white">
              {pagination.total}
            </span>{" "}
            data
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-8 text-xs"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  current_page: prev.current_page - 1,
                }))
              }
              disabled={pagination.current_page === 1 || isLoading}
            >
              <ChevronLeft size={12} className="mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-8 text-xs"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  current_page: prev.current_page + 1,
                }))
              }
              disabled={
                pagination.current_page === pagination.last_page || isLoading
              }
            >
              Next <ChevronRight size={12} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchData();
          fetchSummary();
        }}
        roleToEdit={roleToEdit}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus, Role?"
        description="Tindakan ini tidak dapat dibatalkan. Role yang dihapus akan dihapus permanen."
        confirmText="Ya, Hapus"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

// Sub Component Stat Card (Sama)
function StatCard({ title, value, icon, border, indicator, subtitle }: any) {
  return (
    <div
      className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm ${border || "border-slate-200"} relative overflow-hidden`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          {icon}
        </div>
      </div>
      {indicator && (
        <div
          className={`absolute top-6 right-16 w-2 h-2 rounded-full ${indicator} animate-pulse`}
        ></div>
      )}
    </div>
  );
}
