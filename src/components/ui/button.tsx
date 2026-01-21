import * as React from "react"
import {Loader2} from "lucide-react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary"
    size? : "default" | "sm" | "lg" | "icon"
    isLoading?:  boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default",size = "default", isLoading, children, disabled, ...props }, ref) => {
        const baseStyle = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:opacity-50 disabled:pointer-event-none right-offset-white"

        const variants = {
            default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
            destructive: "bg-red-500 text-white hover:bg-red-600",
            outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
            secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
            ghost: "hover:bg-gray-100 text-gray-600",
        }

        const sizes = {
            default: "h-10 py-2 px-4 text-sm",
            sm: "h-9 px-3 rounded-md text-xs",
            lg: "h-11 px-8 rounded-md text-base",
            icon: "h-10 w-10"
        }

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                    baseStyle,
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"
export { Button } 