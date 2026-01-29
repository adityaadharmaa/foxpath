import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { dashboardService } from "@/services/dashboardService";
import { Loader2, School } from "lucide-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

export default function SchoolStatsChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getSchoolStats();
        setData(response.data.data);
      } catch (error) {
        console.error("Gagal memuat statistik sekolah", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
        Belum ada data pelamar.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <h3 className="text-base font-semibold flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
        <School size={18} className="text-orange-500" />
        Top 5 Asal Sekolah/Kampus
      </h3>
      <div className="h-45 w-full relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%" // Balik ke tengah karena containernya sudah kita batasi tingginya
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} Pelamar`, "Jumlah"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-200/20">
            {data.reduce((acc, curr) => acc + curr.value, 0)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {data.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />

            <div className="flex flex-col w-full">
              <span className="font-medium text-slate-700 dark:text-slate-200 leading-tight">
                {item.name}
              </span>
              <span className="text-slate-400 text-[10px] mt-0.5">
                {item.value} Pelamar
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
