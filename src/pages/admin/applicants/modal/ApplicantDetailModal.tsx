import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { applicantService } from "@/services/applicantService";
import {
  Loader2,
  X,
  User,
  MapPin,
  Phone,
  GraduationCap,
  FileText,
  Download,
  Calendar,
  ExternalLink,
  Trophy,
  Star,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ApplicantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
}

const getScoreColor = (val: number) => {
  if (val >= 85)
    return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20";
  if (val >= 70)
    return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20";
  if (val >= 50)
    return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20";
  return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20";
};

export default function ApplicantDetailModal({
  isOpen,
  onClose,
  applicationId,
}: ApplicantDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isRejected = data?.status === "rejected";
  const isAccepted = data?.status === "accepted";
  const isApplicationEditable = data?.status === "submitted";

  // FIX: Menggunakan VITE_STORAGE_URL dari .env Anda
  const getFileUrl = (path: string) => {
    if (!path) return null;

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchDetail();
    } else {
      setData(null);
    }
  }, [isOpen, applicationId]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const response = await applicantService.getApplicationDetail(
        applicationId!,
      );
      setData(response.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memuat data.");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewDocument = async (
    docId: number,
    status: "approved" | "rejected",
  ) => {
    let note = null;
    if (status === "rejected") {
      note = prompt("Masukkan alasan penolakan dokumen ini (opsional):");
      if (note === null) return;
    }

    const toastId = toast.loading("Mengupdate status dokumen...");
    try {
      await applicantService.reviewDocument(docId, status, note || undefined);
      toast.success(`Dokumen ditandai sebagai ${status}`, { id: toastId });
      fetchDetail();
    } catch (error: any) {
      toast.error("Gagal mereview document.", { id: toastId });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] mx-auto">
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Detail Pelamar
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
              Informasi Berkas & Hasil Seleksi
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-all active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="overflow-y-auto p-4 md:p-8 bg-slate-50/30 dark:bg-slate-950/20 flex-1 custom-scrollbar">
          {isLoading || !data ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 h-10 w-10 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                Sinkronisasi Data...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* KOLOM KIRI: Profil & SAW */}
              <div className="lg:col-span-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                  <div className="h-24 w-24 rounded-2xl bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden mx-auto mb-4">
                    {data.user?.profile?.profile_picture_url ? (
                      <img
                        src={getFileUrl(data.user.profile.profile_picture_url)}
                        alt={data.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-full h-full p-4 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight break-all uppercase">
                    {data.user?.profile?.full_name || "Tanpa Nama"}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1 break-all">
                    {data.user?.email}
                  </p>

                  <Badge
                    variant="outline"
                    className="mt-4 px-4 py-1 font-black uppercase tracking-widest text-[9px] dark:border-slate-700 dark:text-slate-300"
                  >
                    Status: {data.status}
                  </Badge>

                  <div className="grid grid-cols-1 gap-3 mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 text-left">
                    <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                      <Phone size={14} className="text-blue-500" />
                      <span className="text-xs font-bold">
                        {data.user?.profile?.phone || "-"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                      <MapPin
                        size={14}
                        className="text-red-500 mt-0.5 shrink-0"
                      />
                      <span className="text-xs font-medium leading-relaxed">
                        {data.user?.profile?.address ||
                          "Alamat tidak tersedia."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SAW Result Card */}
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 h-24 w-24 bg-white/10 rounded-full blur-2xl"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 mb-6 opacity-80">
                    <Trophy size={14} /> Hasil Akhir Seleksi
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase opacity-70">
                        Peringkat
                      </p>
                      <p className="text-3xl font-black">#{data.rank || "-"}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black uppercase opacity-70">
                        Skor SAW
                      </p>
                      <p className="text-3xl font-black">
                        {data.final_score
                          ? Number(data.final_score).toFixed(4)
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pendidikan */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                    <GraduationCap size={14} className="text-blue-500" />{" "}
                    Riwayat Pendidikan
                  </h4>
                  {data.user?.profile_education ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-500 mb-1">
                          Institusi
                        </p>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                          {data.user.profile_education.institution_name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-1">
                            IPK / Rata-rata
                          </p>
                          <Badge
                            variant="secondary"
                            className="font-black text-blue-600 dark:text-blue-400"
                          >
                            {data.user.profile_education.gpa ||
                              data.user.profile_education.average_score ||
                              "-"}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-500 mb-1">
                            Jurusan
                          </p>
                          <p className="text-xs font-bold">
                            {data.user.profile_education.major || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-slate-400 italic">
                      Informasi pendidikan belum diisi.
                    </p>
                  )}
                </div>
              </div>

              {/* KOLOM KANAN: Program & Dokumen */}
              <div className="lg:col-span-8 space-y-6">
                {/* Info Program */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <Badge className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300 font-black h-6 px-3 border-none">
                        PROGRAM PILIHAN
                      </Badge>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                        {data.program?.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-black uppercase dark:border-slate-700"
                    >
                      Quota: {data.program?.capacity || "∞"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Melamar Pada
                      </p>
                      <p className="text-xs font-bold">
                        {formatDate(data.submitted_at)}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Status SAW
                      </p>
                      <p className="text-xs font-bold text-blue-600">
                        {data.final_score ? "Terkalkulasi" : "Menunggu Dinilai"}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "p-4 rounded-2xl border",
                        isRejected
                          ? "bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800",
                      )}
                    >
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {isRejected ? "Ditolak Pada" : "Diterima Pada"}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-bold",
                          isRejected && "text-red-600",
                        )}
                      >
                        {formatDate(
                          isRejected ? data.decided_at : data.admitted_at,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dokumen Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 ml-1">
                    <FileText size={14} className="text-orange-500" /> Dokumen
                    Administrasi
                  </h4>
                  {data.documents && data.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.documents.map((doc: any, idx: number) => (
                        <div
                          key={idx}
                          className={cn(
                            "p-5 bg-white dark:bg-slate-900 border-2 rounded-[1.8rem] transition-all relative overflow-hidden",
                            doc.status === "approved"
                              ? "border-emerald-500/20 bg-emerald-500/5"
                              : doc.status === "rejected"
                                ? "border-red-500/20 bg-red-500/5"
                                : "border-slate-200 dark:border-slate-800",
                          )}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                                <FileText size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-xs uppercase tracking-tight text-slate-900 dark:text-white truncate">
                                  {doc.type.replace(/_/g, " ")}
                                </p>
                                <Badge
                                  className={cn(
                                    "mt-1 text-[8px] font-black uppercase px-2 h-5 border-none",
                                    doc.status === "approved"
                                      ? "bg-emerald-500"
                                      : doc.status === "rejected"
                                        ? "bg-red-500"
                                        : "bg-amber-500",
                                  )}
                                >
                                  {doc.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <a
                                href={getFileUrl(doc.file_path)}
                                target="_blank"
                                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-all active:scale-90"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <a
                                href={getFileUrl(doc.file_path)}
                                download
                                className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 transition-all active:scale-90"
                              >
                                <Download size={16} />
                              </a>
                            </div>
                          </div>

                          {isApplicationEditable && doc.status === "pending" ? (
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              <Button
                                onClick={() =>
                                  handleReviewDocument(doc.id, "approved")
                                }
                                variant="outline"
                                className="h-9 rounded-xl text-[10px] font-bold uppercase border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:bg-transparent dark:hover:bg-emerald-900/20"
                              >
                                <CheckCircle2 size={14} className="mr-1" />{" "}
                                Approve
                              </Button>
                              <Button
                                onClick={() =>
                                  handleReviewDocument(doc.id, "rejected")
                                }
                                variant="outline"
                                className="h-9 rounded-xl text-[10px] font-bold uppercase border-red-500 text-red-600 hover:bg-red-50 dark:bg-transparent dark:hover:bg-red-900/20"
                              >
                                <XCircle size={14} className="mr-1" /> Reject
                              </Button>
                            </div>
                          ) : (
                            doc.review_note && (
                              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                <p className="text-[10px] text-red-600 font-bold italic line-clamp-2">
                                  " {doc.review_note} "
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                      <p className="text-slate-400 font-bold uppercase text-[10px]">
                        Dokumen Kosong
                      </p>
                    </div>
                  )}
                </div>

                {/* Skor Kriteria SAW */}
                {data.scores && data.scores.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-6">
                      <Award size={14} className="text-purple-500" /> Evaluasi
                      Kriteria
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.scores.map((score: any) => (
                        <div
                          key={score.id}
                          className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-[9px] font-black uppercase text-slate-500">
                              {score.criteria?.name}
                            </p>
                            <p className="text-[8px] font-bold text-slate-400">
                              Weight: {score.criteria?.weight * 100}%
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-black h-8 w-10 justify-center text-xs border-2",
                              getScoreColor(score.value),
                            )}
                          >
                            {score.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <Button
            onClick={onClose}
            className="w-full sm:w-auto h-12 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-xl"
          >
            Tutup Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
