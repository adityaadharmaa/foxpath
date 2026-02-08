import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/theme-provider";
import { Button } from "./button";
import { Check, Monitor, Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      ref={menuRef}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-10 h-10 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-0"
      >
        {/* Kontainer Ikon dengan Transisi Halus */}
        <div className="relative h-5 w-5 flex items-center justify-center">
          <Sun
            className={`absolute h-full w-full transition-all duration-300 ${
              theme === "light"
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            } text-amber-500`}
          />
          <Moon
            className={`absolute h-full w-full transition-all duration-300 ${
              theme === "dark"
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-90 scale-0 opacity-0"
            } text-blue-400`}
          />
          <Monitor
            className={`absolute h-full w-full transition-all duration-300 ${
              theme === "system"
                ? "rotate-0 scale-100 opacity-100"
                : "rotate-90 scale-0 opacity-0"
            } text-slate-500 dark:text-slate-400`}
          />
        </div>
        <span className="sr-only">Toggle Theme</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          {[
            {
              name: "light",
              icon: Sun,
              label: "Light",
              color: "text-amber-500",
            },
            { name: "dark", icon: Moon, label: "Dark", color: "text-blue-400" },
            {
              name: "system",
              icon: Monitor,
              label: "System",
              color: "text-slate-500",
            },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setTheme(item.name as "light" | "dark" | "system");
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 ${
                theme === item.name
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <item.icon size={14} className={item.color} />
              <span className="flex-1 text-left uppercase tracking-tighter">
                {item.label}
              </span>
              {theme === item.name && (
                <Check size={14} className="animate-in zoom-in duration-300" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
