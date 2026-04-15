"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { WatchCard } from "@/components/watch-card"
import { SearchBar } from "@/components/search-bar"
import { FilterChip } from "@/components/filter-chip"
import { EmptyState } from "@/components/empty-state"
import { Tabs } from "@/components/tabs"
import { Plus, Grid3X3, List, SlidersHorizontal } from "lucide-react"

const brands = ["All", "Rolex", "Omega", "Cartier", "Patek Philippe", "Audemars Piguet", "Tudor"]
const conditions = ["All", "New", "Excellent", "Very Good", "Good", "Fair"]

export default function CollectionPage() {
  const watches = useQuery(api.watches.list, { includeArchived: false })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("All")
  const [selectedCondition, setSelectedCondition] = useState("All")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")

  const tabs = [
    { id: "all", label: "All Watches", count: watches?.length || 0 },
    { id: "favorites", label: "Favorites", count: 0 },
    { id: "forsale", label: "For Sale", count: 0 },
    { id: "archived", label: "Archived", count: 0 },
  ]

  // Filter watches
  const filteredWatches =
    watches?.filter((watch) => {
      const matchesSearch =
        searchQuery === "" ||
        watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.reference.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBrand = selectedBrand === "All" || watch.brand === selectedBrand
      const matchesCondition = selectedCondition === "All" || watch.condition === selectedCondition.toLowerCase().replace(" ", "_")

      return matchesSearch && matchesBrand && matchesCondition
    }) || []

  const totalValue = filteredWatches.reduce(
    (sum, w) => sum + (w.currentMarketValue || w.purchasePrice),
    0
  )

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-[#FAFAFA]">
              Your Collection
            </h1>
            <p className="text-[#A1A1AA] mt-1">
              {watches?.length || 0} watches • {formatCurrency(totalValue)} total value
            </p>
          </div>
          <Button asChild>
            <Link href="/watches/new">
              <Plus className="w-5 h-5 mr-2" />
              Add Watch
            </Link>
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              placeholder="Search by brand, model, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
            />
          </div>
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center bg-[#1C1C1F] rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#27272A] text-[#FAFAFA]"
                    : "text-[#71717A] hover:text-[#FAFAFA]"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-[#27272A] text-[#FAFAFA]"
                    : "text-[#71717A] hover:text-[#FAFAFA]"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select className="appearance-none bg-[#1C1C1F] border border-[#27272A] text-[#FAFAFA] rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-[#C9A962]">
                <option>Sort by: Recently Added</option>
                <option>Sort by: Value (High to Low)</option>
                <option>Sort by: Value (Low to High)</option>
                <option>Sort by: Brand (A-Z)</option>
                <option>Sort by: Year (Newest)</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-[#71717A] text-sm py-2">Brand:</span>
          {brands.map((brand) => (
            <FilterChip
              key={brand}
              label={brand}
              isActive={selectedBrand === brand}
              onClick={() => setSelectedBrand(brand)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-[#71717A] text-sm py-2">Condition:</span>
          {conditions.map((condition) => (
            <FilterChip
              key={condition}
              label={condition}
              isActive={selectedCondition === condition}
              onClick={() => setSelectedCondition(condition)}
            />
          ))}
        </div>

        {/* Results */}
        {filteredWatches.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredWatches.map((watch) => (
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
            icon={
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
            title={watches?.length === 0 ? "Your Collection Starts Here" : "No watches found"}
            description={
              watches?.length === 0
                ? "This is where your timepieces live. Each watch gets its own detailed profile with photos, documents, service history, and current market value."
                : "Try adjusting your search or filters to find what you're looking for."
            }
            action={
              watches?.length === 0
                ? {
                    label: "Add Your First Watch",
                    onClick: () => {},
                  }
                : {
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchQuery("")
                      setSelectedBrand("All")
                      setSelectedCondition("All")
                    },
                  }
            }
          />
        )}
      </main>
    </div>
  )
}
