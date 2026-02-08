import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Award,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { programService } from "@/services/programService";
import { applicationService } from "@/services/applicationService";
import { cn } from "@/lib/utils";

export default function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<any>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State untuk Dialog & Loading Submit
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      if (!id) return;

      const [progRes, myAppsRes] = await Promise.all([
        programService.getProgramDetails(Number(id)),
        applicationService.getMyApplication(),
      ]);

      const progData = progRes.data.data || progRes.data;
      setProgram(progData);

      const myApps = myAppsRes.data.data || myAppsRes.data || [];
      const appliedIds = myApps.map((app: any) =>
        Number(app.program_id || app.programs_id),
      );

      const isUserApplied = appliedIds.includes(Number(id));
      setIsApplied(isUserApplied);
    } catch (error) {
      console.error("Gagal memuat detail:", error);
      toast.error("Program tidak ditemukan.");
      navigate("/user/programs");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      title: "Sertifikat Resmi",
      desc: "Dapatkan sertifikat industri setelah menyelesaikan program.",
      icon: <Award className="text-blue-600 dark:text-blue-400" size={24} />,
      bg: "bg-blue-100 dark:bg-blue-900/30",
      border:
        "border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10",
    },
    {
      title: "Mentoring Eksklusif",
      desc: "Bimbingan langsung dari senior developer PT Foxbyte Global Inovasi.",
      icon: (
        <Users className="text-purple-600 dark:text-purple-400" size={24} />
      ),
      bg: "bg-purple-100 dark:bg-purple-900/30",
      border:
        "border-purple-100 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10",
    },
  ];

  const executeApply = async () => {
    setIsSubmitting(true);
    try {
      await applicationService.applyProgram({ programs_id: Number(id) });
      toast.success(
        "Lamaran berhasil dikirim! Silakan cek menu 'Lamaran Saya'.",
      );
      setIsApplied(true);
      setShowConfirm(false);
      navigate("/user/applications");
    } catch (error: any) {
      const errorData = error.response?.data;
      const msg = (errorData?.message || "").toLowerCase();

      if (
        errorData?.code === "PROFILE_INCOMPLETE" ||
        (msg.includes("profile") && msg.includes("incomplete"))
      ) {
        setShowConfirm(false);
        setShowProfileAlert(true);
        return;
      }
      toast.error(errorData?.message || "Terjadi kesalahan.");
      setShowConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  if (!program) return null;

  const now = new Date();
  const deadlineDate = program.registration_ends_at
    ? new Date(program.registration_ends_at)
    : null;
  const isClosed = deadlineDate ? now > deadlineDate : false;

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 pl-0 hover:pl-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 transition-all"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Lowongan
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                    {program.name}
                  </h1>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                    <Building2
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span>PT Foxbyte Global Inovasi</span>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold uppercase tracking-wider",
                    isClosed
                      ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 dark:shadow-none",
                  )}
                >
                  {isClosed ? "Pendaftaran Ditutup" : "Open Hiring"}
                </Badge>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">
                Deskripsi Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm">
                {program.description ||
                  "Tidak ada deskripsi detail untuk program ini."}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">
                Benefit Magang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-xl border flex items-start gap-3 transition-colors",
                      item.border,
                    )}
                  >
                    <div className={cn("p-2 rounded-lg shrink-0", item.bg)}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-5 flex gap-3 text-sm text-blue-700 dark:text-blue-300 shadow-sm shadow-blue-100/50 dark:shadow-none">
            <AlertCircle
              className="shrink-0 mt-0.5 text-blue-600 dark:text-blue-400"
              size={18}
            />
            <p className="font-medium leading-relaxed">
              Pastikan profil dan berkas pendidikan Anda sudah lengkap sebelum
              melamar. Seleksi akan dilakukan berdasarkan data kriteria yang
              diinput pada profil Anda.
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md sticky top-6 bg-white dark:bg-slate-900">
            <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800/50">
              <CardTitle className="text-lg dark:text-white font-bold">
                Ringkasan Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      Durasi
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {program.placement_duration_months} Bulan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      Mulai Program
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {program.cohort_starts_at
                        ? new Date(program.cohort_starts_at).toLocaleDateString(
                            "id-ID",
                            { month: "long", year: "numeric" },
                          )
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">
                      Kuota
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {program.capacity} Peserta
                    </p>
                  </div>
                </div>

                <Separator className="dark:bg-slate-800" />

                <div
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl",
                    isClosed
                      ? "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400"
                      : "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400",
                  )}
                >
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shadow-sm",
                      isClosed
                        ? "bg-white dark:bg-slate-800"
                        : "bg-white dark:bg-slate-800",
                    )}
                  >
                    <Hourglass size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest opacity-80">
                      Batas Pendaftaran
                    </p>
                    <p className="font-bold text-sm">
                      {program.registration_ends_at
                        ? new Date(
                            program.registration_ends_at,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Secepatnya"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                {isApplied ? (
                  <Button
                    variant="outline"
                    className="w-full border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 cursor-default h-12 text-sm font-bold shadow-none"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Anda Sudah Melamar
                  </Button>
                ) : isClosed ? (
                  <Button
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed h-12 text-sm font-bold border-none"
                  >
                    Pendaftaran Ditutup
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowConfirm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white transition-all h-12 text-sm font-bold shadow-lg shadow-blue-600/20 dark:shadow-none"
                  >
                    Lamar Posisi Ini
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeApply}
        title="Konfirmasi Lamaran"
        description={`Apakah Anda yakin ingin melamar posisi "${program.name}"? Pastikan data profil Anda sudah lengkap dan benar.`}
        confirmText="Ya, Lamar Sekarang"
        cancelText="Batal"
        variant="info"
        isLoading={isSubmitting}
      />

      <ConfirmDialog
        isOpen={showProfileAlert}
        onClose={() => setShowProfileAlert(false)}
        onConfirm={() => navigate("/user/profile")}
        title="Profile Belum Lengkap"
        description={`Mohon maaf, Anda belum dapat melamar posisi "${program.name}". Sistem mewajibkan data diri, alamat, dan riwayat pendidikan yang lengkap untuk proses seleksi.`}
        confirmText="Lengkapi Profile Sekarang"
        variant="warning"
      />
    </div>
  );
}
