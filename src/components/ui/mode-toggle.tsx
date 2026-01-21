import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/theme-provider";
import { Button } from "./button";
import { Check, Monitor, Moon, Sun } from "lucide-react";

export function ModeToggle() {
    const {setTheme, theme} = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if(menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full w-10 h-10 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 relative"
            >
                <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${theme === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}
                text-slate-900 dark:text-slate-100
                `} />
                <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}
                text-slate-900 dark:text-slate-400    
                `} />
                <Monitor className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${theme === 'system' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}
                text-slate-900 dark:text-slate-400    
                `}/>
                <span className="sr-only">Toggle Theme</span>
            </Button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-950 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50">
                    {[
                        {name: "light", icon: Sun, label: "Light"},
                        {name: "dark", icon: Moon, label: "Dark"},
                        {name: "system", icon: Monitor, label: "System"},
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                setTheme(item.name as "light" | "dark" | "system")
                                setIsOpen(false)
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                theme === item.name ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-600 dark:text-slate-400"
                            }`}
                        >
                            <item.icon size={14} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {theme === item.name && <Check size={14} />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}