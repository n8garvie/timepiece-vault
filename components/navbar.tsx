"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Watch, LayoutDashboard, Settings, Menu, X, User, LogOut, Grid3X3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser, useClerk } from "@clerk/nextjs"

interface NavbarProps {
  user?: {
    name: string
    avatar?: string
  }
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const { user: clerkUser, isSignedIn } = useUser()
  const { signOut } = useClerk()

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/collection", label: "Collection", icon: Grid3X3 },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#27272A] bg-[#0A0A0B]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A962] to-[#A88B4A] flex items-center justify-center">
              <Watch className="w-6 h-6 text-[#0A0A0B]" />
            </div>
            <span className="font-serif text-xl font-semibold text-[#FAFAFA] hidden sm:block">
              TimePiece Vault
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(link.href)
                    ? "text-[#C9A962] bg-[#C9A962]/10"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1C1C1F]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Button asChild variant="default" size="sm" className="hidden sm:flex">
                  <Link href="/watches/new">
                    Add Watch
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 focus:outline-none">
                      <div className="w-9 h-9 rounded-full bg-[#1C1C1F] border border-[#27272A] overflow-hidden flex items-center justify-center">
                        {clerkUser?.imageUrl ? (
                          <img
                            src={clerkUser.imageUrl}
                            alt={clerkUser.firstName || "User"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-[#A1A1AA]" />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#141416] border-[#27272A]">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium text-[#FAFAFA]">
                        {clerkUser?.firstName || clerkUser?.username || "Collector"}
                      </p>
                      <p className="text-xs text-[#71717A]">
                        {clerkUser?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-[#27272A]" />
                    <DropdownMenuItem asChild className="text-[#A1A1AA] focus:text-[#FAFAFA] focus:bg-[#1C1C1F] cursor-pointer">
                      <Link href="/dashboard" as="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-[#A1A1AA] focus:text-[#FAFAFA] focus:bg-[#1C1C1F] cursor-pointer">
                      <Link href="/collection" as="/collection">
                        <Grid3X3 className="mr-2 h-4 w-4" />
                        My Collection
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-[#A1A1AA] focus:text-[#FAFAFA] focus:bg-[#1C1C1F] cursor-pointer">
                      <Link href="/settings" as="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-[#27272A]" />
                    <DropdownMenuItem 
                      onClick={() => signOut()}
                      className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild className="hidden sm:flex">
                  <Link href="/sign-in" as="/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/sign-up" as="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-[#A1A1AA] hover:text-[#FAFAFA]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#27272A] bg-[#0A0A0B]">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-[#C9A962] bg-[#C9A962]/10"
                    : "text-[#A1A1AA] hover:text-[#FAFAFA] hover:bg-[#1C1C1F]"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            {isSignedIn && (
              <Link
                href="/watches/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#0A0A0B] bg-[#C9A962] hover:bg-[#D4B978]"
              >
                <Watch className="w-5 h-5" />
                Add Watch
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
