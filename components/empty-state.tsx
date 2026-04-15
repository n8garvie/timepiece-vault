"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#1C1C1F] flex items-center justify-center mb-6">
          <div className="text-[#C9A962]">{icon}</div>
        </div>
      )}
      <h3 className="font-serif text-xl font-semibold text-[#FAFAFA]">
        {title}
      </h3>
      {description && (
        <p className="text-[#A1A1AA] mt-2 max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-6 py-3 bg-[#C9A962] text-[#0A0A0B] font-medium rounded-lg hover:bg-[#D4B978] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
