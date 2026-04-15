"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface WatchCardProps {
  watch: {
    id: string
    brand: string
    model: string
    reference?: string
    imageUrl?: string
    estimatedValue?: number
    purchasePrice?: number
    year?: number
    condition?: string
  }
  onClick?: () => void
  className?: string
}

export function WatchCard({ watch, onClick, className }: WatchCardProps) {
  const valueChange =
    watch.estimatedValue && watch.purchasePrice
      ? ((watch.estimatedValue - watch.purchasePrice) / watch.purchasePrice) * 100
      : null

  return (
    <div
      onClick={onClick}
      className={cn(
        "group bg-[#141416] border border-[#27272A] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#3F3F46] hover:shadow-xl cursor-pointer",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gradient-to-br from-[#1C1C1F] to-[#0A0A0B] overflow-hidden">
        {watch.imageUrl ? (
          <img
            src={watch.imageUrl}
            alt={`${watch.brand} ${watch.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#3F3F46]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )}

        {/* Condition Badge */}
        {watch.condition && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-[#0A0A0B]/80 backdrop-blur-sm text-xs font-medium text-[#FAFAFA] rounded-full">
              {watch.condition}
            </span>
          </div>
        )}

        {/* Year Badge */}
        {watch.year && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-[#C9A962]/20 backdrop-blur-sm text-xs font-medium text-[#C9A962] rounded-full">
              {watch.year}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-[#C9A962] text-xs font-semibold uppercase tracking-wider">
          {watch.brand}
        </p>
        <h3 className="font-serif text-lg font-semibold text-[#FAFAFA] mt-1 line-clamp-1">
          {watch.model}
        </h3>
        {watch.reference && (
          <p className="text-[#71717A] text-sm mt-0.5">{watch.reference}</p>
        )}

        {/* Value Section */}
        {watch.estimatedValue && (
          <div className="mt-4 pt-4 border-t border-[#27272A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#71717A] text-xs">Current Value</p>
                <p className="text-[#FAFAFA] font-semibold">
                  ${watch.estimatedValue.toLocaleString()}
                </p>
              </div>
              {valueChange !== null && (
                <div className="text-right">
                  <p className="text-[#71717A] text-xs">Return</p>
                  <p
                    className={cn(
                      "font-medium",
                      valueChange >= 0 ? "text-green-400" : "text-red-400"
                    )}
                  >
                    {valueChange >= 0 ? "+" : ""}
                    {valueChange.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
