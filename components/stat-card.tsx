"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-[#141416] border border-[#27272A] rounded-2xl p-6 transition-all duration-200 hover:border-[#3F3F46]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#71717A] text-sm font-medium uppercase tracking-wider">
            {title}
          </p>
          <p className="font-serif text-3xl font-semibold text-[#FAFAFA] mt-2">
            {value}
          </p>
          {subtitle && (
            <p className="text-[#A1A1AA] text-sm mt-1">{subtitle}</p>
          )}
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {change.isPositive ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-[#71717A] text-sm">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-[#1C1C1F] rounded-xl text-[#C9A962]">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
