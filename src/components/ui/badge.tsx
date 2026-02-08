import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "border-transparent bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900",

    secondary:
      "border-transparent bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",

    destructive:
      "border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",

    outline: "text-slate-600 border-slate-200 dark:border-slate-800",

    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",

    warning:
      "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",

    info: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 cursor-default",

        variants[variant],

        className,
      )}
      {...props}
    />
  );
}
