import { useEffect, useState, useRef } from "react";
import { applicantService } from "@/services/applicantService";
import {
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Cpu,
  Eye,
  FileCheck,
  Layers,
  Loader2,
  MoreHorizontal,
  Search,
  Star,
  User,
  XCircle,
  Mail,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ApplicantDetailModal from "./modal/ApplicantDetailModal";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import ScoringModal from "./modal/ScoringModal";
import { cn } from "@/lib/utils";

// --- ACTION MENU COMPONENT ---
function ApplicantActionMenu({
  applicant,
  onUpdateStatus,
  onScore,
  onViewDetail,
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
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-52 origin-top-right bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200",
            "z-[100]", // FIX: Memastikan menu melayang di atas baris lain
          )}
        >
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={() => {
                onViewDetail();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
            >
              <Eye size={14} className="text-blue-500" /> Detail & Dokumen
            </button>
            {applicant.status === "verified" && (
              <button
                onClick={() => {
                  onScore();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 rounded-lg transition-colors"
              >
                <Star size={14} className="text-orange-500" /> Input Nilai (SAW)
              </button>
            )}
            <div className="border-t border-slate-100 dark:border-slate-800 my-1.5"></div>
            <button
              onClick={() => {
                onUpdateStatus("accepted");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center gap-2 rounded-lg transition-colors"
            >
              <CheckCircle2 size={14} /> Terima Lamaran
            </button>
            <button
              onClick={() => {
                onUpdateStatus("rejected");
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded-lg transition-colors"
            >
              <XCircle size={14} /> Tolak Lamaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export default function ApplicantManagementPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
    null,
  );
  const [isScoringOpen, setIsScoringOpen] = useState(false);
  const [applicantToScore, setApplicantToScore] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

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
        status: statusFilter,
      };
      const response = await applicantService.getApplications(params);
      setApplicants(response.data.data || []);
      if (response.data.meta?.pagination)
        setPagination(response.data.meta.pagination);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    const toastId = toast.loading("Mengupdate status...");
    try {
      await applicantService.updateStatus(id, status);
      toast.success(`Status berhasil diubah menjadi ${status}.`, {
        id: toastId,
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal update status.", {
        id: toastId,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass =
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border";
    switch (status) {
      case "submitted":
        return (
          <span
            className={cn(
              baseClass,
              "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
            )}
          >
            <Clock size={12} /> Submitted
          </span>
        );
      case "accepted":
        return (
          <span
            className={cn(
              baseClass,
              "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
            )}
          >
            <CheckCircle2 size={12} /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span
            className={cn(
              baseClass,
              "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
            )}
          >
            <XCircle size={12} /> Rejected
          </span>
        );
      case "verified":
        return (
          <span
            className={cn(
              baseClass,
              "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
            )}
          >
            <FileCheck size={12} /> Verified
          </span>
        );
      case "scored":
        return (
          <span
            className={cn(
              baseClass,
              "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800",
            )}
          >
            <ClipboardCheck size={12} /> Scored
          </span>
        );
      case "calculated":
        return (
          <span
            className={cn(
              baseClass,
              "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800",
            )}
          >
            <Cpu size={12} /> Calculated
          </span>
        );
      default:
        return (
          <span
            className={cn(
              baseClass,
              "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
            )}
          >
            Pending
          </span>
        );
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

    // Pastikan path memiliki prefix /storage/ jika hanya berupa 'profiles/abc.jpg'
    let cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (!cleanPath.startsWith("/storage/")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-4 md:px-0 mt-4">
      <div>
        <BreadCrumbs items={[{ label: "Applicants Management" }]} />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Data Pendaftar
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Verifikasi berkas dan beri nilai untuk perhitungan SAW.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <Input
            placeholder="Cari pelamar atau program..."
            className="pl-11 h-12"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination({ ...pagination, current_page: 1 });
            }}
            startIcon={<Search className="text-slate-400" size={18} />}
          />
          <select
            className="h-11 w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm px-4 outline-none font-bold dark:text-slate-200"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua Status</option>
            {["pending", "verified", "scored", "accepted", "rejected"].map(
              (s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ),
            )}
          </select>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end px-2">
          <span className="text-[10px] font-black text-slate-400 uppercase">
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Memuat data pendaftar...
          </p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 font-medium italic text-slate-500">
          Belum ada pendaftar.
        </div>
      ) : (
        <>
          {/* MOBILE VIEW */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-5 gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border dark:border-slate-700 shrink-0">
                      {app.user?.profile?.profile_picture_url ? (
                        <img
                          src={getAvatarUrl(
                            app.user.profile.profile_picture_url,
                          )}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="text-slate-400" size={24} />
                      )}
                    </div>
                    {/* FIX: break-all agar nama panjang tidak menggeser action menu */}
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="font-black text-slate-900 dark:text-white text-base leading-tight break-all">
                        {app.user?.profile?.full_name || "Tanpa Nama"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase mt-1 break-all truncate">
                        {app.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 z-20">
                    <ApplicantActionMenu
                      applicant={app}
                      onUpdateStatus={(s: string) =>
                        handleUpdateStatus(app.id, s)
                      }
                      onViewDetail={() => {
                        setSelectedApplicantId(app.id);
                        setIsDetailOpen(true);
                      }}
                      onScore={() => {
                        setApplicantToScore(app);
                        setIsScoringOpen(true);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-3 border-t border-slate-50 dark:border-slate-800/50 pt-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      Program Magang
                    </span>
                    <p className="text-xs font-black dark:text-slate-200 flex items-center gap-1.5">
                      <Briefcase size={12} className="text-indigo-500" />{" "}
                      {app.program?.name}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Applied Date
                      </span>
                      <p className="text-[11px] font-bold dark:text-slate-300">
                        {new Date(app.created_at).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </span>
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950/50 uppercase text-[10px] tracking-widest font-black text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-5">Applicant</th>
                  <th className="px-6 py-5">Program</th>
                  <th className="px-6 py-5">Applied Date</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {applicants.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group relative"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border dark:border-slate-700">
                          {app.user?.profile?.profile_picture_url ? (
                            <img
                              src={app.user.profile.profile_picture_url}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                                (
                                  e.target as HTMLImageElement
                                ).parentElement!.innerHTML =
                                  '<div class="text-slate-400"><User size={18} /></div>';
                              }}
                            />
                          ) : (
                            <User className="text-slate-400" size={18} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {app.user?.profile?.full_name || "Tanpa Nama"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            {app.user?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-indigo-500" />
                        <span className="truncate max-w-[200px]">
                          {app.program?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                      {new Date(app.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(app.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <ApplicantActionMenu
                        applicant={app}
                        onUpdateStatus={(s: string) =>
                          handleUpdateStatus(app.id, s)
                        }
                        onViewDetail={() => {
                          setSelectedApplicantId(app.id);
                          setIsDetailOpen(true);
                        }}
                        onScore={() => {
                          setApplicantToScore(app);
                          setIsScoringOpen(true);
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

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          Page {pagination.current_page} of {pagination.last_page}{" "}
          <span className="h-1 w-1 rounded-full bg-slate-200" />{" "}
          {pagination.total} Applicants Total
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

      <ApplicantDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        applicationId={selectedApplicantId}
      />
      <ScoringModal
        isOpen={isScoringOpen}
        onClose={() => setIsScoringOpen(false)}
        applicant={applicantToScore}
        onSuccess={fetchData}
      />
    </div>
  );
}
