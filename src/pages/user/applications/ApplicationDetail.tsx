import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  UploadCloud,
  XCircle,
  Clock,
  Download,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { applicationService } from "@/services/applicationService";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- HELPER UNTUK URL FILE ---
const getFileLink = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;

  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  const storageUrl =
    import.meta.env.VITE_STORAGE_URL || "http://localhost:8000/storage";

  return `${storageUrl}/${cleanPath}`;
};

const TIMELINE_STEPS = [
  { id: "submitted", label: "Dikirim" },
  { id: "verified", label: "Verifikasi" },
  { id: "scored", label: "Dinilai" },
  { id: "decision", label: "Keputusan" },
];

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await applicationService.getApplicationDetails(
        Number(id),
      );
      setApp(response.data?.data || response.data);
    } catch (error) {
      toast.error("Gagal memuat detail lamaran.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (docType: "cv" | "transcript") => {
    const file = docType === "cv" ? cvFile : transcriptFile;
    if (!file) {
      toast.error("Pilih file terlebih dahulu.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("type", docType);
    formData.append("file", file);

    try {
      await applicationService.uploadDocument(Number(id), formData);
      toast.success(`Berhasil mengunggah ${docType.toUpperCase()}`);
      fetchDetail();
      if (docType === "cv") setCvFile(null);
      else setTranscriptFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mengunggah dokumen.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );

  if (!app)
    return (
      <div className="text-center py-20 dark:text-white font-bold">
        Data tidak ditemukan.
      </div>
    );

  const cvDoc = app.documents?.find((d: any) => d.type === "cv");
  const transcriptDoc = app.documents?.find(
    (d: any) => d.type === "transcript",
  );
  const isDocsComplete = cvDoc && transcriptDoc;
  const isLocked = app.status !== "submitted";

  const getActiveIndex = () => {
    const s = app.status;
    if (s === "submitted") return 0;
    if (s === "verified") return 1;
    if (s === "scored" || s === "calculated") return 2;
    if (s === "accepted" || s === "rejected") return 3;
    return 0;
  };
  const activeIndex = getActiveIndex();

  const getStepDescription = (stepId: string) => {
    if (stepId === "submitted") return "Lamaran diterima.";
    if (stepId === "verified")
      return activeIndex >= 1 && app.status !== "submitted"
        ? "Berkas valid."
        : "Menunggu verifikasi.";
    if (stepId === "scored")
      return activeIndex >= 2 ? "Penilaian selesai." : "Proses seleksi.";
    if (stepId === "decision")
      return app.status === "accepted"
        ? "Lolos Seleksi."
        : app.status === "rejected"
          ? "Belum Lolos."
          : "Keputusan Akhir.";
    return "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 px-4 md:px-0 mt-4">
      {/* HEADER */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="w-fit pl-0 text-slate-500 dark:hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>

        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {app.program?.name}
                </h1>
                <Badge
                  variant={
                    app.status === "accepted"
                      ? "success"
                      : app.status === "rejected"
                        ? "destructive"
                        : "info"
                  }
                  className="uppercase font-black px-3"
                >
                  {app.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Building2 size={14} className="text-blue-500" /> Foxbyte
                  Global
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {app.program?.placement_duration_months}{" "}
                  Bulan
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />{" "}
                  {new Date(app.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* TIMELINE */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6 md:p-8">
            <CardTitle className="text-lg font-black mb-8 dark:text-white">
              Status Seleksi
            </CardTitle>
            <div className="relative flex justify-between">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0"></div>
              {TIMELINE_STEPS.map((step, index) => {
                const isCompleted =
                  index < activeIndex || app.status === "accepted";
                const isCurrent =
                  index === activeIndex &&
                  !["accepted", "rejected"].includes(app.status);
                const isFailed = index === 3 && app.status === "rejected";

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex flex-col items-center w-full"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900 transition-all",
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                            ? "bg-blue-600 text-white ring-4 ring-blue-50 dark:ring-blue-900/20"
                            : isFailed
                              ? "bg-red-500 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-400",
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} />
                      ) : isFailed ? (
                        <XCircle size={20} />
                      ) : isCurrent ? (
                        <Clock size={20} className="animate-pulse" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <p
                      className={cn(
                        "mt-3 text-[10px] font-black uppercase tracking-tighter text-center",
                        isCurrent
                          ? "text-blue-600"
                          : isCompleted
                            ? "text-emerald-600"
                            : isFailed
                              ? "text-red-600"
                              : "text-slate-400",
                      )}
                    >
                      {index === 3 && app.status === "accepted"
                        ? "Lolos"
                        : index === 3 && app.status === "rejected"
                          ? "Gagal"
                          : step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* SAW RESULTS (Hanya jika sudah dinilai) */}
          {(app.status === "accepted" ||
            app.status === "rejected" ||
            app.status === "calculated") &&
            app.final_score && (
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                    <BarChart3 size={20} />
                  </div>
                  <h3 className="font-black dark:text-white tracking-tight uppercase text-sm">
                    Hasil Skor Akhir (SAW)
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Skor Akhir
                    </p>
                    <p className="text-2xl font-black text-blue-600">
                      {Number(app.final_score).toFixed(4)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Peringkat
                    </p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      #{app.rank || "-"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-6">
            <CardTitle className="text-lg font-black mb-4 dark:text-white">
              Deskripsi Program
            </CardTitle>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              {app.program?.description || "Tidak ada deskripsi."}
            </div>
          </Card>
        </div>

        {/* DOCUMENTS COLUMN */}
        <div className="space-y-6">
          <Card
            className={cn(
              "rounded-3xl transition-all p-6 bg-white dark:bg-slate-900 border shadow-sm",
              isLocked
                ? "border-slate-200 dark:border-slate-800 opacity-90"
                : "border-blue-200 dark:border-blue-900 ring-4 ring-blue-500/5",
            )}
          >
            <div className="space-y-1 mb-6">
              <CardTitle className="text-lg font-black dark:text-white">
                Berkas Lamaran
              </CardTitle>
              <CardDescription className="text-xs font-medium uppercase tracking-tighter">
                {isLocked
                  ? "Dokumen sudah dikunci."
                  : "Wajib mengunggah CV & Transkrip."}
              </CardDescription>
            </div>

            <div className="space-y-6">
              {/* CV FIELD */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Curriculum Vitae
                  </label>
                  {cvDoc && (
                    <a
                      href={
                        getFileLink(cvDoc.file_url || cvDoc.file_path) || "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg flex items-center gap-1 hover:underline"
                    >
                      <Download size={10} /> LIHAT PDF
                    </a>
                  )}
                </div>
                {!isLocked && (
                  <div className="flex gap-2">
                    <input
                      type="file"
                      onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                      className="text-[10px] w-full file:bg-slate-100 dark:file:bg-slate-800 dark:file:text-slate-300 file:border-none file:rounded-lg file:px-3 file:py-1.5"
                    />
                    {cvFile && (
                      <Button
                        size="sm"
                        onClick={() => handleUpload("cv")}
                        disabled={isUploading}
                        className="h-8 w-8 p-0 rounded-lg"
                      >
                        <UploadCloud size={14} />
                      </Button>
                    )}
                  </div>
                )}
                {cvDoc && (
                  <Badge
                    variant="success"
                    className="w-full justify-center text-[9px] font-black h-6 rounded-lg uppercase"
                  >
                    {cvDoc.status}
                  </Badge>
                )}
              </div>

              <Separator className="dark:bg-slate-800" />

              {/* TRANSCRIPT FIELD */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Transkrip Nilai
                  </label>
                  {transcriptDoc && (
                    <a
                      href={
                        getFileLink(
                          transcriptDoc.file_url || transcriptDoc.file_path,
                        ) || "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg flex items-center gap-1 hover:underline"
                    >
                      <Download size={10} /> LIHAT PDF
                    </a>
                  )}
                </div>
                {!isLocked && (
                  <div className="flex gap-2">
                    <input
                      type="file"
                      onChange={(e) =>
                        setTranscriptFile(e.target.files?.[0] || null)
                      }
                      className="text-[10px] w-full file:bg-slate-100 dark:file:bg-slate-800 dark:file:text-slate-300 file:border-none file:rounded-lg file:px-3 file:py-1.5"
                    />
                    {transcriptFile && (
                      <Button
                        size="sm"
                        onClick={() => handleUpload("transcript")}
                        disabled={isUploading}
                        className="h-8 w-8 p-0 rounded-lg"
                      >
                        <UploadCloud size={14} />
                      </Button>
                    )}
                  </div>
                )}
                {transcriptDoc && (
                  <Badge
                    variant="success"
                    className="w-full justify-center text-[9px] font-black h-6 rounded-lg uppercase"
                  >
                    {transcriptDoc.status}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
