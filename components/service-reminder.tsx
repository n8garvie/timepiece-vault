"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ServiceReminderProps {
  service: {
    id: string
    watchName: string
    watchBrand: string
    watchImage?: string
    serviceType: string
    dueDate: Date
    overdue?: boolean
  }
  onComplete?: () => void
  onReschedule?: () => void
  className?: string
}

export function ServiceReminder({
  service,
  onComplete,
  onReschedule,
  className,
}: ServiceReminderProps) {
  const daysUntil = Math.ceil(
    (service.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )

  const isOverdue = daysUntil < 0 || service.overdue
  const isUrgent = daysUntil <= 7 && daysUntil >= 0

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 bg-[#141416] border rounded-xl transition-all duration-200",
        isOverdue
          ? "border-red-500/30 bg-red-500/5"
          : isUrgent
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-[#27272A] hover:border-[#3F3F46]",
        className
      )}
    >
      {/* Watch Thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-[#1C1C1F] flex-shrink-0 overflow-hidden">
        {service.watchImage ? (
          <img
            src={service.watchImage}
            alt={service.watchName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#3F3F46]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[#C9A962] text-xs font-medium uppercase tracking-wider">
          {service.watchBrand}
        </p>
        <h4 className="text-[#FAFAFA] font-medium truncate">
          {service.watchName}
        </h4>
        <p className="text-[#A1A1AA] text-sm">{service.serviceType}</p>
      </div>

      {/* Due Date */}
      <div className="text-right flex-shrink-0">
        <p
          className={cn(
            "text-sm font-medium",
            isOverdue
              ? "text-red-400"
              : isUrgent
              ? "text-amber-400"
              : "text-[#A1A1AA]"
          )}
        >
          {isOverdue
            ? `${Math.abs(daysUntil)} days overdue`
            : daysUntil === 0
            ? "Due today"
            : daysUntil === 1
            ? "Due tomorrow"
            : `${daysUntil} days left`}
        </p>
        <p className="text-[#71717A] text-xs">
          {service.dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onComplete}
          className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
          title="Mark Complete"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
        <button
          onClick={onReschedule}
          className="p-2 text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#27272A] rounded-lg transition-colors"
          title="Reschedule"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
