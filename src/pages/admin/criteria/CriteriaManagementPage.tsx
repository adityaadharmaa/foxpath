import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CriteriaModal from "./modal/CriteriaModal";
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
        <Layers size={16} /> Columns
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
        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MoreHorizontal size={18} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1">
            {criteria.is_deleted ? (
              <button
                onClick={() => {
                  onRestore();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-green-600 hover:bg-green-50 flex items-center gap-2 rounded-lg"
              >
                <RefreshCcw size={14} /> Restore
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onEdit();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded-lg"
                >
                  <Edit size={14} className="text-blue-500" /> Edit
                </button>
                <button
                  onClick={() => {
                    onToggle();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 rounded-lg"
                >
                  {criteria.is_active ? (
                    <ToggleRight size={14} className="text-green-500" />
                  ) : (
                    <ToggleLeft size={14} className="text-slate-400" />
                  )}
                  {criteria.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg"
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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

  const [isMoadlOpen, setIsModalOpen] = useState(false);
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

      // toast.info(response.data.message)

      setCriterias(response.data.data || []);

      if (response.data.meta && response.data.meta.pagination) {
        setPagination({
          current_page: response.data.meta.pagination.current_page,
          per_page: response.data.meta.pagination.per_page,
          total: response.data.meta.pagination.total,
          last_page: response.data.meta.pagination.last_page,
        });
      }
    } catch (error) {
      console.error("Error fetching criterias", error);
      setCriterias([]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await criteriaService.deleteCriteria(deleteId);
      toast.success(response.data.message);
      fetchData();
      setDeleteId(null);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal menghapus.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResotre = async (id: number) => {
    const toastId = toast.loading("Mengambalikan...");

    try {
      const response = await criteriaService.restoreCriteria(id);
      toast.success(response.data.message, { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal Restore.", {
        id: toastId,
      });
    }
  };

  const handleToggle = async (id: number) => {
    const toastId = toast.loading("Mengupdate Status...");
    try {
      const response = await criteriaService.toggleStatus(id);
      toast.success(response.data.message, { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error(error.respinse?.data?.message || "Gagal update status.", {
        id: toastId,
      });
    }
  };

  const toggleColumn = (key: string) => {
    setVisibleColumns((cols) =>
      cols.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <BreadCrumbs items={[{ label: "Criteria Management" }]} />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Criteria Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Kelola kriteria penilaian (SAW), bobot, dan atribut.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={includeDeleted ? "destructive" : "outline"}
            onClick={() => setIncludeDeleted(!includeDeleted)}
            className="gap-2"
          >
            <Archive size={16} />{" "}
            {includeDeleted ? "Hide Deleted" : "Show Deleted"}
          </Button>
          <Button
            onClick={() => {
              setCriteriaToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} /> Add Criteria
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-2 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-80 group">
            <Input
              placeholder="Cari kode atau nama kriteria..."
              className="pl-10 bg-white border-slate-200"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination({ ...pagination, current_page: 1 });
              }}
              startIcon={
                <Search
                  className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
              }
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Rows:</span>
            <select
              className="h-9 reounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs px-2 focus-ring-2 focus:ring-blue-500 outline-none cursor-pointer"
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
            <ColumnToggle columns={visibleColumns} onChange={toggleColumn} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 uppercase text-[11px] tracking-wider font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                {visibleColumns.find((c) => c.key === "info")?.visible && (
                  <th className="px-6 py-4">Criteria Info</th>
                )}
                {visibleColumns.find((c) => c.key === "weight")?.visible && (
                  <th className="px-6 py-4">Weight</th>
                )}
                {visibleColumns.find((c) => c.key === "type")?.visible && (
                  <th className="px-6 py-4">Type</th>
                )}
                {visibleColumns.find((c) => c.key === "status")?.visible && (
                  <th className="px-6 py-4">Status</th>
                )}
                {visibleColumns.find((c) => c.key === "action")?.visible && (
                  <th className="px-6 py-4">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-slate-500"
                  >
                    <Loader2 className="animate-spin h-6 w-6 mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : criterias.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-20 text-center text-slate-500"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                criterias.map((item) => (
                  <tr
                    key={item.id}
                    className={`group transition-colors ${item.is_deleted ? "bg-red-50/50" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
                  >
                    {visibleColumns.find((c) => c.key === "info")?.visible && (
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100 shrink-0">
                            {item.code}
                          </div>
                          <div>
                            <span
                              className={`block font-semibold text-slate-900 dark:text-white ${item.is_deleted ? "text-red-600 line-through" : ""}`}
                            >
                              {item.name}
                            </span>
                            <span
                              className="block text-xs text-slate-500 mt-0.5 truncate max-w-62.5"
                              title={item.description}
                            >
                              {item.description || "-"}
                            </span>
                          </div>
                        </div>
                      </td>
                    )}

                    {visibleColumns.find((c) => c.key === "weight")
                      ?.visible && (
                      <td className="px-6 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                            <Percent size={14} />
                          </div>
                          <span className="font-semibold text-slate-700">
                            {item.weight}%
                          </span>
                        </div>
                      </td>
                    )}

                    {visibleColumns.find((c) => c.key === "type")?.visible && (
                      <td className="px-6 py-4 align-top">
                        {item.type === "benefit" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-slate-200">
                            <ArrowUpCircle size={14} /> Benefit
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                            <ArrowDownCircle size={14} /> Cost
                          </span>
                        )}
                      </td>
                    )}

                    {visibleColumns.find((c) => c.key === "status")
                      ?.visible && (
                      <td className="px-6 py-4 align-top">
                        {item.is_deleted ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
                            Deleted
                          </span>
                        ) : item.is_active ? (
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

                    {visibleColumns.find((c) => c.key === "action")
                      ?.visible && (
                      <td className="px-6 py-4 text-right align-top">
                        <CriteriaActionMenu
                          criteria={item}
                          onEdit={() => {
                            setCriteriaToEdit(item);
                            setIsModalOpen(true);
                          }}
                          onDelete={() => confirmDelete(item.id)}
                          onRestore={() => handleResotre(item.id)}
                          onToggle={() => handleToggle(item.id)}
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
        <div className="px-4 py-2 border-t border-slate-200 flex justify-between items-center bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing {criterias.length} of {pagination.total} data
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-white"
              disabled={pagination.current_page === 1}
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  current_page: p.current_page - 1,
                }))
              }
            >
              <ChevronLeft size={12} className="mr-1" /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-white"
              disabled={pagination.current_page === pagination.last_page}
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  current_page: p.current_page + 1,
                }))
              }
            >
              Next <ChevronRight size={12} className="mr-1" />
            </Button>
          </div>
        </div>
      </div>
      <CriteriaModal
        isOpen={isMoadlOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchData()}
        criteriaToEdit={criteriaToEdit}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Hapus Kriteria?"
        description="Tindakan ini tidak dapat dibatalkan. Kriteria yang dihapus akan masuk ke arsip (soft delete)."
        confirmText="Ya, Hapus"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
