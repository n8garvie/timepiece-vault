"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

const DropdownMenuContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  )
}

function DropdownMenuTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: () => setOpen(!open),
    })
  }
  
  return (
    <button onClick={() => setOpen(!open)}>
      {children}
    </button>
  )
}

function DropdownMenuContent({ 
  children, 
  align = "center",
  className 
}: { 
  children: React.ReactNode
  align?: "start" | "center" | "end"
  className?: string 
}) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])
  
  if (!open) return null
  
  const alignClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-[#27272A] bg-[#141416] p-1 shadow-lg animate-fade-in",
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  )
}

function DropdownMenuItem({ 
  children, 
  className,
  onClick,
  asChild
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
  asChild?: boolean
}) {
  const { setOpen } = React.useContext(DropdownMenuContext)
  
  const handleClick = () => {
    onClick?.()
    setOpen(false)
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[#1C1C1F] focus:text-[#FAFAFA] hover:bg-[#1C1C1F]",
        className
      ),
      onClick: handleClick,
    })
  }
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors focus:bg-[#1C1C1F] focus:text-[#FAFAFA] hover:bg-[#1C1C1F]",
        className
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-[#27272A]", className)} />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
