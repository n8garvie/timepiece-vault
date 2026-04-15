"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhotoUpload } from "@/components/photo-upload"
import { ArrowLeft } from "lucide-react"

const brandOptions = [
  { value: "", label: "Select brand" },
  { value: "Rolex", label: "Rolex" },
  { value: "Omega", label: "Omega" },
  { value: "Cartier", label: "Cartier" },
  { value: "Patek Philippe", label: "Patek Philippe" },
  { value: "Audemars Piguet", label: "Audemars Piguet" },
  { value: "Tudor", label: "Tudor" },
  { value: "Breitling", label: "Breitling" },
  { value: "IWC", label: "IWC" },
  { value: "Jaeger-LeCoultre", label: "Jaeger-LeCoultre" },
  { value: "Other", label: "Other" },
]

const conditionOptions = [
  { value: "", label: "Select condition" },
  { value: "mint", label: "New/Unworn" },
  { value: "excellent", label: "Excellent" },
  { value: "very_good", label: "Very Good" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
]

const caseMaterialOptions = [
  { value: "", label: "Select material" },
  { value: "Stainless Steel", label: "Stainless Steel" },
  { value: "Yellow Gold", label: "Yellow Gold" },
  { value: "Rose Gold", label: "Rose Gold" },
  { value: "White Gold", label: "White Gold" },
  { value: "Platinum", label: "Platinum" },
  { value: "Titanium", label: "Titanium" },
  { value: "Ceramic", label: "Ceramic" },
  { value: "Two-Tone", label: "Two-Tone" },
]

const movementOptions = [
  { value: "", label: "Select movement" },
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "quartz", label: "Quartz" },
  { value: "tourbillon", label: "Tourbillon" },
]

const boxPapersOptions = [
  { value: "", label: "Select option" },
  { value: "full_set", label: "Full Set" },
  { value: "box_only", label: "Box Only" },
  { value: "papers_only", label: "Papers Only" },
  { value: "watch_only", label: "Watch Only" },
]

export default function AddWatchPage() {
  const router = useRouter()
  const createWatch = useMutation(api.watches.create)
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    reference: "",
    serialNumber: "",
    movementType: "",
    caseMaterial: "",
    caseDiameter: "",
    dialColor: "",
    braceletMaterial: "",
    yearOfProduction: "",
    purchaseDate: "",
    purchasePrice: "",
    purchaseCurrency: "USD",
    retailer: "",
    currentMarketValue: "",
    condition: "",
    boxPapers: "",
    notes: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createWatch({
        brand: formData.brand,
        model: formData.model,
        reference: formData.reference,
        serialNumber: formData.serialNumber || undefined,
        movementType: formData.movementType as any,
        caseMaterial: formData.caseMaterial,
        caseDiameter: parseFloat(formData.caseDiameter) || 0,
        dialColor: formData.dialColor,
        braceletMaterial: formData.braceletMaterial || undefined,
        yearOfProduction: formData.yearOfProduction
          ? parseInt(formData.yearOfProduction)
          : undefined,
        purchaseDate: formData.purchaseDate
          ? new Date(formData.purchaseDate).getTime()
          : Date.now(),
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        purchaseCurrency: formData.purchaseCurrency,
        retailer: formData.retailer || undefined,
        currentMarketValue: formData.currentMarketValue
          ? parseFloat(formData.currentMarketValue)
          : undefined,
        condition: formData.condition as any,
        boxPapers: formData.boxPapers as any,
        notes: formData.notes || undefined,
        photos: images,
      })

      router.push("/collection")
    } catch (error) {
      console.error("Error creating watch:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              href="/collection"
              className="flex items-center gap-1 text-[#71717A] hover:text-[#FAFAFA] transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
            <h1 className="font-serif text-3xl font-semibold text-[#FAFAFA]">
              Add New Watch
            </h1>
            <p className="text-[#A1A1AA] mt-1">
              Add a new timepiece to your collection
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/collection">Cancel</Link>
            </Button>
            <Button
              type="submit"
              form="add-watch-form"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Save Watch
            </Button>
          </div>
        </div>

        <form
          id="add-watch-form"
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Photos */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <PhotoUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={10}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Brand *"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    options={brandOptions}
                    required
                  />
                  <Input
                    label="Model *"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g., Submariner Date"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Reference Number *"
                    name="reference"
                    value={formData.reference}
                    onChange={handleChange}
                    placeholder="e.g., 126610LN"
                    required
                  />
                  <Input
                    label="Serial Number"
                    name="serialNumber"
                    value={formData.serialNumber}
                    onChange={handleChange}
                    placeholder="e.g., 1R8X1234"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Year of Production"
                    name="yearOfProduction"
                    type="number"
                    value={formData.yearOfProduction}
                    onChange={handleChange}
                    placeholder="e.g., 2021"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  <Select
                    label="Condition *"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    options={conditionOptions}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Purchase Information */}
            <Card>
              <CardHeader>
                <CardTitle>Purchase Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Purchase Date *"
                    name="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Purchase Price *"
                    name="purchasePrice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <Input
                  label="Retailer"
                  name="retailer"
                  value={formData.retailer}
                  onChange={handleChange}
                  placeholder="e.g., Authorized Dealer - New York"
                />
                <Input
                  label="Current Estimated Value"
                  name="currentMarketValue"
                  type="number"
                  value={formData.currentMarketValue}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    label="Movement Type *"
                    name="movementType"
                    value={formData.movementType}
                    onChange={handleChange}
                    options={movementOptions}
                    required
                  />
                  <Select
                    label="Case Material *"
                    name="caseMaterial"
                    value={formData.caseMaterial}
                    onChange={handleChange}
                    options={caseMaterialOptions}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Case Diameter (mm) *"
                    name="caseDiameter"
                    type="number"
                    value={formData.caseDiameter}
                    onChange={handleChange}
                    placeholder="e.g., 41"
                    min="0"
                    step="0.1"
                    required
                  />
                  <Input
                    label="Dial Color *"
                    name="dialColor"
                    value={formData.dialColor}
                    onChange={handleChange}
                    placeholder="e.g., Black"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Bracelet/Strap Material"
                    name="braceletMaterial"
                    value={formData.braceletMaterial}
                    onChange={handleChange}
                    placeholder="e.g., Oyster"
                  />
                  <Select
                    label="Box & Papers *"
                    name="boxPapers"
                    value={formData.boxPapers}
                    onChange={handleChange}
                    options={boxPapersOptions}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any personal notes about this timepiece—provenance, memories, acquisition story..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button variant="ghost" asChild>
                <Link href="/collection">Cancel</Link>
              </Button>
              <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                Save Watch
              </Button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
