import { authService } from "@/services/authService";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [imgError, setImgError] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const [user, setUser] = useState(authService.getUser())

    const profilePicPath = user?.profile_picture || user?.profile?.profile_picture

    const handleLogout = () => {
        authService.logout()
        navigate("/login")
    }

    const handleClickProfile = () => {
        if (user?.role === "admin") {
            navigate("/admin/profile")
        } else {
            navigate("/profile")
        }
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const getAvatarUrl = (path: string) => {
        if(!path) return null
        if(path.startsWith('http')) return path
        return `${import.meta.env.API_BASE_URL || 'http://localhost:8000'}/storage/${path}`
    }

    useEffect(() => {
        setImgError(false)
    }, [])

    useEffect(() => {
        const syncUser = () => {
            setUser(authService.getUser())
        }

        window.addEventListener('user-updated', syncUser)

        return () => {
            window.removeEventListener('user-updated', syncUser)
        }
    }, [])

    // console.log("Data-user : ", user)

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors"
            >
                <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 overflow-hidden">
                    {profilePicPath && !imgError ? (
                        <img 
                            src={getAvatarUrl(profilePicPath)} 
                            alt={user.username} 
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="text-sm">
                            {user.username?.charAt(0).toUpperCase() || "A"}
                        </div>
                    )}
                </div>
                <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.username || "Admin"}</p>
                    <p className="text-xs text-slate-500">{user?.role || "Administrator"}</p>
                </div>
                <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{user?.username || "Admin"}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email || "admin@example.com"}</p>
                    </div>

                    <div className="px-2 space-y-1">
                        <button onClick={handleClickProfile} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <User size={16} /> Your Profile
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <Settings size={16} /> Settings
                        </button>
                    </div>

                    <div onClick={handleLogout} className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2 px-2">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}