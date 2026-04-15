"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  isActive?: boolean
  onClick?: () => void
  count?: number
}

export function FilterChip({
  label,
  isActive,
  onClick,
  count,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-[#C9A962] text-[#0A0A0B]"
          : "bg-[#1C1C1F] text-[#A1A1AA] border border-[#27272A] hover:border-[#3F3F46] hover:text-[#FAFAFA]"
      )}
    >
      {label}
      {count !== undefined && (
        <span
          className={cn(
            "px-1.5 py-0.5 text-xs rounded-full",
            isActive ? "bg-[#0A0A0B]/20" : "bg-[#27272A]"
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}
