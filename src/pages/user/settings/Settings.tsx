import { useEffect, useState } from "react";
import {
  KeyRound,
  Smartphone,
  Monitor,
  LogOut,
  ShieldCheck,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService } from "@/services/authService";
import UpdatePasswordForm from "@/components/shared/password/UpdatePasswordForm";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const user = authService.getUser();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const res = await authService.getSession();
      setSessions(res.data || []);
    } catch (error) {
      console.error("Gagal memuat sesi:", error);
      toast.error("Gagal memuat daftar sesi.");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRevoke = async (id: number) => {
    try {
      await authService.revokeSession(id);
      toast.success("Perangkat berhasil dikeluarkan.");
      setSessions(sessions.filter((s) => s.id !== id));
    } catch (error) {
      toast.error("Gagal mengeluarkan perangkat.");
    }
  };

  const getReadableDeviceName = (uaString: string) => {
    if (!uaString || uaString === "auth_token")
      return "Perangkat Tidak Dikenal";
    const parser = new UAParser(uaString);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    return `${browser.name || "Browser"} on ${os.name || "Unknown OS"} ${os.version || ""}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 mt-4 px-4">
      {/* 1. Profil Singkat */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200 dark:shadow-none">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.username}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="hidden sm:flex border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
        >
          <ShieldCheck size={14} className="mr-1" /> Akun Aktif
        </Badge>
      </div>

      {/* 2. Ganti Password */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-slate-700 dark:text-slate-300">
          <KeyRound size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-lg">Keamanan Kata Sandi</h2>
        </div>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <CardContent className="pt-6">
            <UpdatePasswordForm />
          </CardContent>
        </Card>
      </section>

      {/* 3. Sesi Perangkat */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1 text-slate-700 dark:text-slate-300">
          <Smartphone size={20} className="text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-lg">Sesi Perangkat aktif</h2>
        </div>
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <CardHeader className="pb-4">
            <CardDescription className="dark:text-slate-400">
              Daftar perangkat yang saat ini memiliki akses aktif ke akun Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingSessions ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 py-4 italic">
                Tidak ada sesi aktif ditemukan.
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                    session.is_current
                      ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/50"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800",
                  )}
                >
                  <div className="flex items-center gap-4 overflow-hidden flex-1">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm text-slate-400 dark:text-slate-500 shrink-0">
                      {session.name?.toLowerCase().includes("windows") ||
                      session.name?.toLowerCase().includes("macintosh") ? (
                        <Monitor size={20} />
                      ) : (
                        <Smartphone size={20} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span className="truncate block" title={session.name}>
                          {getReadableDeviceName(session.name)}
                        </span>
                        {session.is_current && (
                          <Badge className="bg-blue-600 dark:bg-blue-500 text-[10px] px-1.5 py-0 h-4 shrink-0 pointer-events-none border-none">
                            Sesi Ini
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Aktif:{" "}
                        {new Date(
                          session.last_used_at || Date.now(),
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {!session.is_current && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2 shrink-0 transition-colors"
                      onClick={() => handleRevoke(session.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {/* 4. Logout Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="ghost"
          className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 font-semibold transition-all active:scale-95"
          onClick={() => authService.logout()}
        >
          <LogOut className="mr-2 h-4 w-4" /> Keluar dari Aplikasi
        </Button>
      </div>
    </div>
  );
}
