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
  User,
  Users,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BreadCrumbs from "@/components/ui/breadcrumbs";
import SchoolStatsChart from "./charts/SchoolStatsChart";

// --- Interfaces (Tetap Sama) ---
interface programSummary {
  total_programs: number;
  active_programs: number;
  total_applications: number;
  draft_applications: number;
  submitted_applications: number;
  pending_applications: number;
  verified_applications: number;
  scored_applications: number;
  calculated_applications: number;
  accepted_applications: number;
  rejected_applications: number;
}

interface AnalyticsData {
  trends: { date: string; count: number };
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
    inactive: number;
    admin: number;
  };
  by_applicant_type: {
    siswa: number;
    mahasiswa: number;
  };
}

interface roleSummary {
  totals: {
    roles: number;
    most_used: string;
    most_used_count: number;
  };
}

// --- Custom Components untuk Mempercantik Chart ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-3 rounded-xl shadow-xl text-xs">
        <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">
          {label}
        </p>
        <p className="text-blue-600 font-semibold">
          {payload[0].value}{" "}
          <span className="text-slate-500 font-normal">Data</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const [programStats, setProgramStats] = useState<programSummary | null>(null);
  const [userStats, setUserStats] = useState<userSummary | null>(null);
  const [roleStats, setRoleStats] = useState<roleSummary | null>(null);
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
        setRoleStats(roleRes.data.data);
        setAnalytics(analiyticsRes.data.data);
      } catch (error: any) {
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Data Formatting
  const applicationStatusData = programStats
    ? [
        {
          name: "Submitted",
          value: programStats.submitted_applications,
          color: "#3B82F6",
        }, // Blue
        {
          name: "Verified",
          value: programStats.verified_applications,
          color: "#8B5CF6",
        }, // Violet
        {
          name: "Scored",
          value: programStats.scored_applications,
          color: "#F59E0B",
        }, // Amber
        {
          name: "Calculated",
          value: programStats.calculated_applications,
          color: "#0EA5E9",
        }, // Sky
        {
          name: "Accepted",
          value: programStats.accepted_applications,
          color: "#10B981",
        }, // Emerald
        {
          name: "Rejected",
          value: programStats.rejected_applications,
          color: "#EF4444",
        }, // Red
      ].filter((item) => item.value > 0) // Hanya tampilkan yang ada nilainya agar chart tidak penuh
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
        <BreadCrumbs items={[{ label: "Dashboard" }]} />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Pantau aktivitas pendaftaran, statistik program, dan metrik utama.
        </p>
      </div>

      {/* 2. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Pelamar"
          value={programStats?.total_applications || 0}
          icon={<FileText className="text-blue-600" size={22} />}
          iconClassName="bg-blue-100/50 dark:bg-blue-900/30"
          trend="All Time"
          className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300"
        />
        <StatCard
          title="Program Aktif"
          value={programStats?.active_programs || 0}
          icon={<Briefcase className="text-emerald-600" size={22} />}
          iconClassName="bg-emerald-100/50 dark:bg-emerald-900/30"
          subtitle={`${programStats?.total_programs} Total Program`}
          className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300"
          indiCatorColor="bg-emerald-500"
        />
        <StatCard
          title="User Terdaftar"
          value={userStats?.totals.users || 0}
          icon={<Users className="text-violet-600" size={22} />}
          iconClassName="bg-violet-100/50 dark:bg-violet-900/30"
          subtitle={`${userStats?.totals.active} Akun Aktif`}
          className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300"
        />
        <StatCard
          title="Butuh Tindakan"
          value={
            (programStats?.submitted_applications || 0) +
            (programStats?.verified_applications || 0)
          }
          icon={<AlertCircle className="text-amber-600" size={22} />}
          iconClassName="bg-amber-100/50 dark:bg-amber-900/30"
          subtitle="Submitted & Verified"
          className="border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300"
        />
      </div>

      {/* 3. Main Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-full">
        {/* A. Trend Chart (Lebar: 5/7) */}
        <Card className="lg:col-span-5 shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp size={20} className="text-blue-600" />
              </div>
              Tren Pendaftaran
            </CardTitle>
            <CardDescription>
              Grafik jumlah pendaftaran dalam 30 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={analytics?.trends || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(str) =>
                    new Date(str).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })
                  }
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#3B82F6",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* B. Upcoming Deadlines (Lebar: 2/7) */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-red-600">
              <Calendar size={18} /> Segera Ditutup
            </CardTitle>
            <CardDescription className="text-xs">
              Program deadline &lt; 7 hari.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-1">
            {analytics?.deadlines && analytics.deadlines.length > 0 ? (
              <div className="space-y-3">
                {analytics.deadlines.map((prog) => (
                  <div
                    key={prog.id}
                    className="flex flex-col p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 transition-transform hover:scale-[1.02]"
                  >
                    <p
                      className="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-1"
                      title={prog.name}
                    >
                      {prog.name}
                    </p>
                    <div className="flex justify-between items-end mt-2">
                      <div className="text-xs text-red-600 bg-white/50 px-2 py-1 rounded-md font-medium">
                        {new Date(prog.registration_ends_at).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </div>
                      <Clock size={14} className="text-red-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
                <CheckCircle2
                  size={36}
                  className="mb-2 text-emerald-100 text-emerald-500"
                />
                <p>Aman! Tidak ada deadline dalam waktu dekat.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 4. Secondary Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* C. Applicant Demographics */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <GraduationCap size={18} className="text-violet-500" /> Demografi
              Pelamar
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={applicantTypeData}
                layout="vertical"
                margin={{ left: 0, right: 20 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fontSize: 12, fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 6, 6, 0]}
                  barSize={32}
                  label={{
                    position: "right",
                    fill: "#64748b",
                    fontSize: 12,
                    formatter: (val: any) => (val > 0 ? val : ""),
                  }}
                >
                  {applicantTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* D. School Stats (Imported Component) */}
        {/* Pastikan component SchoolStatsChart Anda tingginya responsive (h-full) */}
        <div className="h-full">
          <SchoolStatsChart />
        </div>

        {/* E. Application Status */}
        <Card className="shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Shield size={18} className="text-emerald-500" /> Status Aplikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  cornerRadius={4}
                >
                  {applicationStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 5. Recent Activities List (Full Width) */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800/50 pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BellRing size={18} className="text-amber-500" /> Aktivitas Terbaru
          </CardTitle>
          <CardDescription>Log aktivitas pendaftaran terkini.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.recent_activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
              >
                <div className="mt-1 min-w-10 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                    {activity.user_name.substring(0, 2)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                    {activity.user_name}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    Mendaftar program{" "}
                    <span className="text-blue-600 font-medium">
                      {activity.program_name}
                    </span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                      <Clock size={10} />{" "}
                      {new Date(activity.created_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {(!analytics?.recent_activities ||
              analytics.recent_activities.length === 0) && (
              <div className="col-span-full py-8 text-center text-slate-400">
                Belum ada aktivitas baru.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
