"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/stat-card"
import { WatchCard } from "@/components/watch-card"
import { ServiceReminder } from "@/components/service-reminder"
import { EmptyState } from "@/components/empty-state"
import { DollarSign, Watch, Settings, Shield, FileText, Plus } from "lucide-react"

export default function DashboardPage() {
  const { user } = useUser()
  const watches = useQuery(api.watches.list, { includeArchived: false })
  const stats = useQuery(api.watches.getStats)

  // Calculate recent watches (last 3 added)
  const recentWatches = watches?.slice(0, 3) || []

  // Mock service reminders for demo
  const serviceReminders = [
    {
      id: "1",
      watchName: "Submariner Date",
      watchBrand: "Rolex",
      serviceType: "Full Service",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      watchName: "Royal Oak",
      watchBrand: "Audemars Piguet",
      serviceType: "Water Resistance Check",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      overdue: true,
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#FAFAFA]">
              Welcome back, {user?.firstName || "Collector"}
            </h1>
            <p className="text-[#A1A1AA] mt-1">
              Here&apos;s what&apos;s happening with your collection
            </p>
          </div>
          <Button asChild>
            <Link href="/watches/new">
              <Plus className="w-5 h-5 mr-2" />
              Add Watch
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Collection Value"
            value={stats ? formatCurrency(stats.totalMarketValue) : "$0"}
            change={
              stats && stats.appreciationPercent !== 0
                ? { value: Number(stats.appreciationPercent.toFixed(1)), isPositive: stats.appreciation >= 0 }
                : undefined
            }
            icon={<DollarSign className="w-6 h-6" />}
          />
          <StatCard
            title="Watches in Collection"
            value={stats?.totalWatches || 0}
            subtitle={watches && watches.length > 0 ? "+1 this month" : "Start building"}
            icon={<Watch className="w-6 h-6" />}
          />
          <StatCard
            title="Upcoming Services"
            value={serviceReminders.length}
            subtitle="1 overdue"
            icon={<Settings className="w-6 h-6" />}
          />
          <StatCard
            title="Insurance Coverage"
            value={stats ? formatCurrency(stats.totalMarketValue * 1.1) : "$0"}
            subtitle="Full coverage"
            icon={<Shield className="w-6 h-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Reminders */}
          <div className="lg:col-span-2">
            <div className="bg-[#141416] border border-[#27272A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#FAFAFA]">
                    Service Reminders
                  </h2>
                  <p className="text-[#71717A] text-sm mt-1">
                    Upcoming maintenance and service schedules
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              {serviceReminders.length > 0 ? (
                <div className="space-y-3">
                  {serviceReminders.map((service) => (
                    <ServiceReminder
                      key={service.id}
                      service={service}
                      onComplete={() => console.log("Complete", service.id)}
                      onReschedule={() => console.log("Reschedule", service.id)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Settings className="w-6 h-6" />}
                  title="All Caught Up"
                  description="No upcoming service dates. Your collection is in great shape."
                />
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-[#141416] border border-[#27272A] rounded-2xl p-6">
              <h2 className="font-serif text-xl font-semibold text-[#FAFAFA] mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <QuickActionButton
                  icon={<Plus className="w-5 h-5" />}
                  label="Add New Watch"
                  description="Log a new timepiece"
                  href="/watches/new"
                />
                <QuickActionButton
                  icon={<FileText className="w-5 h-5" />}
                  label="Generate Report"
                  description="Export collection data"
                  href="#"
                />
                <QuickActionButton
                  icon={<Shield className="w-5 h-5" />}
                  label="Update Insurance"
                  description="Review coverage details"
                  href="#"
                />
              </div>
            </div>

            {/* Collection Health */}
            <div className="bg-[#141416] border border-[#27272A] rounded-2xl p-6">
              <h2 className="font-serif text-xl font-semibold text-[#FAFAFA] mb-4">
                Collection Health
              </h2>
              <div className="space-y-4">
                <HealthBar label="Insured" value={stats?.totalWatches || 0} total={stats?.totalWatches || 1} />
                <HealthBar label="With Photos" value={Math.floor((stats?.totalWatches || 0) * 0.8)} total={stats?.totalWatches || 1} />
                <HealthBar label="With Papers" value={Math.floor((stats?.totalWatches || 0) * 0.9)} total={stats?.totalWatches || 1} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Additions */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#FAFAFA]">
                Recent Additions
              </h2>
              <p className="text-[#71717A] text-sm mt-1">
                Latest watches added to your collection
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/collection">View Collection</Link>
            </Button>
          </div>
          {recentWatches.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWatches.map((watch) => (
                <WatchCard
                  key={watch._id}
                  watch={{
                    id: watch._id,
                    brand: watch.brand,
                    model: watch.model,
                    reference: watch.reference,
                    estimatedValue: watch.currentMarketValue || watch.purchasePrice,
                    purchasePrice: watch.purchasePrice,
                    year: watch.yearOfProduction,
                    condition: watch.condition,
                  }}
                  onClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Watch className="w-6 h-6" />}
              title="Your Collection Awaits"
              description="Start building your digital vault by adding your first timepiece. We'll help you track its value and keep it in perfect condition."
              action={{
                label: "Add Your First Watch",
                onClick: () => {},
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function QuickActionButton({
  icon,
  label,
  description,
  href,
}: {
  icon: React.ReactNode
  label: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href as any}
      className="w-full flex items-center gap-4 p-4 bg-[#1C1C1F] rounded-xl hover:bg-[#27272A] transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-[#C9A962]/10 text-[#C9A962] flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[#FAFAFA] font-medium">{label}</p>
        <p className="text-[#71717A] text-sm">{description}</p>
      </div>
    </Link>
  )
}

function HealthBar({
  label,
  value,
  total,
}: {
  label: string
  value: number
  total: number
}) {
  const percentage = Math.min((value / total) * 100, 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#A1A1AA] text-sm">{label}</span>
        <span className="text-[#FAFAFA] text-sm font-medium">
          {value}/{total}
        </span>
      </div>
      <div className="h-2 bg-[#1C1C1F] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#C9A962] to-[#D4B978] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
