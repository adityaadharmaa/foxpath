import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { authService } from "@/services/authService";
import { Briefcase, ChevronDown, FileText, Home, LogOut, Menu, UserIcon, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function UserNavbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const navigate = useNavigate()
    const user = authService.getUser()

    const handleLogout = () => {
        authService.logout()
        navigate("/login")
    }

    const navLinks = [
        { name: "Beranda", href: "/user/home", icon: Home},
        { name: "Program Magang", href: "/user/programs", icon: Briefcase},
        { name: "Lamaran Saya", href: "/user/applications", icon: FileText},
    ]

   return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* LOGO */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/user/home')}>
                        <div className="h-9 w-9 bg-linear-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                            FP
                        </div>
                        <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight hidden sm:block">FoxPath</span>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => `
                                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${isActive 
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                                    }
                                `}
                            >
                                <item.icon size={16} />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                    
                    <ModeToggle/>
                    {/* USER PROFILE */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:shadow-sm transition-all bg-white dark:bg-slate-900"
                            >
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 overflow-hidden">
                                    {user?.username?.toUpperCase().charAt(0) || <UserIcon size={16} />}
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                                    {user?.username?.split(' ')[0]}
                                </span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.username}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <button onClick={() => navigate('/user/profile')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg">
                                            <UserIcon size={16} /> Profile Saya
                                        </button>
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                            <LogOut size={16} /> Keluar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU (Disederhanakan) */}
            {isMobileOpen && (
                 <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 p-4 space-y-2 shadow-lg">
                    {navLinks.map((item) => (
                        <NavLink 
                            key={item.name} to={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <item.icon size={18} /> {item.name}
                        </NavLink>
                    ))}
                    <div className="border-t border-slate-100 my-2 pt-2">
                        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 text-red-600 font-medium">
                            <LogOut size={18} /> Keluar
                        </button>
                    </div>
                 </div>
            )}
        </nav>
    );
}