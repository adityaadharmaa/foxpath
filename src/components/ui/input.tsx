import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({className, type, error, startIcon, endIcon, ...props}, ref) => {
        return (
            <div className="w-full relative">
                {startIcon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors peer-focus:text-blue-500">
                        {startIcon}
                    </div>
                )}

                <input 
                    type={type} 
                    className={cn(
                        "peer flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-all duration-200",
                        "placeholder:text-slate-400",
                        "focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10",
                        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
                        error && "border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus:border-red-500 focus:ring-red-500/10",
                        startIcon && "pl-11",
                        endIcon && "pr-11",

                        className
                    )}
                    ref={ref}
                    {...props}
                />

                {endIcon && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {endIcon}
                    </div>
                )}

                {error && (
                    <span className="text-[11px] font-medium text-red-500 mt-1.5 ml-1 flex items-center justify-center gap-1 animate-in slide-in-from-top-1 fade-in duration-200">
                        * {error}
                    </span>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"
export { Input }