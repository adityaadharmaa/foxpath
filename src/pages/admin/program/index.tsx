import { useEffect, useRef, useState } from "react";
import { programService } from "@/services/programService";
import {
  Archive,
  Calculator,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Layers,
  Loader2,
  MoreHorizontal,
  PlayCircle,
  Plus,
  RefreshCcw,
  Search,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ProgramModal from "./modal/ProgramModal";
import ProgramDetailModal from "./modal/ProgramDetailModal";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import SAWResultModal from "./modal/SAWResultModal";
import { cn } from "@/lib/utils";

// --- ACTION MENU COMPONENT ---
function ProgramActionMenu({
  program,
  onEdit,
  onDelete,
  onRestore,
  onToggle,
  onViewDetail,
  onCalculateSaw,
  onViewSAWResult,
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
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-all active:scale-90"
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-52 origin-top-right bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 focus:outline-none animate-in fade-in zoom-in-95 duration-200",
            // FIX: Menggunakan z-index sangat tinggi agar tidak tertutup baris tabel lain
            "z-[100]",
          )}
        >
          <div className="p-1.5 space-y-0.5">
            {!program.is_deleted ? (
              <>
                <button
                  onClick={() => {
                    onViewDetail();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg"
                >
                  <Eye size={14} className="text-purple-500" /> Detail & Pelamar
                </button>
                {program.is_active && (
                  <button
                    onClick={() => {
                      onCalculateSaw();
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg"
                  >
                    <Calculator size={14} className="text-orange-500" /> Hitung
                    Ranking
                  </button>
                )}
                <button
                  onClick={() => {
                    onViewSAWResult();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg"
                >
                  <Trophy size={14} className="text-blue-500" /> Hasil SAW
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onEdit();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg"
                >
                  <Edit size={14} className="text-blue-500" /> Edit Program
                </button>
                <button
                  onClick={() => {
                    onToggle();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg"
                >
                  {program.is_active ? (
                    <ToggleRight size={14} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={14} className="text-slate-400" />
                  )}
                  {program.is_active ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    onDelete();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg"
                >
                  <Trash2 size={14} /> Hapus Program
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onRestore();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2 rounded-lg"
              >
                <RefreshCcw size={14} /> Restore Program
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function ProgramManagementPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    total_programs: 0,
    active_programs: 0,
    total_applications: 0,
  });
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(
    null,
  );
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<any>(null);
  const [isSAWModalOpen, setIsSAWModalOpen] = useState(false);
  const [programForSAW, setProgramForSAW] = useState<any>(null);

  useEffect(() => {
    fetchData();
    fetchSummary();
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
      const response = await programService.getPrograms(params);
      setPrograms(response.data.data || []);
      if (response.data.meta?.pagination)
        setPagination(response.data.meta.pagination);
    } catch (error) {
      setPrograms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await programService.getSummary();
      if (res.data?.data) setSummary(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id: number) => setDeleteId(id);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await programService.deleteProgram(deleteId);
      toast.success("Program berhasil diarsipkan");
      fetchData();
      fetchSummary();
      setDeleteId(null);
    } catch (error: any) {
      toast.error("Gagal menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCalculateSAW = async (programId: number) => {
    const toastId = toast.loading("Sedang menghitung SAW...");
    try {
      const res = await programService.calculateSAW(programId);
      toast.success(res.data.message, { id: toastId });
    } catch (error: any) {
      toast.error("Gagal menghitung.", { id: toastId });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 mt-4 px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <BreadCrumbs items={[{ label: "Program Management" }]} />
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Program Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-sm">
            Manajemen pendaftaran dan seleksi magang.
          </p>
        </div>
        <Button
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg rounded-2xl h-12 px-8 font-bold"
          onClick={() => {
            setProgramToEdit(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} /> Tambah Program
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Program"
          value={summary.total_programs}
          icon={<Layers className="text-blue-500" />}
        />
        <StatCard
          title="Aktif"
          value={summary.active_programs}
          icon={<CheckCircle className="text-emerald-500" />}
          indicator="bg-emerald-500"
        />
        <StatCard
          title="Total Pelamar"
          value={summary.total_applications}
          icon={<Users className="text-purple-500" />}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80 group">
          <Input
            placeholder="Cari nama program..."
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
          <Button
            variant={includeDeleted ? "destructive" : "outline"}
            onClick={() => setIncludeDeleted(!includeDeleted)}
            className="h-10 rounded-xl gap-2 font-bold text-xs"
          >
            <Archive size={14} />{" "}
            {includeDeleted ? "Sembunyikan Arsip" : "Lihat Arsip"}
          </Button>
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Sinkronisasi Data...
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {programs.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "bg-white dark:bg-slate-900 p-5 rounded-3xl border shadow-sm relative",
                  p.is_deleted
                    ? "border-red-200 opacity-80"
                    : "border-slate-200 dark:border-slate-800",
                )}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "font-black text-slate-900 dark:text-white text-base leading-tight",
                        p.is_deleted && "line-through text-slate-400",
                      )}
                    >
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "text-[9px] font-black uppercase rounded-lg border-none px-2 h-5",
                          p.is_active ? "bg-emerald-500" : "bg-slate-500",
                        )}
                      >
                        {p.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {p.is_deleted && (
                        <Badge className="text-[9px] font-black uppercase bg-red-500 border-none h-5 px-2">
                          Archived
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Action Menu diperbaiki posisinya */}
                  <div className="z-20">
                    <ProgramActionMenu
                      program={p}
                      onDelete={() => confirmDelete(p.id)}
                      onViewDetail={() => {
                        setSelectedProgramId(p.id);
                        setIsDetailOpen(true);
                      }}
                      onCalculateSaw={() => handleCalculateSAW(p.id)}
                      onViewSAWResult={() => {
                        setProgramForSAW(p);
                        setIsSAWModalOpen(true);
                      }}
                      onRestore={() =>
                        programService
                          .restoreProgram(p.id)
                          .then(() => fetchData())
                      }
                      onToggle={() =>
                        programService
                          .toggleStatus(p.id)
                          .then(() => fetchData())
                      }
                      onEdit={() => {
                        setProgramToEdit(p);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      Kapasitas
                    </p>
                    <p className="text-xs font-black dark:text-slate-200 flex items-center gap-1">
                      <Users size={12} className="text-blue-500" /> {p.capacity}{" "}
                      Slots
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">
                      Pelamar
                    </p>
                    <p className="text-xs font-black dark:text-slate-200 flex items-center gap-1">
                      <Layers size={12} className="text-purple-500" />{" "}
                      {p.applications_count} Orang
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          {/* FIX: Menghapus overflow-hidden dari container table agar dropdown tidak terpotong */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <table className="w-full text-left text-sm table-auto">
              <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[10px] tracking-widest font-black text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5">Program Identity</th>
                  <th className="px-6 py-5">Registration Date</th>
                  <th className="px-6 py-5 text-center">Usage</th>
                  <th className="px-6 py-5">Cohort</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {programs.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group relative"
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <p
                        className={cn(
                          "font-bold text-slate-900 dark:text-white truncate",
                          p.is_deleted && "line-through text-slate-400",
                        )}
                      >
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase truncate">
                        {p.description || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-[11px] font-bold">
                        <p className="flex items-center gap-2">
                          <span className="text-slate-400 w-8">IN:</span>{" "}
                          <span className="text-slate-700 dark:text-slate-300">
                            {new Date(
                              p.registration_starts_at,
                            ).toLocaleDateString()}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="text-slate-400 w-8">OUT:</span>{" "}
                          <span className="text-red-500">
                            {new Date(
                              p.registration_ends_at,
                            ).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant="outline"
                          className="px-2 py-0.5 font-black text-[10px] dark:text-slate-300"
                        >
                          {p.capacity} Slots
                        </Badge>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          {p.applications_count} Applied
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-xs font-bold dark:text-slate-100">
                        <PlayCircle size={14} className="text-indigo-500" />
                        {p.cohort_starts_at
                          ? new Date(p.cohort_starts_at).toLocaleDateString(
                              "id-ID",
                              { month: "short", year: "numeric" },
                            )
                          : "-"}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 ml-5 uppercase tracking-tighter">
                        {p.placement_duration_months} Bulan
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge
                        className={cn(
                          "uppercase text-[9px] font-black rounded-lg border-none px-3",
                          p.is_deleted
                            ? "bg-red-500"
                            : p.is_active
                              ? "bg-emerald-500"
                              : "bg-slate-400",
                        )}
                      >
                        {p.is_deleted
                          ? "Archived"
                          : p.is_active
                            ? "Active"
                            : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProgramActionMenu
                        program={p}
                        onDelete={() => confirmDelete(p.id)}
                        onViewDetail={() => {
                          setSelectedProgramId(p.id);
                          setIsDetailOpen(true);
                        }}
                        onCalculateSaw={() => handleCalculateSAW(p.id)}
                        onViewSAWResult={() => {
                          setProgramForSAW(p);
                          setIsSAWModalOpen(true);
                        }}
                        onRestore={() =>
                          programService
                            .restoreProgram(p.id)
                            .then(() => fetchData())
                        }
                        onToggle={() =>
                          programService
                            .toggleStatus(p.id)
                            .then(() => fetchData())
                        }
                        onEdit={() => {
                          setProgramToEdit(p);
                          setIsModalOpen(true);
                        }}
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
          <span className="h-1 w-1 rounded-full bg-slate-200" />{" "}
          {pagination.total} Programs Total
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none h-11 rounded-xl"
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
            className="flex-1 sm:flex-none h-11 rounded-xl"
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
        title="Arsipkan Program?"
        description="Program yang diarsipkan tidak akan muncul di sisi pelamar."
        confirmText="Ya, Arsipkan"
        variant="danger"
        isLoading={isDeleting}
      />
      <ProgramModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchData();
          fetchSummary();
        }}
        programToEdit={programToEdit}
      />
      <ProgramDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        programId={selectedProgramId}
      />
      <SAWResultModal
        isOpen={isSAWModalOpen}
        onClose={() => setIsSAWModalOpen(false)}
        program={programForSAW}
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
