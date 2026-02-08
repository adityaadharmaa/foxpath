import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "info"
    | "success"
    | "warning";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyle =
      "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

    const variants = {
      // Dark: Menjadi putih dengan teks hitam agar kontras tinggi
      default:
        "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 shadow-sm",

      // Destructive: Merah yang lebih soft di dark mode
      destructive:
        "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 shadow-lg shadow-red-500/20",

      // Outline: Border yang adaptif
      outline:
        "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900",

      // Secondary: Abu-abu gelap di dark mode
      secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",

      // Ghost: Tanpa background, hanya hover effect
      ghost:
        "hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",

      // Tambahan varian untuk konsistensi dashboard Anda
      info: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/20",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/20",
      warning:
        "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20",
    };

    const sizes = {
      default: "h-11 py-2 px-6 text-sm",
      sm: "h-9 px-4 rounded-lg text-xs",
      lg: "h-12 px-10 rounded-2xl text-base",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(baseStyle, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Mohon tunggu...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
export { Button };
