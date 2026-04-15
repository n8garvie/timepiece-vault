import { SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
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
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="hidden sm:flex">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Get Started</Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </SignedIn>
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
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Start Your Collection
                  </Button>
                </SignUpButton>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                  See How It Works
                </Button>
              </SignedOut>
              <SignedIn>
                <Button size="lg" asChild className="w-full sm:w-auto px-8">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto px-8">
                  <Link href="/collection">View Collection</Link>
                </Button>
              </SignedIn>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#141416] border-y border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <Stat value="10,000+" label="Collections Managed" />
            <Stat value="$2B+" label="Assets Tracked" />
            <Stat value="50+" label="Countries" />
            <Stat value="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-semibold text-[#FAFAFA]">
              Everything You Need to Manage Your Collection
            </h2>
            <p className="mt-4 text-lg text-[#A1A1AA]">
              Comprehensive tools designed specifically for luxury watch collectors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Real-Time Market Intelligence"
              description="Access current market values powered by comprehensive auction data and dealer networks. Know what your collection is worth, anytime."
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6" />}
              title="Never Miss a Service Date"
              description="Automated reminders for manufacturer service intervals, warranty expirations, and maintenance schedules. Protect your investment."
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Complete Documentation"
              description="Generate comprehensive reports with photos, receipts, certificates, and valuations. Ready for insurers in seconds."
            />
            <FeatureCard
              icon={<LayoutDashboard className="w-6 h-6" />}
              title="Understand Your Portfolio"
              description="Visual analytics showing value trends, brand distribution, and acquisition history. Make informed decisions about future purchases."
            />
            <FeatureCard
              icon={<Camera className="w-6 h-6" />}
              title="Photo Gallery"
              description="High-resolution photo storage with automatic organization and tagging. Keep visual records of every timepiece."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Secure Storage"
              description="Bank-level encryption keeps your collection data and documents safe. Your privacy is our priority."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#141416]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-semibold text-[#FAFAFA]">
              From First Watch to Full Collection
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Add Your Timepieces"
              description="Simply photograph and document your watches. Our system guides you through capturing every important detail."
            />
            <StepCard
              number="02"
              title="Track & Monitor"
              description="Watch your dashboard come alive with valuations, service alerts, and collection analytics."
            />
            <StepCard
              number="03"
              title="Protect & Grow"
              description="Stay ahead of maintenance needs and market opportunities with intelligent notifications."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-[#0A0A0B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <svg className="w-12 h-12 text-[#C9A962] mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <blockquote className="font-serif text-2xl sm:text-3xl text-[#FAFAFA] leading-relaxed mb-8">
            "TimePiece Vault transformed how I manage my collection. I finally have visibility into the true value 
            of my watches and never miss a service date."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#1C1C1F] flex items-center justify-center">
              <span className="text-[#C9A962] font-semibold">MC</span>
            </div>
            <div className="text-left">
              <p className="text-[#FAFAFA] font-medium">Marcus Chen</p>
              <p className="text-[#71717A] text-sm">Collector since 2019</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#141416]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-semibold text-[#FAFAFA]">
            Your Collection Deserves Better
          </h2>
          <p className="mt-4 text-lg text-[#A1A1AA]">
            Join thousands of collectors who trust TimePiece Vault to protect and grow their passion.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto px-8">
                  Create Your Free Account
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button size="lg" asChild className="w-full sm:w-auto px-8">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
          </div>
          <p className="mt-4 text-sm text-[#71717A]">
            Bank-level security • Encrypted data • Private by design
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#0A0A0B] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A962] to-[#A88B4A] flex items-center justify-center">
                <Watch className="w-4 h-4 text-[#0A0A0B]" />
              </div>
              <span className="font-serif text-lg font-semibold text-[#FAFAFA]">
                TimePiece Vault
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#71717A]">
              <Link href="#" className="hover:text-[#FAFAFA] transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-[#FAFAFA] transition-colors">Terms</Link>
              <Link href="#" className="hover:text-[#FAFAFA] transition-colors">Contact</Link>
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

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group p-8 bg-[#141416] border border-[#27272A] rounded-2xl hover:border-[#3F3F46] transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#C9A962]/10 text-[#C9A962] flex items-center justify-center mb-6 group-hover:bg-[#C9A962]/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-semibold text-[#FAFAFA] mb-3">{title}</h3>
      <p className="text-[#A1A1AA] leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="relative p-8">
      <span className="font-serif text-6xl font-bold text-[#C9A962]/20">{number}</span>
      <h3 className="font-serif text-xl font-semibold text-[#FAFAFA] mt-4 mb-3">{title}</h3>
      <p className="text-[#A1A1AA] leading-relaxed">{description}</p>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-4xl lg:text-5xl font-semibold text-[#C9A962]">{value}</p>
      <p className="mt-2 text-[#A1A1AA]">{label}</p>
    </div>
  )
}
