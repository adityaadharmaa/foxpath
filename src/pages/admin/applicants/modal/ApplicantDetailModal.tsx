import { useEffect, useState } from "react";
// Pastikan komponen UI Anda support Dialog/Modal, sesuaikan import jika perlu
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

interface ApplicantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: number | null;
}

const getScoreColor = (val: number) => {
  if (val >= 85) return "text-green-600 bg-green-50 border-green-200";
  if (val >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
  if (val >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-red-600 bg-red-50 border-red-200";
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

  const getFileUrl = (path: string) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    return `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/storage/${path}`;
  };

  // Helper format tanggal
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

  // Helper format tanggal pendek (untuk placement)
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
      console.error(error);
      toast.error("Gagal mereview document.", { id: toastId });
    }
  };

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const response = await applicantService.getApplicationDetail(
        applicationId!,
      );
      toast.success(response.data?.message);
      setData(response.data.data);
    } catch (error: any) {
      const msg = error.response?.data?.message;
      console.error(msg);
      toast.error(msg);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] mx-4">
        {/* HEADER */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Detail Pelamar
            </h2>
            <p className="text-xs text-slate-500">
              Informasi lengkap, hasil seleksi, dan dokumen.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* CONTENT SCROLLABLE */}
        <div className="overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 flex-1">
          {isLoading || !data ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="animate-spin text-blue-500 h-10 w-10 mb-2" />
              <p className="text-slate-500 text-sm">Memuat data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* --- KOLOM KIRI (Profile, Education, SAW Result) --- */}
              <div className="lg:col-span-1 space-y-6">
                {/* 1. Kartu Profile */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden mb-3">
                      {data.user?.profile?.profile_picture ? (
                        <img
                          src={getFileUrl(data.user.profile.profile_picture)}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User size={40} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {data.user?.profile?.full_name || "Tanpa Nama"}
                    </h3>
                    <p className="text-sm text-slate-500">{data.user?.email}</p>

                    <div className="mt-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          data.status === "accepted"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : data.status === "rejected"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : data.status === "scored"
                                ? "bg-violet-100 text-violet-700 border-violet-200"
                                : data.status === "calculated"
                                  ? "bg-sky-100 text-sky-700 border-sky-200"
                                  : data.status === "verified"
                                    ? "bg-blue-100 text-blue-700 border-blue-500"
                                    : "bg-orange-100 text-orange-700 border-orange-200"
                        }`}
                      >
                        {data.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm border-t border-slate-100 dark:border-slate-800 pt-4 mt-4">
                    <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                      <Phone
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-500"
                      />
                      <span>{data.user?.profile?.phone || "-"}</span>
                    </div>
                    <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-red-500"
                      />
                      <span className="line-clamp-2">
                        {data.user?.profile?.address || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Hasil Seleksi (SAW) - NEW! */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-yellow-100 to-transparent rounded-bl-full -mr-2 -mt-2"></div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 relative z-10">
                    <Trophy size={18} className="text-yellow-500" /> Hasil
                    Seleksi (SAW)
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                        Rank
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          #{data.rank || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg text-center">
                      <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                        Final Score
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {data.final_score
                            ? Number(data.final_score).toFixed(4)
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Assessment Date:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(data.scored_at)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Decision Date:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {formatDate(data.decided_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Pendidikan */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <GraduationCap size={18} className="text-blue-500" />{" "}
                    Pendidikan
                  </h4>
                  {data.user?.profile_education ? (
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">
                          Institusi
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {data.user.profile_education.institution_name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            Jurusan
                          </p>
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {data.user.profile_education.major}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            IPK / Nilai
                          </p>
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">
                            {data.user.profile_education.gpa ||
                              data.user.profile_education.average_score ||
                              "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">
                      Data pendidikan belum lengkap.
                    </p>
                  )}
                </div>
              </div>

              {/* --- KOLOM KANAN (Program, Documents, Placement Info) --- */}
              <div className="lg:col-span-2 space-y-6">
                {/* 4. Info Program & Placement Info */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar size={18} className="text-indigo-500" />{" "}
                      Informasi Program
                    </h4>
                    <span className="text-xs text-slate-500">
                      ID: #{data.id}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                        {data.program?.name}
                      </h3>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600">
                        Kuota: <b>{data.program?.capacity || "-"}</b>
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                      {data.program?.description}
                    </p>

                    {/* Timeline Pelamaran */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 mb-1">
                          Tanggal Melamar
                        </p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {formatDate(data.submitted_at)}
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                        <p className="text-xs text-slate-500 mb-1">
                          Verifikasi Admin
                        </p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {formatDate(data.verified_at)}
                        </p>
                      </div>

                      {/* LOGIC STATUS: Diterima vs Ditolak */}
                      <div
                        className={`p-3 rounded-lg border ${
                          isRejected
                            ? "bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800"
                            : "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700"
                        }`}
                      >
                        <p
                          className={`text-xs mb-1 ${isRejected ? "text-red-600" : "text-slate-500"}`}
                        >
                          {isRejected ? "Ditolak Pada" : "Diterima Pada"}
                        </p>
                        <p
                          className={`text-sm font-semibold ${isRejected ? "text-red-700" : "text-slate-800 dark:text-slate-200"}`}
                        >
                          {/* Jika Rejected ambil decided_at, Jika Accepted ambil admitted_at */}
                          {formatDate(
                            isRejected ? data.decided_at : data.admitted_at,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* ALERT PENOLAKAN (Khusus Rejected) */}
                    {isRejected && (
                      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 flex gap-3">
                        <XCircle
                          className="text-red-500 shrink-0 mt-0.5"
                          size={20}
                        />
                        <div className="text-sm text-red-800 dark:text-red-300">
                          <p className="font-bold mb-1">
                            Hasil Seleksi: Tidak Lolos
                          </p>
                          <p>
                            Mohon maaf, peringkat akhir Anda adalah{" "}
                            <strong>#{data.rank}</strong>. Program ini hanya
                            menerima <strong>{data.program?.capacity}</strong>{" "}
                            kandidat terbaik sesuai kuota yang tersedia.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Placement Info (HANYA MUNCUL JIKA ACCEPTED) */}
                    {isAccepted &&
                      (data.placement_start_at || data.placement_end_at) && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
                          <h5 className="font-semibold text-indigo-800 dark:text-indigo-300 text-sm mb-3 flex items-center gap-2">
                            <Clock size={16} /> Jadwal Penempatan Magang
                          </h5>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex-1">
                              <span className="block text-xs text-indigo-600/70 dark:text-indigo-400/70 uppercase font-bold">
                                Mulai
                              </span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {formatDateShort(data.placement_start_at)}
                              </span>
                            </div>
                            <div className="text-indigo-300">➜</div>
                            <div className="flex-1">
                              <span className="block text-xs text-indigo-600/70 dark:text-indigo-400/70 uppercase font-bold">
                                Selesai
                              </span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {formatDateShort(data.placement_end_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                {/* 5. Dokumen */}
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-orange-500" /> Dokumen
                    Pendukung
                  </h4>

                  {data.documents && data.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {data.documents.map((doc: any, idx: number) => (
                        <div
                          key={idx}
                          className={`group p-4 bg-white dark:bg-slate-900 border rounded-xl transition-all shadow-sm ${
                            doc.status === "approved"
                              ? "border-green-200 bg-green-50/30" // Ganti 'valid' -> 'approved'
                              : doc.status === "rejected"
                                ? "border-red-200 bg-red-50/30" // Ganti 'invalid' -> 'rejected'
                                : "border-slate-200 hover:border-blue-300"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                                <FileText size={20} />
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200 capitalize">
                                  {doc.type
                                    ? doc.type.replace(/_/g, " ")
                                    : "Dokumen"}
                                </p>

                                {/* Status Badge */}
                                <div className="flex items-center gap-1 mt-0.5">
                                  {doc.status === "approved" && (
                                    <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                      <CheckCircle2 size={10} /> APPROVED
                                    </span>
                                  )}
                                  {doc.status === "rejected" && (
                                    <span className="text-[10px] font-bold text-red-600 flex items-center gap-1">
                                      <XCircle size={10} /> REJECTED
                                    </span>
                                  )}
                                  {(!doc.status ||
                                    doc.status === "pending") && (
                                    <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                                      <AlertCircle size={10} /> PENDING
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons Row */}
                          <div className="flex flex-col gap-2">
                            {/* View & Download */}
                            <div className="flex gap-2">
                              <a
                                href={getFileUrl(doc.file_path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex justify-center items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
                              >
                                <ExternalLink size={12} /> Lihat
                              </a>
                              <a
                                href={getFileUrl(doc.file_path)}
                                download
                                className="flex-1 inline-flex justify-center items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-medium transition-colors"
                              >
                                <Download size={12} /> Unduh
                              </a>
                            </div>

                            {/* Review Actions (Hanya muncul jika belum final atau mau diubah) */}
                            {isApplicationEditable &&
                            doc.status === "pending" ? (
                              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <button
                                  // PERBAIKAN: Kirim string 'approved'
                                  onClick={() =>
                                    handleReviewDocument(doc.id, "approved")
                                  }
                                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
                                    doc.status === "approved"
                                      ? "bg-green-600 text-white shadow-sm"
                                      : "bg-white border border-slate-200 text-slate-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                  }`}
                                >
                                  <CheckCircle2 size={14} /> Approve
                                </button>

                                <button
                                  // PERBAIKAN: Kirim string 'rejected'
                                  onClick={() =>
                                    handleReviewDocument(doc.id, "rejected")
                                  }
                                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-bold transition-colors ${
                                    doc.status === "rejected"
                                      ? "bg-red-600 text-white shadow-sm"
                                      : "bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                  }`}
                                >
                                  <XCircle size={14} /> Reject
                                </button>
                              </div>
                            ) : (
                              // Bagian status readonly
                              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                                {doc.status === "pending" ? (
                                  <span className="text-[10px] text-slate-400 italic">
                                    Menunggu (Aplikasi {data?.status})
                                  </span>
                                ) : (
                                  <span
                                    className={`text-[10px] font-bold italic ${doc.status === "approved" ? "text-green-600" : "text-red-600"}`}
                                  >
                                    {doc.status === "approved"
                                      ? "Dokumen Disetujui"
                                      : "Dokumen Ditolak"}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Tampilkan Review Note jika ada */}
                          {doc.review_note && (
                            <div className="mt-2 text-[10px] text-red-500 bg-red-50 p-2 rounded border border-red-100 italic">
                              Note: "{doc.review_note}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                      <p className="text-slate-400 text-sm">
                        Tidak ada dokumen yang dilampirkan.
                      </p>
                    </div>
                  )}
                </div>
                {data.scores && data.scores.length > 0 ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Award
                        className="flex items-center gap-2 mb-3"
                        size={20}
                      />
                      <h3 className="font-bold text-slate-800">
                        Hasil Penilaian (SAW)
                      </h3>
                    </div>
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {data.scores.map((score: any) => (
                          <div
                            key={score.id}
                            className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col justify-between"
                          >
                            <div>
                              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                                {score.criteria?.name || "Kriteria"}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Bobot: {score.criteria?.weight * 100}%
                              </p>
                            </div>
                            <div className="mt-3 flex justify-between items-end">
                              <span
                                className={`text-sm font-bold px-2 py-1 rounded-md border ${getScoreColor(score.value)}`}
                              >
                                {score.value}
                              </span>
                              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {score.criteria?.type === "benefit"
                                  ? "Benefit"
                                  : "Cost"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {data.final_score && (
                        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                          <div className="flex gap-2 items-center text-slate-600">
                            <TrendingUp size={18} />
                            <span className="text-sm font-medium">
                              Nilai Akhir (SAW) :
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-purple-700">
                            {Number(data.final_score).toFixed(4)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 p-6 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <Award className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      Belum ada data penilaian.
                    </p>
                    <p className="text-xs">
                      Silakan input nilai wawancara terlebih dahulu.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
          <Button onClick={onClose} variant="outline" className="min-w-25">
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
