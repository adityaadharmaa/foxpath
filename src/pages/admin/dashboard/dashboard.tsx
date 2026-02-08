import StatCard from "@/components/shared/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DashboardSkeleton from "@/components/ui/skeleton/DashboardSekeleton";
import { dashboardService } from "@/services/dashboardService";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BellRing,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Shield,
  TrendingUp,
  Users,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import SchoolStatsChart from "./charts/SchoolStatsChart";
import { cn } from "@/lib/utils";

// --- Interfaces ---
interface programSummary {
  total_programs: number;
  active_programs: number;
  total_applications: number;
  submitted_applications: number;
  verified_applications: number;
  scored_applications: number;
  calculated_applications: number;
  accepted_applications: number;
  rejected_applications: number;
}

interface AnalyticsData {
  trends: { date: string; count: number }[];
  deadlines: { id: number; name: string; registration_ends_at: string }[];
  recent_activities: {
    id: number;
    user_name: string;
    program_name: string;
    status: string;
    created_at: string;
  }[];
}

interface userSummary {
  totals: {
    users: number;
    active: number;
    admin: number;
  };
  by_applicant_type: {
    siswa: number;
    mahasiswa: number;
  };
}

// --- Custom Components ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">
          {new Date(label).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
          })}
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-bold">
          {payload[0].value}{" "}
          <span className="text-slate-500 font-normal">Pendaftar</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [programStats, setProgramStats] = useState<programSummary | null>(null);
  const [userStats, setUserStats] = useState<userSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progRes, userRes, roleRes, analiyticsRes] = await Promise.all([
          dashboardService.getProgamrSummary(),
          dashboardService.getUserSummary(),
          dashboardService.getRoleSummary(),
          dashboardService.getAnalytics(),
        ]);

        setProgramStats(progRes.data.data);
        setUserStats(userRes.data.data);
        setAnalytics(analiyticsRes.data.data);
      } catch (error: any) {
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const applicationStatusData = programStats
    ? [
        {
          name: "Submitted",
          value: programStats.submitted_applications,
          color: "#3B82F6",
        },
        {
          name: "Verified",
          value: programStats.verified_applications,
          color: "#8B5CF6",
        },
        {
          name: "Scored",
          value: programStats.scored_applications,
          color: "#F59E0B",
        },
        {
          name: "Accepted",
          value: programStats.accepted_applications,
          color: "#10B981",
        },
        {
          name: "Rejected",
          value: programStats.rejected_applications,
          color: "#EF4444",
        },
      ].filter((item) => item.value > 0)
    : [];

  const applicantTypeData = userStats
    ? [
        {
          name: "Siswa",
          value: userStats.by_applicant_type.siswa,
          fill: "#3B82F6",
        },
        {
          name: "Mahasiswa",
          value: userStats.by_applicant_type.mahasiswa,
          fill: "#8B5CF6",
        },
      ]
    : [];

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      {/* 1. Header */}
      <div className="flex flex-col gap-1 mt-4">
        <BreadCrumbs items={[{ label: "Dashboard" }]} />
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Manajemen sistem seleksi magang PT Foxbyte Global Inovasi.
        </p>
      </div>

      {/* 2. Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pelamar"
          value={programStats?.total_applications || 0}
          icon={
            <FileText className="text-blue-600 dark:text-blue-400" size={22} />
          }
          iconClassName="bg-blue-100/50 dark:bg-blue-900/30"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        />
        <StatCard
          title="Program Aktif"
          value={programStats?.active_programs || 0}
          icon={
            <Briefcase
              className="text-emerald-600 dark:text-emerald-400"
              size={22}
            />
          }
          iconClassName="bg-emerald-100/50 dark:bg-emerald-900/30"
          subtitle={`${programStats?.total_programs} Total Program`}
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        />
        <StatCard
          title="User Terdaftar"
          value={userStats?.totals.users || 0}
          icon={
            <Users className="text-violet-600 dark:text-violet-400" size={22} />
          }
          iconClassName="bg-violet-100/50 dark:bg-violet-900/30"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        />
        <StatCard
          title="Butuh Verifikasi"
          value={programStats?.submitted_applications || 0}
          icon={
            <AlertCircle
              className="text-amber-600 dark:text-amber-400"
              size={22}
            />
          }
          iconClassName="bg-amber-100/50 dark:bg-amber-900/30"
          className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        />
      </div>

      {/* 3. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Tren Pendaftaran */}
        <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg dark:text-white font-bold">
              <TrendingUp size={20} className="text-blue-500" /> Tren
              Pendaftaran
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Statistik 30 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.trends || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                  className="dark:stroke-slate-800"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) =>
                    new Date(str).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Deadlines */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-red-600 dark:text-red-400 font-bold">
              <Calendar size={18} /> Segera Ditutup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics?.deadlines && analytics.deadlines.length > 0 ? (
              analytics.deadlines.map((prog) => (
                <div
                  key={prog.id}
                  className="p-3 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30"
                >
                  <p className="font-bold text-sm dark:text-slate-100 truncate">
                    {prog.name}
                  </p>
                  <p className="text-[10px] text-red-600 dark:text-red-400 mt-1 font-bold">
                    Tutup:{" "}
                    {new Date(prog.registration_ends_at).toLocaleDateString(
                      "id-ID",
                    )}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Semua deadline masih lama.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Secondary Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demografi */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 dark:text-white">
              <GraduationCap size={18} className="text-violet-500" /> Demografi
              Pelamar
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicantTypeData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "#F1F5F9", opacity: 0.1 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {applicantTypeData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Aplikasi (Pie Chart) */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2 dark:text-white">
              <Shield size={18} className="text-emerald-500" /> Status Aplikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "10px", color: "#94a3b8" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* School Stats Chart */}
        <div className="h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <SchoolStatsChart />
        </div>
      </div>

      {/* 5. Recent Activities */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="border-b border-slate-50 dark:border-slate-800/50 pb-4">
          <CardTitle className="text-base font-bold flex items-center gap-2 dark:text-white">
            <BellRing size={18} className="text-amber-500" /> Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.recent_activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20 hover:border-blue-200 dark:hover:border-blue-900 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-xs">
                  {activity.user_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {activity.user_name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    Melamar: {activity.program_name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                    <Clock size={10} />{" "}
                    {new Date(activity.created_at).toLocaleDateString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
