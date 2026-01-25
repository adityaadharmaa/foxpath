import { Book, BookA, Briefcase, File, FileText, LayoutDashboard, Settings, ShieldCheck, Users, X } from "lucide-react"
import { NavLink } from "react-router-dom"

interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "User Management", href: "/admin/applicants", icon: Users },
        { name: "Role Management", href: "/admin/roles", icon: ShieldCheck },
        { name: "Program Management ", href: "/admin/programs", icon: Briefcase },
        { name: "Applicants Management ", href: "/admin/applications", icon: FileText },
        { name: "Criteria Management ", href: "/admin/criteria", icon: BookA },
    ]

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`
            }>
                <div className="h-15 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                        FP
                    </div>
                    <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">FoxPath</span>
                    <button onClick={() => setIsOpen(false)} className="ml-auto md:hidden text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
                    <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">
                        Main Menu
                    </p>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={({isActive}) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive 
                                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }
                            `}
                        >
                            <item.icon size={20} strokeWidth={1.5}/>
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    )
}