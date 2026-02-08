import { useEffect, useRef, useState } from "react";
import { criteriaService } from "@/services/criteriaService";
import {
  Archive,
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit,
  Layers,
  Loader2,
  MoreHorizontal,
  Percent,
  Plus,
  RefreshCcw,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CriteriaModal from "./modal/CriteriaModal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";

// --- COLUMN TOGGLE COMPONENT ---
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
        className="gap-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Layers size={16} /> Columns
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1.5">
          <p className="px-3 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Toggle Columns
          </p>
          {columns.map((col) => (
            <button
              key={col.key}
              onClick={() => onChange(col.key)}
              className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between rounded-lg transition-colors"
            >
              {col.label}
              {col.visible && (
                <Check size={14} className="text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- ACTION MENU COMPONENT ---
function CriteriaActionMenu({
  criteria,
  onEdit,
  onDelete,
  onRestore,
  onToggle,
}: any) {
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
        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1.5">
          {criteria.is_deleted ? (
            <button
              onClick={() => {
                onRestore();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2 rounded-lg transition-colors"
            >
              <RefreshCcw size={14} /> Restore Kriteria
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onEdit();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
              >
                <Edit size={14} className="text-blue-500" /> Edit Kriteria
              </button>
              <button
                onClick={() => {
                  onToggle();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
              >
                {criteria.is_active ? (
                  <ToggleRight size={14} className="text-emerald-500" />
                ) : (
                  <ToggleLeft size={14} className="text-slate-400" />
                )}
                {criteria.is_active ? "Nonaktifkan" : "Aktifkan"}
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1.5"></div>
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg transition-colors"
              >
                <Trash2 size={14} /> Arsipkan
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function CriteriaManagementPage() {
  const [criterias, setCriterias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState([
    { key: "info", label: "Criteria Info", visible: true },
    { key: "weight", label: "Weight", visible: true },
    { key: "type", label: "Type", visible: true },
    { key: "status", label: "Status", visible: true },
    { key: "action", label: "Actions", visible: true },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criteriaToEdit, setCriteriaToEdit] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [pagination.current_page, pagination.per_page, search, includeDeleted]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.current_page,
        per_page: pagination.per_page,
        q: search,
        include_deleted: includeDeleted ? 1 : 0,
      };
      const response = await criteriaService.getCriteria(params);
      setCriterias(response.data.data || []);
      if (response.data.meta?.pagination)
        setPagination(response.data.meta.pagination);
    } catch (error) {
      setCriterias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await criteriaService.deleteCriteria(deleteId);
      toast.success("Kriteria berhasil diarsipkan");
      fetchData();
      setDeleteId(null);
    } catch (error: any) {
      toast.error("Gagal menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (id: number) => {
    const toastId = toast.loading("Memulihkan...");
    try {
      await criteriaService.restoreCriteria(id);
      toast.success("Kriteria dipulihkan", { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error("Gagal Restore.", { id: toastId });
    }
  };

  const handleToggle = async (id: number) => {
    const toastId = toast.loading("Mengupdate Status...");
    try {
      await criteriaService.toggleStatus(id);
      toast.success("Status diperbarui", { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error("Gagal update status.", { id: toastId });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-0 mt-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <BreadCrumbs items={[{ label: "Criteria Management" }]} />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Criteria Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Kelola bobot dan jenis kriteria penunjang keputusan.
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-2">
          <Button
            variant={includeDeleted ? "destructive" : "outline"}
            onClick={() => setIncludeDeleted(!includeDeleted)}
            className="flex-1 md:flex-none gap-2 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all"
          >
            <Archive size={16} />{" "}
            {includeDeleted ? "Hide Deleted" : "Show Deleted"}
          </Button>
          <Button
            onClick={() => {
              setCriteriaToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20 rounded-2xl h-12 px-8 font-bold transition-all active:scale-95"
          >
            <Plus size={18} /> Add Criteria
          </Button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Input
            placeholder="Cari kode atau nama..."
            className="pl-11 h-12"
            startIcon={<Search size={18} className="text-slate-400" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, current_page: 1 });
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Rows:
          </span>
          <select
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-3 outline-none font-bold"
            value={pagination.per_page}
            onChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                per_page: Number(e.target.value),
                current_page: 1,
              }))
            }
          >
            {[5, 10, 20, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ColumnToggle
            columns={visibleColumns}
            onChange={(key) =>
              setVisibleColumns((cols) =>
                cols.map((c) =>
                  c.key === key ? { ...c, visible: !c.visible } : c,
                ),
              )
            }
          />
        </div>
      </div>

      {/* CONTENT */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Loading Criteria...
          </p>
        </div>
      ) : criterias.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-slate-500 font-medium italic">
            Tidak ada kriteria ditemukan.
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (Card List) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {criterias.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "bg-white dark:bg-slate-900 p-5 rounded-3xl border shadow-sm relative overflow-hidden transition-all active:scale-[0.98]",
                  item.is_deleted
                    ? "border-red-200 dark:border-red-900 opacity-80"
                    : "border-slate-200 dark:border-slate-800",
                )}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border border-indigo-100 dark:border-indigo-900/30">
                      {item.code}
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "font-black text-slate-900 dark:text-white text-base leading-tight truncate max-w-[150px]",
                          item.is_deleted && "line-through text-slate-400",
                        )}
                      >
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase mt-1">
                        Weight: {item.weight}%
                      </p>
                    </div>
                  </div>
                  <CriteriaActionMenu
                    criteria={item}
                    onEdit={() => {
                      setCriteriaToEdit(item);
                      setIsModalOpen(true);
                    }}
                    onDelete={() => confirmDelete(item.id)}
                    onRestore={() => handleRestore(item.id)}
                    onToggle={() => handleToggle(item.id)}
                  />
                </div>

                <div className="space-y-4 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Kriteria Tipe
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 font-black text-[9px] uppercase border-none px-0",
                          item.type === "benefit"
                            ? "text-blue-500"
                            : "text-orange-500",
                        )}
                      >
                        {item.type === "benefit" ? (
                          <ArrowUpCircle size={12} />
                        ) : (
                          <ArrowDownCircle size={12} />
                        )}{" "}
                        {item.type}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </span>
                      {item.is_deleted ? (
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Archived
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border",
                            item.is_active
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700",
                          )}
                        >
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                    {item.description || "No description provided."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (Table) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[10px] tracking-widest font-black text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  {visibleColumns.map(
                    (col) =>
                      col.visible && (
                        <th
                          key={col.key}
                          className={cn(
                            "px-6 py-5",
                            col.key === "action" && "text-right",
                          )}
                        >
                          {col.label}
                        </th>
                      ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {criterias.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    {visibleColumns.find((c) => c.key === "info")?.visible && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs border dark:border-indigo-900/30 shrink-0">
                            {item.code}
                          </div>
                          <div className="min-w-0">
                            <span
                              className={cn(
                                "block font-bold text-slate-900 dark:text-slate-100 truncate max-w-[200px]",
                                item.is_deleted &&
                                  "line-through text-slate-400",
                              )}
                            >
                              {item.name}
                            </span>
                            <span className="block text-[10px] text-slate-500 dark:text-slate-500 mt-1 truncate max-w-xs">
                              {item.description || "-"}
                            </span>
                          </div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.find((c) => c.key === "weight")
                      ?.visible && (
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-black text-slate-700 dark:text-slate-200">
                          <Percent size={14} className="text-slate-400" />{" "}
                          {item.weight}%
                        </div>
                      </td>
                    )}
                    {visibleColumns.find((c) => c.key === "type")?.visible && (
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1 font-black text-[10px] uppercase",
                            item.type === "benefit"
                              ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/30"
                              : "bg-orange-50/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/30",
                          )}
                        >
                          {item.type === "benefit" ? (
                            <ArrowUpCircle size={12} />
                          ) : (
                            <ArrowDownCircle size={12} />
                          )}{" "}
                          {item.type}
                        </Badge>
                      </td>
                    )}
                    {visibleColumns.find((c) => c.key === "status")
                      ?.visible && (
                      <td className="px-6 py-4">
                        {item.is_deleted ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30">
                            Arsip
                          </span>
                        ) : (
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-black uppercase border",
                              item.is_active
                                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700",
                            )}
                          >
                            {item.is_active ? "Aktif" : "Nonaktif"}
                          </span>
                        )}
                      </td>
                    )}
                    {visibleColumns.find((c) => c.key === "action")
                      ?.visible && (
                      <td className="px-6 py-4 text-right">
                        <CriteriaActionMenu
                          criteria={item}
                          onEdit={() => {
                            setCriteriaToEdit(item);
                            setIsModalOpen(true);
                          }}
                          onDelete={() => confirmDelete(item.id)}
                          onRestore={() => handleRestore(item.id)}
                          onToggle={() => handleToggle(item.id)}
                        />
                      </td>
                    )}
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
          {pagination.total} Criteria Total
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

      <CriteriaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        criteriaToEdit={criteriaToEdit}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Arsipkan Kriteria?"
        description="Kriteria yang diarsipkan tidak akan digunakan dalam perhitungan ranking pendaftar."
        confirmText="Ya, Arsipkan"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
