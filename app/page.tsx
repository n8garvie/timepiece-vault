import Link from "next/link"
import { Watch, LayoutDashboard, Calendar, Shield, TrendingUp, Camera, Lock, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A962] to-[#A88B4A] flex items-center justify-center">
                <Watch className="w-6 h-6 text-[#0A0A0B]" />
              </div>
              <span className="font-serif text-xl font-semibold text-[#FAFAFA]">
                TimePiece Vault
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hidden sm:flex">
                Sign In
              </Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A962]/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full mb-8">
              <span className="w-2 h-2 bg-[#C9A962] rounded-full animate-pulse" />
              <span className="text-[#C9A962] text-sm font-medium">Trusted by Collectors Worldwide</span>
            </div>
            
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-[#FAFAFA] leading-tight">
              Your Collection,{" "}
              <span className="text-[#C9A962]">Perfectly Curated</span>
            </h1>
            
            <p className="mt-6 text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed">
              The intelligent platform for luxury watch collectors. Track value, manage service schedules, 
              and protect your investments—all in one elegant dashboard.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Start Your Collection
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                See How It Works
              </Button>
            </div>
          </div>

          {/* Hero Image / Demo */}
          <div className="mt-20 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#C9A962]/20 via-transparent to-[#C9A962]/20 blur-3xl opacity-30" />
            <div className="relative bg-[#141416] border border-[#27272A] rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[16/9] bg-gradient-to-br from-[#1C1C1F] to-[#0A0A0B] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#C9A962] to-[#A88B4A] flex items-center justify-center">
                    <Watch className="w-12 h-12 text-[#0A0A0B]" />
                  </div>
                  <p className="text-[#71717A] text-lg">Dashboard Preview</p>
                  <p className="text-[#52525B] text-sm mt-2">Sign in to view your collection</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#FAFAFA]">
              Everything You Need to{" "}
              <span className="text-[#C9A962]">Manage Your Collection</span>
            </h2>
            <p className="mt-4 text-lg text-[#A1A1AA]">
              Powerful tools designed specifically for serious watch collectors
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: LayoutDashboard,
                title: "Collection Management",
                description: "Organize your timepieces with detailed profiles, photos, and documentation all in one place."
              },
              {
                icon: TrendingUp,
                title: "Market Valuation",
                description: "Track value appreciation over time with real-time market data and historical trends."
              },
              {
                icon: Calendar,
                title: "Service Reminders",
                description: "Never miss a service date. Get intelligent reminders based on manufacturer recommendations."
              },
              {
                icon: Shield,
                title: "Insurance Documentation",
                description: "Generate comprehensive reports for insurance with all valuations and specifications."
              },
              {
                icon: Camera,
                title: "Photo Documentation",
                description: "High-resolution photo storage with automatic backup and organized gallery views."
              },
              {
                icon: Smartphone,
                title: "Mobile Access",
                description: "Access your collection anywhere with our responsive web app optimized for all devices."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 lg:p-8 bg-[#141416] border border-[#27272A] rounded-2xl hover:border-[#C9A962]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#C9A962]/10 flex items-center justify-center mb-4 group-hover:bg-[#C9A962]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[#C9A962]" />
                </div>
                <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#71717A] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-[#C9A962]/20 to-[#A88B4A]/10 border border-[#C9A962]/30 rounded-3xl p-8 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0A0A0B]/50" />
            <div className="relative">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#FAFAFA] mb-6">
                Ready to Elevate Your Collection?
              </h2>
              <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-8">
                Join thousands of collectors who trust TimePiece Vault to manage their most prized possessions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A962] to-[#A88B4A] flex items-center justify-center">
                <Watch className="w-5 h-5 text-[#0A0A0B]" />
              </div>
              <span className="font-serif text-lg font-semibold text-[#FAFAFA]">
                TimePiece Vault
              </span>
            </div>
            <p className="text-[#71717A] text-sm">
              © 2024 TimePiece Vault. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
