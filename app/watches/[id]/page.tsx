"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ValueChart } from "@/components/value-chart"
import { Tabs } from "@/components/tabs"
import { ArrowLeft, Edit, MoreVertical, Calendar, FileText } from "lucide-react"

// Mock data for value history
const mockValueHistory = [
  { date: "Jun 2021", value: 9850 },
  { date: "Sep 2021", value: 10500 },
  { date: "Dec 2021", value: 11200 },
  { date: "Mar 2022", value: 12800 },
  { date: "Jun 2022", value: 13500 },
  { date: "Sep 2022", value: 14200 },
  { date: "Dec 2022", value: 13800 },
  { date: "Mar 2023", value: 14500 },
  { date: "Jun 2023", value: 15200 },
  { date: "Sep 2023", value: 14800 },
  { date: "Dec 2023", value: 14500 },
  { date: "Mar 2024", value: 14500 },
]

// Mock service history
const mockServiceHistory = [
  {
    id: "1",
    date: "2023-06-15",
    type: "Full Service",
    provider: "Rolex Service Center",
    cost: 850,
    notes: "Complete overhaul, new gaskets, pressure tested",
    warranty: "2 years",
  },
  {
    id: "2",
    date: "2022-01-10",
    type: "Polishing",
    provider: "Local Watchmaker",
    cost: 150,
    notes: "Light polish, bracelet adjustment",
    warranty: null,
  },
]

// Mock insurance data
const mockInsurance = {
  provider: "Chubb",
  policyNumber: "WP-2024-123456",
  coverageAmount: 15000,
  deductible: 500,
  renewalDate: "2024-12-31",
  documents: ["Appraisal 2023.pdf", "Insurance Certificate.pdf"],
}

export default function WatchDetailPage() {
  const params = useParams()
  const watchId = params.id as string
  const watch = useQuery(api.watches.get, { watchId: watchId as any })
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedImage, setSelectedImage] = useState(0)

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "history", label: "Service History" },
    { id: "insurance", label: "Insurance" },
    { id: "documents", label: "Documents" },
  ]

  if (!watch) {
    return (
      <div className="min-h-screen bg-[#0A0A0B]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-[#71717A]">Loading...</p>
          </div>
        </main>
      </div>
    )
  }

  const valueChange = watch.currentMarketValue
    ? ((watch.currentMarketValue - watch.purchasePrice) / watch.purchasePrice) * 100
    : 0

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#71717A] mb-6">
          <Link
            href="/collection"
            className="flex items-center gap-1 hover:text-[#FAFAFA] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Collection
          </Link>
          <span>/</span>
          <span className="text-[#FAFAFA]">
            {watch.brand} {watch.model}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="gold" size="sm">
                {watch.brand}
              </Badge>
              <Badge variant="default" size="sm">
                {watch.condition}
              </Badge>
              <span className="text-[#71717A] text-sm">Ref. {watch.reference}</span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-[#FAFAFA]">
              {watch.model}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" asChild>
              <Link href={`/watches/${watchId}/edit` as any}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-[#1C1C1F] to-[#0A0A0B] rounded-2xl overflow-hidden border border-[#27272A]">
              {watch.photos && watch.photos.length > 0 ? (
                <img
                  src={watch.photos[selectedImage]}
                  alt={`${watch.brand} ${watch.model}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-[#3F3F46]"
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
            </div>
            {watch.photos && watch.photos.length > 1 && (
              <div className="flex gap-3">
                {watch.photos.map((photo: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[#C9A962]"
                        : "border-[#27272A] hover:border-[#3F3F46]"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${watch.brand} ${watch.model} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Value & Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Valuation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-4 mb-4">
                  <span className="font-serif text-4xl font-semibold text-[#FAFAFA]">
                    {watch.currentMarketValue
                      ? formatCurrency(watch.currentMarketValue)
                      : formatCurrency(watch.purchasePrice)}
                  </span>
                  {valueChange !== 0 && (
                    <span
                      className={`text-lg font-medium mb-1 ${
                        valueChange >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {valueChange >= 0 ? "+" : ""}
                      {valueChange.toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#27272A]">
                  <div>
                    <p className="text-[#71717A] text-sm">Purchase Price</p>
                    <p className="text-[#FAFAFA] font-medium">
                      {formatCurrency(watch.purchasePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#71717A] text-sm">Total Return</p>
                    <p className="text-green-400 font-medium">
                      {watch.currentMarketValue
                        ? `+${formatCurrency(watch.currentMarketValue - watch.purchasePrice)}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem label="Reference" value={watch.reference} />
                  <DetailItem
                    label="Serial"
                    value={watch.serialNumber || "Not recorded"}
                  />
                  <DetailItem
                    label="Year"
                    value={watch.yearOfProduction?.toString() || "Unknown"}
                  />
                  <DetailItem label="Condition" value={watch.condition} />
                  <DetailItem label="Case Material" value={watch.caseMaterial} />
                  <DetailItem label="Diameter" value={`${watch.caseDiameter}mm`} />
                  <DetailItem label="Dial Color" value={watch.dialColor} />
                  <DetailItem
                    label="Bracelet"
                    value={watch.braceletMaterial || "N/A"}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {watch.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#A1A1AA] leading-relaxed">{watch.notes}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SpecItem label="Movement" value={watch.movementType} />
                    <SpecItem label="Case Material" value={watch.caseMaterial} />
                    <SpecItem label="Case Diameter" value={`${watch.caseDiameter}mm`} />
                    <SpecItem label="Dial Color" value={watch.dialColor} />
                    <SpecItem
                      label="Bracelet"
                      value={watch.braceletMaterial || "N/A"}
                    />
                    <SpecItem
                      label="Box & Papers"
                      value={watch.boxPapers.replace(/_/g, " ")}
                    />
                  </div>
                </CardContent>
              </Card>

              <ValueChart data={mockValueHistory} height={300} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailItem
                    label="Purchase Date"
                    value={formatDate(watch.purchaseDate)}
                  />
                  <DetailItem
                    label="Purchase Price"
                    value={formatCurrency(watch.purchasePrice)}
                  />
                  <DetailItem
                    label="Currency"
                    value={watch.purchaseCurrency}
                  />
                  {watch.retailer && (
                    <DetailItem label="Retailer" value={watch.retailer} />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[#FAFAFA] font-medium">Due in 45 days</p>
                      <p className="text-[#71717A] text-sm">June 15, 2024</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    Schedule Service
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Service History</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockServiceHistory.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-[#FAFAFA] font-medium">
                          {service.type}
                        </h4>
                        <p className="text-[#71717A] text-sm">
                          {service.provider}
                        </p>
                      </div>
                      <span className="text-[#C9A962] font-medium">
                        ${service.cost}
                      </span>
                    </div>
                    <p className="text-[#A1A1AA] text-sm mb-3">{service.notes}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#71717A]">
                        {new Date(service.date).toLocaleDateString()}
                      </span>
                      {service.warranty && (
                        <Badge variant="success" size="sm">
                          {service.warranty} warranty
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "insurance" && (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DetailItem label="Provider" value={mockInsurance.provider} />
                <DetailItem
                  label="Policy Number"
                  value={mockInsurance.policyNumber}
                />
                <DetailItem
                  label="Coverage Amount"
                  value={formatCurrency(mockInsurance.coverageAmount)}
                />
                <DetailItem
                  label="Deductible"
                  value={formatCurrency(mockInsurance.deductible)}
                />
                <DetailItem
                  label="Renewal Date"
                  value={new Date(mockInsurance.renewalDate).toLocaleDateString()}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInsurance.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-[#1C1C1F] rounded-lg hover:bg-[#27272A] transition-colors cursor-pointer"
                    >
                      <FileText className="w-8 h-8 text-red-400" />
                      <span className="text-[#FAFAFA] flex-1">{doc}</span>
                      <svg
                        className="w-5 h-5 text-[#71717A]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "documents" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Documents</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Original Receipt.pdf",
                  "Warranty Card.pdf",
                  "Appraisal 2023.pdf",
                  "Service Records.pdf",
                  "Insurance Certificate.pdf",
                ].map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-[#1C1C1F] rounded-xl border border-[#27272A] hover:border-[#3F3F46] transition-colors cursor-pointer"
                  >
                    <FileText className="w-10 h-10 text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#FAFAFA] font-medium truncate">{doc}</p>
                      <p className="text-[#71717A] text-sm">2.4 MB</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[#71717A] text-sm">{label}</p>
      <p className="text-[#FAFAFA] font-medium">{value}</p>
    </div>
  )
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#27272A] last:border-0">
      <span className="text-[#71717A]">{label}</span>
      <span className="text-[#FAFAFA] font-medium capitalize">{value}</span>
    </div>
  )
}

// Need to import Plus for the documents tab
import { Plus } from "lucide-react"
