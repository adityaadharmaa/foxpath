import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { calculateCompletion, getProgressColor } from "@/lib/profileCompletion";
import { applicationService } from "@/services/applicationService";
import { authService } from "@/services/authService";
import { profileService } from "@/services/profileService";
import { cn } from "@/lib/utils";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user] = useState(authService.getUser());
  const [latestApp, setLatestApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completionPercent, setCompletionPercent] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile Completion
      const profileRes = await profileService.getFullProfile();
      const profileData = profileRes.data.data || profileRes.data;
      setCompletionPercent(calculateCompletion(profileData));

      // 2. Fetch Latest Application
      const appRes = await applicationService.getMyApplication();
      if (appRes.data.data.length > 0) {
        setLatestApp(appRes.data.data[0]);
      }
    } catch (error: any) {
      console.error("Dashboard Error:", error);
      toast.error("Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "rejected":
        return "destructive";
      case "verified":
        return "info";
      case "scored":
        return "warning";
      case "calculated":
        return "info";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Halo, {user?.username || "Pelamar"}! 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang kembali di dashboard seleksi magang FoxPath.
          </p>
        </div>
        <Button
          onClick={() => navigate("/user/programs")}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
        >
          <Briefcase className="mr-2 h-4 w-4" /> Cari Lowongan Baru
        </Button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Kelengkapan Profil */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kelengkapan Profil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between mb-3">
              <span
                className={cn(
                  "text-3xl font-black transition-colors duration-500",
                  completionPercent === 100
                    ? "text-emerald-500"
                    : "text-slate-900 dark:text-slate-50",
                )}
              >
                {completionPercent}%
              </span>
              <button
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                onClick={() => navigate("/user/profile")}
              >
                {completionPercent === 100 ? "Lihat Profil" : "Lengkapi Data"}{" "}
                &rarr;
              </button>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-1000 ease-out",
                  getProgressColor(completionPercent),
                )}
                style={{ width: `${completionPercent}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 font-medium leading-tight">
              {completionPercent < 100
                ? "Biodata & pendidikan yang lengkap meningkatkan peluang Anda."
                : "Profil Anda sudah lengkap. Siap untuk proses seleksi!"}
            </p>
          </CardContent>
        </Card>

        {/* Card Total Lamaran */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Lamaran
            </CardTitle>
            <FileText className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900 dark:text-slate-50">
              {loading ? "..." : latestApp ? "1" : "0"}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Lamaran aktif yang sedang diproses
            </p>
          </CardContent>
        </Card>

        {/* Card Status Terkini */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Status Terkini
            </CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {latestApp ? (
              <Badge
                variant={getBadgeVariant(latestApp.status)}
                className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
              >
                {latestApp.status}
              </Badge>
            ) : (
              <span className="text-sm text-slate-400 dark:text-slate-500 italic">
                Belum ada aktivitas melamar
              </span>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lamaran Terbaru List */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-500" /> Lamaran Terbaru
          </h2>

          {loading ? (
            <div className="h-48 bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800"></div>
          ) : latestApp ? (
            <Card
              className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all cursor-pointer group rounded-2xl overflow-hidden"
              onClick={() => navigate(`/user/applications/${latestApp.id}`)}
            >
              <CardHeader className="pb-4 border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-slate-50">
                      {latestApp.program?.name || "Program Magang"}
                    </CardTitle>
                    <CardDescription className="mt-1 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      PT Foxbyte Global Inovasi{" "}
                      <span className="h-1 w-1 bg-slate-300 rounded-full"></span>{" "}
                      Batch 2026
                    </CardDescription>
                  </div>
                  <Badge
                    variant={getBadgeVariant(latestApp.status)}
                    className="uppercase text-[10px]"
                  >
                    {latestApp.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-400 dark:text-slate-500">
                      Tanggal Melamar
                    </p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {new Date(latestApp.created_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-bold group-hover:translate-x-1 transition-all"
                  >
                    Lihat Detail <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
              <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-5 text-slate-300 dark:text-slate-600">
                <Briefcase size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                Belum ada lamaran
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 text-sm">
                Mulai karir magang Anda di PT Foxbyte Global Inovasi dengan
                memilih program yang tersedia.
              </p>
              <Button
                onClick={() => navigate("/user/programs")}
                className="px-8"
              >
                Jelajahi Lowongan
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50 rounded-2xl shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-blue-800 dark:text-blue-400 flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                <AlertCircle size={18} /> Perhatian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start group">
                  <div className="mt-1 h-5 w-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Pastikan nilai{" "}
                    <strong className="text-slate-900 dark:text-slate-200">
                      IPK/Rapor
                    </strong>{" "}
                    sudah diinput dengan benar untuk perhitungan SAW.
                  </span>
                </li>
                <li className="flex gap-3 items-start group">
                  <div className="mt-1 h-5 w-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Upload transkrip nilai dalam format{" "}
                    <strong className="text-slate-900 dark:text-slate-200">
                      PDF (Max 2MB)
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex gap-3 items-start group">
                  <div className="mt-1 h-5 w-5 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm shrink-0">
                    <UserCheck size={12} className="text-blue-500" />
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cek{" "}
                    <strong className="text-slate-900 dark:text-slate-200">
                      Notifikasi
                    </strong>{" "}
                    secara berkala untuk info jadwal wawancara.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
