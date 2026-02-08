import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  notificationService,
  type Notification,
} from "@/services/notificationService";
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCheck,
  Eraser,
  Loader2,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NotificationPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getAll({ per_page: 50 });
      setNotifications(response.data.data || []);
    } catch (error: any) {
      toast.error("Gagal memuat notifikasi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      toast.success("Semua notifikasi ditandai dibaca.");
    } catch (error: any) {
      toast.error("Gagal memuat notifikasi.");
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationService.clearReadAll();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
      toast.success("Riwayat notifikasi dibersihkan.");
    } catch (error: any) {
      toast.error("Gagal membersihkan notifikasi");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== n.id));
    } catch (error: any) {
      toast.error("Gagal menghapus notifikasi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:scale-105 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Pusat Notifikasi
              </h1>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Log Aktivitas Personal Anda
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              className="rounded-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest h-10 px-4"
            >
              <CheckCheck className="mr-2 h-4 w-4 text-blue-600" /> Mark Read
            </Button>
            <Button
              variant="outline"
              onClick={handleClearRead}
              className="rounded-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-black uppercase tracking-widest h-10 px-4 text-red-500"
            >
              <Eraser className="mr-2 h-4 w-4" /> Clear All
            </Button>
          </div>
        </div>

        {/* NOTIFICATION LIST CONTAINER */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={40} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                Memuat Data...
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mb-6 border border-gray-100 dark:border-slate-800">
                <BellOff className="h-10 w-10 text-slate-200 dark:text-slate-700" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                Hening Sekali
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs font-medium">
                Belum ada aktivitas terbaru untuk akun Anda saat ini.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-6 flex gap-5 transition-all group relative",
                    !notif.is_read
                      ? "bg-blue-50/20 dark:bg-blue-900/5"
                      : "hover:bg-gray-50/50 dark:hover:bg-slate-800/20",
                  )}
                >
                  {/* Status Indicator Bar */}
                  {!notif.is_read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                  )}

                  <div
                    className={cn(
                      "mt-1 p-3 rounded-2xl flex-shrink-0 transition-colors",
                      !notif.is_read
                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400",
                    )}
                  >
                    <Bell size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4
                        className={cn(
                          "text-sm uppercase tracking-widest font-black transition-colors",
                          !notif.is_read
                            ? "text-blue-600"
                            : "text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {notif.title}
                      </h4>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter tabular-nums">
                        {notif.created_at_human}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-sm leading-relaxed transition-colors",
                        !notif.is_read
                          ? "text-slate-900 dark:text-slate-100 font-bold"
                          : "text-slate-500 dark:text-slate-400 font-medium",
                      )}
                    >
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleDelete(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-2.5 text-slate-300 hover:text-red-500 transition-all rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
