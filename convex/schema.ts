import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  watches: defineTable({
    ownerId: v.string(),
    brand: v.string(),
    model: v.string(),
    reference: v.string(),
    serialNumber: v.optional(v.string()),
    movementType: v.union(
      v.literal("automatic"),
      v.literal("manual"),
      v.literal("quartz"),
      v.literal("tourbillon")
    ),
    caseMaterial: v.string(),
    caseDiameter: v.number(),
    dialColor: v.string(),
    braceletMaterial: v.optional(v.string()),
    yearOfProduction: v.optional(v.number()),
    limitedEdition: v.optional(
      v.object({
        isLimited: v.boolean(),
        number: v.optional(v.number()),
        totalPieces: v.optional(v.number()),
      })
    ),
    purchaseDate: v.number(),
    purchasePrice: v.number(),
    purchaseCurrency: v.string(),
    retailer: v.optional(v.string()),
    currentMarketValue: v.optional(v.number()),
    lastValuationDate: v.optional(v.number()),
    condition: v.union(
      v.literal("mint"),
      v.literal("excellent"),
      v.literal("very_good"),
      v.literal("good"),
      v.literal("fair")
    ),
    boxPapers: v.union(
      v.literal("full_set"),
      v.literal("box_only"),
      v.literal("papers_only"),
      v.literal("watch_only")
    ),
    notes: v.optional(v.string()),
    isArchived: v.boolean(),
    photos: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_archived", ["ownerId", "isArchived"])
    .index("by_brand", ["brand"]),

  serviceRecords: defineTable({
    watchId: v.id("watches"),
    ownerId: v.string(),
    serviceType: v.union(
      v.literal("full_service"),
      v.literal("polishing"),
      v.literal("battery_replacement"),
      v.literal("water_resistance_test"),
      v.literal("regulation"),
      v.literal("other")
    ),
    serviceDate: v.number(),
    serviceProvider: v.string(),
    cost: v.optional(v.number()),
    currency: v.optional(v.string()),
    description: v.optional(v.string()),
    nextServiceDue: v.optional(v.number()),
    warrantyUntil: v.optional(v.number()),
    photos: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_watch", ["watchId"])
    .index("by_owner", ["ownerId"])
    .index("by_next_service", ["ownerId", "nextServiceDue"]),

  marketValues: defineTable({
    watchId: v.id("watches"),
    value: v.number(),
    currency: v.string(),
    source: v.string(),
    recordedAt: v.number(),
    notes: v.optional(v.string()),
  })
    .index("by_watch", ["watchId"])
    .index("by_watch_date", ["watchId", "recordedAt"]),

  insurancePolicies: defineTable({
    ownerId: v.string(),
    policyNumber: v.string(),
    provider: v.string(),
    coverageAmount: v.number(),
    currency: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    deductible: v.optional(v.number()),
    documents: v.array(v.string()),
    watches: v.array(v.id("watches")),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_owner_active", ["ownerId", "isActive"]),

  userPreferences: defineTable({
    ownerId: v.string(),
    currency: v.string(),
    dateFormat: v.string(),
    emailNotifications: v.boolean(),
    serviceReminders: v.boolean(),
    marketAlerts: v.boolean(),
    reminderDays: v.array(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),
});
