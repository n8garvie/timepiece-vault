"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ValueChartProps {
  data: {
    date: string
    value: number
  }[]
  height?: number
  className?: string
}

export function ValueChart({ data, height = 200, className }: ValueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[#141416] border border-[#27272A] rounded-2xl",
          className
        )}
        style={{ height }}
      >
        <p className="text-[#71717A]">No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const valueRange = maxValue - minValue || 1

  // Calculate points for SVG path
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - ((d.value - minValue) / valueRange) * 80 - 10 // 10% padding top/bottom
      return `${x},${y}`
    })
    .join(" ")

  // Create area path
  const areaPoints = `0,100 ${points} 100,100`

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div
      className={cn(
        "bg-[#141416] border border-[#27272A] rounded-2xl p-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-lg font-semibold text-[#FAFAFA]">
            Value History
          </h3>
          <p className="text-[#71717A] text-sm">Estimated market value over time</p>
        </div>
        <div className="text-right">
          <p className="text-[#FAFAFA] font-semibold text-xl">
            {formatCurrency(data[data.length - 1].value)}
          </p>
          <p className="text-green-400 text-sm">
            +
            {(
              ((data[data.length - 1].value - data[0].value) / data[0].value) *
              100
            ).toFixed(1)}
            % all time
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: height - 100 }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="#27272A"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          ))}

          {/* Area gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9A962" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <polygon points={areaPoints} fill="url(#areaGradient)" />

          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#C9A962"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - ((d.value - minValue) / valueRange) * 80 - 10
            const isLast = i === data.length - 1

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={isLast ? 3 : 2}
                fill={isLast ? "#C9A962" : "#141416"}
                stroke="#C9A962"
                strokeWidth={isLast ? 0 : 1.5}
              />
            )
          })}
        </svg>

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-[#71717A] -ml-16 w-14 text-right">
          <span>{formatCurrency(maxValue)}</span>
          <span>{formatCurrency(minValue + valueRange * 0.75)}</span>
          <span>{formatCurrency(minValue + valueRange * 0.5)}</span>
          <span>{formatCurrency(minValue + valueRange * 0.25)}</span>
          <span>{formatCurrency(minValue)}</span>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4 text-xs text-[#71717A]">
        <span>{data[0].date}</span>
        <span>{data[Math.floor(data.length / 2)].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  )
}
