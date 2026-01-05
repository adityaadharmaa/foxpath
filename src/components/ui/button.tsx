import * as React from "react"
import {Loader2} from "lucide-react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "primary" | "outline" | "ghost"
    isLoading?:  boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
            outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
            ghost: "hover:bg-gray-100 text-gray-600",
        }

        return (
            <button
                ref={ref}
                disabled={isLoading || disabled}
                className={cn(
                "inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
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