import { AlertTriangle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
import { Button } from "./button"

interface ConfirmDialogprops {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "warning" | "info"
    isLoading?: boolean
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    variant = "danger",
    isLoading = false,
}: ConfirmDialogprops) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-100">
                <DialogHeader className="flex flex-col items-center text-center sm:text-center" >
                    <div className={`rounded-full p-3 mb-4 ${
                        variant === 'danger' ? 'bg-red-100 text-red-600' : 
                        variant === 'warning' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                        }`}>
                            <AlertTriangle size={24}/>
                    </div>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="mt-2 text-slate-500">{description}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`w-full sm:w-auto text-white ${
                            variant === 'danger' ? 'bg-red-600 hover:bg-red-700' :
                            variant === 'warning' ? 'bg-orange-600 hover:bg-orange-700' : 
                            'bg-blue-600 hover:bg-blue-700'    
                        }`}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}