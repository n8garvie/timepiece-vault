import { z } from "zod";

export const watchSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  reference: z.string().min(1, "Reference is required"),
  serialNumber: z.string().optional(),
  movementType: z.enum(["automatic", "manual", "quartz", "tourbillon"]),
  caseMaterial: z.string().min(1, "Case material is required"),
  caseDiameter: z.number().positive("Case diameter must be positive"),
  dialColor: z.string().min(1, "Dial color is required"),
  braceletMaterial: z.string().optional(),
  yearOfProduction: z.number().min(1800).max(new Date().getFullYear()).optional(),
  limitedEdition: z
    .object({
      isLimited: z.boolean(),
      number: z.number().optional(),
      totalPieces: z.number().optional(),
    })
    .optional(),
  purchaseDate: z.number(),
  purchasePrice: z.number().positive("Purchase price must be positive"),
  purchaseCurrency: z.string().default("USD"),
  retailer: z.string().optional(),
  currentMarketValue: z.number().positive().optional(),
  condition: z.enum(["mint", "excellent", "very_good", "good", "fair"]),
  boxPapers: z.enum(["full_set", "box_only", "papers_only", "watch_only"]),
  notes: z.string().optional(),
  photos: z.array(z.string()).default([]),
});

export const serviceRecordSchema = z.object({
  watchId: z.string(),
  serviceType: z.enum([
    "full_service",
    "polishing",
    "battery_replacement",
    "water_resistance_test",
    "regulation",
    "other",
  ]),
  serviceDate: z.number(),
  serviceProvider: z.string().min(1, "Service provider is required"),
  cost: z.number().positive().optional(),
  currency: z.string().default("USD"),
  description: z.string().optional(),
  nextServiceDue: z.number().optional(),
  warrantyUntil: z.number().optional(),
  photos: z.array(z.string()).default([]),
});

export const insurancePolicySchema = z.object({
  policyNumber: z.string().min(1, "Policy number is required"),
  provider: z.string().min(1, "Provider is required"),
  coverageAmount: z.number().positive("Coverage amount must be positive"),
  currency: z.string().default("USD"),
  startDate: z.number(),
  endDate: z.number(),
  deductible: z.number().positive().optional(),
  documents: z.array(z.string()).default([]),
  watches: z.array(z.string()),
});

export const userPreferencesSchema = z.object({
  currency: z.string().default("USD"),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]).default("MM/DD/YYYY"),
  emailNotifications: z.boolean().default(true),
  serviceReminders: z.boolean().default(true),
  marketAlerts: z.boolean().default(false),
  reminderDays: z.array(z.number()).default([30, 60, 90]),
});

export type WatchInput = z.infer<typeof watchSchema>;
export type ServiceRecordInput = z.infer<typeof serviceRecordSchema>;
export type InsurancePolicyInput = z.infer<typeof insurancePolicySchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
