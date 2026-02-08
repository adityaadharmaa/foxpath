import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  Briefcase,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Building2,
  Hourglass,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { programService } from "@/services/programService";
import { applicationService } from "@/services/applicationService";
import { cn } from "@/lib/utils";

export default function FindPrograms() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [programsRes, myAppsRes] = await Promise.all([
        programService.getAllPrograms(),
        applicationService.getMyApplication(),
      ]);

      const rawPrograms = programsRes.data.data || programsRes.data || [];
      const rawMyApps = myAppsRes.data.data || myAppsRes.data || [];

      const activePrograms = rawPrograms.filter(
        (p: any) =>
          p.is_active == 1 || p.is_active === true || p.is_active === "1",
      );

      setPrograms(activePrograms);
      const appliedProgramIds = rawMyApps.map((app: any) => app.program_id);
      setMyApplications(appliedProgramIds);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrograms = programs.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
            Karir di Foxbyte Global Inovasi
          </h1>
          <p className="text-slate-400 mb-8 text-lg font-medium leading-relaxed">
            Temukan posisi magang yang sesuai dengan keahlianmu dan bergabunglah
            dengan tim profesional kami di Jimbaran, Bali.
          </p>

          <div className="relative group">
            <Input
              placeholder="Cari posisi (contoh: Backend Developer)..."
              className="pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white focus:text-slate-400 transition-all rounded-2xl text-base shadow-2xl "
              startIcon={
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500" />
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Briefcase className="text-blue-600 dark:text-blue-400" size={20} />{" "}
            Lowongan Tersedia
          </h2>
          <Badge
            variant="outline"
            className="dark:border-slate-800 dark:text-slate-400"
          >
            {filteredPrograms.length} Program
          </Badge>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="h-[280px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 mb-6">
              <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Posisi tidak ditemukan
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">
              Belum ada lowongan yang sesuai dengan kriteria pencarian Anda.
            </p>
            <Button
              onClick={() => setSearch("")}
              variant="outline"
              className="dark:border-slate-700"
            >
              Reset Pencarian
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => {
              const isApplied = myApplications.includes(program.id);
              const now = new Date();
              const deadlineDate = program.registration_ends_at
                ? new Date(program.registration_ends_at)
                : null;
              const isClosed = deadlineDate ? now > deadlineDate : false;

              const startDate = program.cohort_starts_at
                ? new Date(program.cohort_starts_at).toLocaleDateString(
                    "id-ID",
                    { month: "long", year: "numeric" },
                  )
                : "-";

              return (
                <Card
                  key={program.id}
                  className={cn(
                    "group flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden rounded-2xl",
                    isClosed
                      ? "opacity-70 bg-slate-50 dark:bg-slate-900/50"
                      : "bg-white dark:bg-slate-900",
                  )}
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                          isClosed
                            ? "bg-slate-200 text-slate-500 dark:bg-slate-800"
                            : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                        )}
                      >
                        <Building2 size={24} />
                      </div>
                      <Badge
                        variant={isClosed ? "secondary" : "outline"}
                        className="px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-wider"
                      >
                        {isClosed
                          ? "Ditutup"
                          : `${program.capacity} Slot Tersedia`}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {program.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-6 flex items-center gap-1.5">
                      PT Foxbyte Global Inovasi{" "}
                      <span className="h-1 w-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>{" "}
                      Jimbaran
                    </p>

                    <div className="space-y-3 text-sm font-medium">
                      <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                        <Clock
                          size={16}
                          className="text-slate-400 dark:text-slate-600 shrink-0"
                        />
                        <span>
                          Durasi {program.placement_duration_months} Bulan
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                        <Calendar
                          size={16}
                          className="text-slate-400 dark:text-slate-600 shrink-0"
                        />
                        <span>Mulai {startDate}</span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-2.5",
                          isClosed
                            ? "text-red-500"
                            : "text-amber-600 dark:text-amber-400",
                        )}
                      >
                        <Hourglass size={16} className="shrink-0" />
                        <span>
                          {isClosed
                            ? "Pendaftaran Berakhir"
                            : `Batas: ${deadlineDate?.toLocaleDateString("id-ID", { day: "numeric", month: "short" }) || "Secepatnya"}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <CardFooter className="p-6 pt-0 mt-auto border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/20">
                    <div className="w-full pt-4">
                      {isApplied ? (
                        <Button
                          variant="outline"
                          className="w-full border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 cursor-default font-bold"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Sudah
                          Dilamar
                        </Button>
                      ) : isClosed ? (
                        <Button
                          disabled
                          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-none font-bold"
                        >
                          Lowongan Ditutup
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-900/10 dark:shadow-none"
                          onClick={() =>
                            navigate(`/user/programs/${program.id}`)
                          }
                        >
                          Lihat Detail{" "}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
