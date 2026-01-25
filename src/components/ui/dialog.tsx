import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogContextProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextProps>({
    open: false,
    onOpenChange: () => {}
})

const useDialog = () => React.useContext(DialogContext)

interface DialogProps {
    children: React.ReactNode
    open?: boolean
    defaultOpen?: boolean
    onOpenChange?: (open: boolean) => void
}

const Dialog: React.FC<DialogProps> = ({
    children,
    open,
    defaultOpen = false,
    onOpenChange
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)

    const isControlled = open !== undefined
    const isOpen = isControlled ? open : uncontrolledOpen

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setUncontrolledOpen(newOpen)
        }
        onOpenChange?.(newOpen)
    }

    return (
        <DialogContext.Provider value={{open: !!isOpen, onOpenChange: handleOpenChange}}>
            {children}
        </DialogContext.Provider>
    )
}

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement>{
    className?: string
    children: React.ReactNode 
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
    ({className, children, ...props}, ref) => {
        const {open, onOpenChange} = useDialog()
        const containerRef = React.useRef<HTMLDivElement>(null)

        React.useEffect(() => {
            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === "Escape") onOpenChange(false)
            }
            if (open) document.addEventListener("keydown", handleEsc)
            return () => document.removeEventListener("keydown", handleEsc)
        }, [open, onOpenChange])

        if (!open) return null

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* BACKDROP / OVERLAY */}
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => onOpenChange(false)}
                />

                <div 
                    ref={ref}
                    className={cn(
                        "relative z-50 w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 duration-200 animate-in fade-in zoom-in-95 slide-in-from-bottom-2",
                        "mx-4 sm:mx-auto max-h-[85vh overflow-y-auto",
                        className
                    )}
                    {...props}
                >
                    {children}

                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="h-4 w-4"/>
                        {/* <span className="sr-oly overflow-hidden">Close</span> */}
                    </button>
                </div>
            </div>
        )
    }
)
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left mb-5",
        className
    )} 
    {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight text-slate-900 dark:text-white",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props}, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-slate-500 dark:text-slate-400", className)}
        {...props}
    />
))
DialogDescription.displayName = "DialogDescription"

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }