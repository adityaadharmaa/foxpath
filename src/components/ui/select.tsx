import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectContextType {
    value: string
    onValueChange: (value: string, label: React.ReactNode) => void
    open: boolean
    setOpen: (open: boolean) => void
    selectedLabel: React.ReactNode
}

const SelectContext = React.createContext<SelectContextType | null>(null)

const useSelect = () => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("Select components must be used within a Select provider")
    return context
}

interface SelectProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Select: React.FC<SelectProps> = ({ children, value, defaultValue, onValueChange }) => {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")
  const [selectedLabel, setSelectedLabel] = React.useState<React.ReactNode>(null)

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const handleValueChange = React.useCallback((newValue: string, newLabel: React.ReactNode) => {
    if (!isControlled) {
      setInternalValue(newValue)
    }
    setSelectedLabel(newLabel)
    onValueChange?.(newValue)
  }, [isControlled, onValueChange])

  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const contextValue = React.useMemo(() => ({
    value: currentValue!,
    onValueChange: handleValueChange,
    open,
    setOpen,
    selectedLabel
  }), [currentValue, handleValueChange, open, selectedLabel])

  return (
    <SelectContext.Provider value={contextValue}
    >
      <div className="relative" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelect()

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", open && "rotate-180")} />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<HTMLSpanElement, { placeholder?: string }>(
  ({ placeholder }, ref) => {
    const { value, selectedLabel } = useSelect()
    
    return (
      <span ref={ref} className="pointer-events-none truncate text-slate-900 dark:text-slate-100">
        {value && selectedLabel ? selectedLabel : <span className="text-slate-400">{placeholder}</span>}
      </span>
    )
  }
)
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open } = useSelect()

    // if (!open) return null

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 min-w-32 overflow-hidden rounded-md border border-slate-200 bg-white text-slate-950 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
          "w-full top-full mt-1", 
          open ? "anmiate-in fade-in-0 zoom-in-95" : "hidden",
          className
        )}
        {...props}
      >
        <div className="p-1 w-full">{children}</div>
      </div>
    )
  }
)
SelectContent.displayName = "SelectContent"

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setOpen, selectedLabel } = useSelect()
    const isSelected = selectedValue === value

    // const { onValueChange: updateLabelOnly } = useSelect()
    React.useEffect(() => {
      if (isSelected && selectedLabel !== children) {
       onValueChange(value, children) 
      }
    }, [isSelected, value, children, onValueChange]) 

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900 data-disabled   :pointer-events-none data-disabled:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50",
          isSelected && "bg-slate-100 dark:bg-slate-800",
          className
        )}
        onClick={() => {
          onValueChange(value, children)
          setOpen(false)
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        <span className="truncate">{children}</span>
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }