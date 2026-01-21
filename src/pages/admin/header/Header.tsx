import { Menu, Search } from "lucide-react"
import NotificationDropdown from "../dropdown/NotificationDropdown"
import { ModeToggle } from "@/components/ui/mode-toggle"
import UserNav from "../nav/UserNav"

interface HeaderProps {
    setSidebarOpen: (open:boolean) => void
}

export default function Header({ setSidebarOpen }: HeaderProps) {
    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-4 flex-1">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500">
                    <Menu size={24} />
                </button>

                <div className="hidden md:flex items-center w-full max-w-md relative">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ease-in-out"
                    />
                    <div className="absolute right-3 flex items-center gap-1">
                        <kbd className="hidden sm:inline-block border border-slate-300 dark:border-slate-600 rounded px-1.5 text-[10px] font-medium text-slate-500">⌘K</kbd>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <NotificationDropdown />
                <div className="mt-1.5">
                    <ModeToggle />
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

                <UserNav/>
            </div>
        </header>
    )
}