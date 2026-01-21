import { useState, useEffect, useRef } from "react";
import { notificationService, type Notification } from "@/services/notificationService";
import { Bell, Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const getTitle = (type: string) => {
    switch (type) {
        case 'info': return 'Informasi';
        case 'reset_password': return 'Permintaan Reset Password';
        case 'password_changed': return 'Keamanan Akun';
        case 'new_user': return 'Pendaftaran Baru';
        default: return 'Pemberitahuan';
    }
};

export default function NotificationDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
        
        const interval = setInterval(fetchData, 30000); 
        return () => clearInterval(interval);
    }, []);

    // Tutup dropdown jika klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchData = async () => {
        try {
            const [notifsRaw, countRaw] = await Promise.all([
                notificationService.getAll(),
                notificationService.getUnreadCount()
            ]);

            // console.log("Raw Notifications:", notifsRaw);

            let safeNotifs: Notification[] = [];

            if (notifsRaw?.data?.data && Array.isArray(notifsRaw.data.data)) {
                safeNotifs = notifsRaw.data.data;
            } 

            else if (notifsRaw?.data && Array.isArray(notifsRaw.data)) {
                safeNotifs = notifsRaw.data;
            }
        
            else if (Array.isArray(notifsRaw)) {
                safeNotifs = notifsRaw;
            }

            setNotifications(safeNotifs);

            const safeCount = typeof countRaw === 'number' ? countRaw : (countRaw?.count || 0);
            setUnreadCount(safeCount);

        } catch (error) {
            toast.error("Gagal memuat notifikasi");
            setNotifications([]); 
        }
    };

    const handleMarkRead = async (id: string) => {
        setNotifications(prevNotifs => 
            prevNotifs.map(n => 
                n.id === id ? {...n, is_read: true} : n
            )
        )
        
        const targetNotif = notifications.find(n => n.id === id)
        if(targetNotif && !targetNotif.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1))
        }

        try {
            await notificationService.markAsRead(id);
        } catch (error) {
            console.error("Gagal sinkronisasi read status", error);
            setNotifications(prevNotifs => 
                prevNotifs.map(n => 
                    n.id === id ? {...n, is_read: false} : n
                )
            )
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); 
        try {
            await notificationService.delete(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            const isUnread = notifications.find(n => n.id === id)?.is_read === null;
            if (isUnread) setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error("Gagal menghapus notifikasi");
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* --- TRIGGER BUTTON (BELL ICON) --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                )}
            </button>

            {/* --- DROPDOWN CONTENT --- */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                {unreadCount} baru
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {/* PENGAMAN: Cek Array.isArray dulu sebelum cek length */}
                        {!Array.isArray(notifications) || notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2 opacity-50" />
                                Tidak ada notifikasi.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notif) => (
                                <div 
                                    key={notif.id}
                                    // Logic klik tandai baca (gunakan !notif.is_read)
                                    onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                                    className={`
                                        p-4 flex gap-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50
                                        ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                                    `}
                                >
                                    {/* Indikator Bulat Biru jika belum dibaca */}
                                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                    
                                    <div className="flex-1 space-y-1">
                                        {/* JUDUL (Ambil dari Type) */}
                                        <p className={`text-sm ${!notif.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                            {getTitle(notif.type)}
                                        </p>
                                        
                                        {/* PESAN (Ambil langsung dari notif.message) */}
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {notif.message}
                                        </p>
                                        
                                        {/* WAKTU (Gunakan created_at_human dari API) */}
                                        <p className="text-[10px] text-slate-400 mt-1">
                                            {notif.created_at_human || "Baru saja"}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={(e) => handleDelete(e, notif.id)}
                                        className="self-start p-1 text-slate-300 hover:text-red-500 transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}