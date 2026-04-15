"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PhotoUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function PhotoUpload({
  images,
  onImagesChange,
  maxImages = 10,
  className,
}: PhotoUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // In a real implementation, this would upload to storage
    // For now, we'll create object URLs
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    onImagesChange([...images, ...newImages].slice(0, maxImages))
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const setPrimary = (index: number) => {
    const newImages = [images[index], ...images.filter((_, i) => i !== index)]
    onImagesChange(newImages)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <label className="block text-sm font-medium text-[#A1A1AA]">Photos</label>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Existing Images */}
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-square rounded-xl overflow-hidden group",
              index === 0 && "ring-2 ring-[#C9A962]"
            )}
          >
            <img
              src={image}
              alt={`Watch photo ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => setPrimary(index)}
                  className="p-2 bg-[#C9A962] text-[#0A0A0B] rounded-lg hover:bg-[#D4B978] transition-colors"
                  title="Set as primary"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                title="Remove"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Primary Badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2 px-2 py-1 bg-[#C9A962] text-[#0A0A0B] text-xs font-semibold rounded-full">
                Primary
              </div>
            )}
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <label className="relative aspect-square rounded-xl border-2 border-dashed border-[#3F3F46] hover:border-[#C9A962] bg-[#1C1C1F] cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 group">
            <svg
              className="w-8 h-8 text-[#71717A] group-hover:text-[#C9A962] transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-[#71717A] text-sm group-hover:text-[#A1A1AA] transition-colors">
              Add Photo
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <p className="text-[#71717A] text-xs">
        {images.length} of {maxImages} photos • First photo will be the primary
        image
      </p>
    </div>
  )
}
