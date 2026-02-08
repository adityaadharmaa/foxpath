import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowRight,
  Building2,
  Calendar,
  FileText,
  MapPin,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { applicationService } from "@/services/applicationService";
import { cn } from "@/lib/utils";

export default function UserApplication() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await applicationService.getMyApplication();
        const data = res.data.data || res.data;
        setApplications(Array.isArray(data) ? data : []);
      } catch (error: any) {
        toast.error(error.data?.message || "Gagal memuat lamaran.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApp();
  }, []);

  const filteredApps = applications.filter(
    (app) =>
      app.program?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.program?.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          color: "success",
          label: "Diterima",
          bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
        };
      case "rejected":
        return {
          color: "destructive",
          label: "Tidak Lolos",
          bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
        };
      case "verified":
        return {
          color: "info",
          label: "Terverifikasi",
          bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
        };
      case "scored":
        return {
          color: "warning",
          label: "Penilaian",
          bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
        };
      case "calculated":
        return {
          color: "info",
          label: "Finalisasi",
          bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
        };
      default:
        return {
          color: "secondary",
          label: "Menunggu",
          bg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const getActionButtonText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Lihat Detail & Konfirmasi";
      case "rejected":
        return "Lihat Detail";
      default:
        return "Pantau Progres";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            Lamaran Saya
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Pantau status seleksi program magang di PT Foxbyte Global Inovasi.
          </p>
        </div>

        {applications.length > 0 && (
          <div className="relative w-full sm:w-72 group">
            <Input
              placeholder="Cari program..."
              className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 dark:text-slate-300 focus-visible:ring-blue-500"
              startIcon={
                <Search
                  className="text-slate-400 group-focus-within:text-blue-500 transition-colors dark:text-slate-400"
                  size={18}
                />
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="h-56 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : applications.length === 0 ? (
        /* EMPTY STATE */
        <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <FileText
              className="text-slate-300 dark:text-slate-600"
              size={40}
            />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Belum ada lamaran
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 mt-2 text-sm">
            Anda belum mendaftar di program apapun. Mulai karir Anda sekarang.
          </p>
          <Button
            onClick={() => navigate("/user/programs")}
            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
          >
            Jelajahi Lowongan
          </Button>
        </div>
      ) : filteredApps.length === 0 ? (
        /* NO SEARCH RESULTS */
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Search
            className="text-slate-300 dark:text-slate-700 mx-auto mb-4"
            size={48}
          />
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Pencarian tidak ditemukan
          </h3>
          <p className="text-slate-500 text-sm mt-1 px-4">
            Tidak ada lamaran yang cocok dengan "{searchTerm}"
          </p>
          <Button
            variant="ghost"
            className="text-blue-600 dark:text-blue-400 mt-2"
            onClick={() => setSearchTerm("")}
          >
            Reset Pencarian
          </Button>
        </div>
      ) : (
        /* LIST CARDS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const statusInfo = getStatusConfig(app.status);

            return (
              <Card
                key={app.id}
                className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex flex-col gap-3">
                    <Badge
                      className={cn(
                        "w-fit px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                        statusInfo.bg,
                      )}
                    >
                      {statusInfo.label}
                    </Badge>
                    <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {app.program?.name || "Nama Program"}
                    </h3>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-400">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Building2
                          size={16}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        PT Foxbyte Global Inovasi
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <MapPin size={16} />
                      </div>
                      <span className="truncate italic">Jimbaran, Bali</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-500">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Calendar size={16} />
                      </div>
                      <span>
                        Daftar:{" "}
                        {new Date(app.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <Button
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-500 font-bold transition-colors"
                    onClick={() => navigate(`/user/applications/${app.id}`)}
                  >
                    {getActionButtonText(app.status)}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
