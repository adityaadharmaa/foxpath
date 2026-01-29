import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: string;
  indiCatorColor?: string;
  iconClassName?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  indiCatorColor,
  iconClassName,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-2xl bg-white dark:bg-slate-900 border shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md",
        className || "border-slate-200 dark:border-slate-800",
      )}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>

          {(subtitle || trend) && (
            <div className="flex items-center gap-2 mt-1">
              {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
              {trend && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {trend}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-xl",
            iconClassName || "bg-slate-50 dark:bg-slate-800",
          )}
        >
          {icon}
        </div>
      </div>
      {indiCatorColor && (
        <div
          className={cn(
            "absolute top-6 right-16 w-2 h-2 rounded-full animate-pulse",
            indiCatorColor,
          )}
        ></div>
      )}
    </div>
  );
}
