import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#27272A] text-[#A1A1AA] hover:bg-[#3F3F46]",
        secondary:
          "border-transparent bg-[#1C1C1F] text-[#FAFAFA] hover:bg-[#27272A]",
        destructive:
          "border-transparent bg-red-500/10 text-red-400 hover:bg-red-500/20",
        outline: "text-[#A1A1AA] border-[#27272A]",
        success:
          "border-transparent bg-green-500/10 text-green-400 hover:bg-green-500/20",
        warning:
          "border-transparent bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
        gold:
          "border-transparent bg-[#C9A962]/10 text-[#C9A962] hover:bg-[#C9A962]/20",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
