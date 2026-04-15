import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-[#27272A] bg-[#1C1C1F] px-3 py-2 text-sm text-[#FAFAFA] ring-offset-background placeholder:text-[#52525B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A962] focus-visible:border-[#C9A962] disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-200",
            error && "border-red-500 focus-visible:ring-red-500 focus-visible:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-400">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
