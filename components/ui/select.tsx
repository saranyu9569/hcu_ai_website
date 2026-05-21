import { SelectProps } from '@/lib';
import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"


const Select = ({ value, onValueChange, children, placeholder, className, disabled }: SelectProps) => {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  )
}

const SelectTrigger = ({ children, ...props }: any) => children

const SelectValue = ({ children }: { children: React.ReactNode }) => children

const SelectContent = ({ children }: { children: React.ReactNode }) => children

const SelectItem = ({ value, children, ...props }: any) => (
  <option value={value} {...props}>
    {children}
  </option>
)

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} 