import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="w-full relative group">
        {/* Start Icon Container */}
        {startIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none transition-colors peer-focus:text-blue-500 dark:peer-focus:text-blue-400 z-10">
            {startIcon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            // Base Styles & Light Mode
            "peer flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200",
            "placeholder:text-slate-400",
            "focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",

            // Dark Mode Styles
            "dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100",
            "dark:placeholder:text-slate-600",
            "dark:focus:border-blue-500 dark:focus:bg-slate-900 dark:focus:ring-blue-500/10",
            "dark:disabled:bg-slate-800 dark:disabled:text-slate-500",

            // Error States (Light & Dark)
            error && [
              "border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500/10",
              "dark:border-red-500/50 dark:bg-red-500/5 dark:text-red-400 dark:placeholder:text-red-900/50 dark:focus:border-red-500",
            ],

            // Icon Padding
            startIcon && "pl-11",
            endIcon && "pr-11",

            className,
          )}
          ref={ref}
          {...props}
        />

        {/* End Icon Container */}
        {endIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 transition-colors peer-focus:text-blue-500 dark:peer-focus:text-blue-400">
            {endIcon}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <span className="text-[11px] font-semibold text-red-500 dark:text-red-400 mt-1.5 ml-1 flex items-center gap-1 animate-in slide-in-from-top-1 fade-in duration-200">
            <span className="text-sm leading-none mt-0.5">•</span> {error}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
