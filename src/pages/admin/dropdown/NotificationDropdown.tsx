import { useState, useEffect, useRef } from "react";
import {
  notificationService,
  type Notification,
} from "@/services/notificationService";
import { Bell, Trash2, BellOff, CheckCheck, Eraser } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
// Import instance echo yang sudah kita buat sebelumnya
import { echo } from "@/lib/echo";

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const user = authService.getUser();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const channel = `App.Models.User.${user.id}`;

      echo.private(channel).notification((notification: any) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(notification.message || "Anda menerima notifikasi baru");
      });

      return () => {
        echo.leave(channel);
      };
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      const [notifsData, count] = await Promise.all([
        notificationService.getAll(),
        notificationService.getUnreadCount(),
      ]);
      setNotifications(notifsData.data.data || []);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("Semua notifikasi ditandai dibaca");
    } catch (error) {
      toast.error("Gagal memperbarui notifikasi");
    }
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (isRead) return;

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      fetchData();
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      // Refresh count untuk memastikan angka akurat
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      toast.error("Gagal menghapus notifikasi");
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationService.clearReadAll();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
      toast.success("Notifikasi lama dibersihkan");
    } catch (error) {
      toast.error("Gagal membersihkan notifikasi");
    }
  };

  const handleSeeAll = () => {
    setIsOpen(false);
    if (user?.role === "admin") {
      navigate("/admin/notifications");
    } else {
      navigate("/user/notifications");
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 group"
      >
        <Bell size={20} className={cn(unreadCount > 0 && "animate-pulse")} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white dark:border-slate-900 text-[9px] font-black text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          </span>
        )}
      </button>

      {/* DROPDOWN CONTENT */}
      {isOpen && (
        <div className="fixed md:absolute top-16 md:top-full right-4 left-4 md:left-auto md:right-0 mt-2 z-[100] w-auto md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest">
                Pusat Notifikasi
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Tandai semua dibaca"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
                <button
                  onClick={handleClearRead}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Bersihkan yang sudah dibaca"
                >
                  <Eraser size={16} />
                </button>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-[10px] text-slate-500 font-bold uppercase">
                Anda memiliki{" "}
                <span className="text-blue-600">{unreadCount}</span> pesan belum
                dibaca
              </p>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center px-10">
                <BellOff className="h-10 w-10 text-slate-200 dark:text-slate-700 mb-3" />
                <p className="text-sm font-bold text-slate-400">
                  Belum ada notifikasi
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkRead(notif.id, notif.is_read)}
                    className={cn(
                      "p-4 flex gap-4 cursor-pointer transition-colors relative group",
                      !notif.is_read
                        ? "bg-blue-50/30 dark:bg-blue-900/10"
                        : "bg-white dark:bg-slate-900",
                    )}
                  >
                    {!notif.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={cn(
                            "text-[10px] uppercase font-black tracking-wider",
                            !notif.is_read ? "text-blue-600" : "text-slate-400",
                          )}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          {notif.created_at_human}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-xs leading-relaxed break-words",
                          !notif.is_read
                            ? "text-slate-900 dark:text-slate-100 font-bold"
                            : "text-slate-500 dark:text-slate-400",
                        )}
                      >
                        {notif.message}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={handleSeeAll}
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors w-full"
            >
              Lihat Semua Aktivitas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
