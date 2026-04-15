import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user preferences
export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    // Return defaults if no preferences set
    if (!preferences) {
      return {
        ownerId: userId,
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        emailNotifications: true,
        serviceReminders: true,
        marketAlerts: false,
        reminderDays: [30, 60, 90],
      };
    }

    return preferences;
  },
});

// Create or update user preferences
export const upsert = mutation({
  args: {
    currency: v.optional(v.string()),
    dateFormat: v.optional(v.string()),
    emailNotifications: v.optional(v.boolean()),
    serviceReminders: v.optional(v.boolean()),
    marketAlerts: v.optional(v.boolean()),
    reminderDays: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: now,
      });
      return existing._id;
    } else {
      const preferencesId = await ctx.db.insert("userPreferences", {
        ownerId: userId,
        currency: args.currency || "USD",
        dateFormat: args.dateFormat || "MM/DD/YYYY",
        emailNotifications: args.emailNotifications ?? true,
        serviceReminders: args.serviceReminders ?? true,
        marketAlerts: args.marketAlerts ?? false,
        reminderDays: args.reminderDays || [30, 60, 90],
        createdAt: now,
        updatedAt: now,
      });
      return preferencesId;
    }
  },
});

// Initialize default preferences for new user
export const initialize = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();

    if (existing) return existing._id;

    const now = Date.now();
    const preferencesId = await ctx.db.insert("userPreferences", {
      ownerId: userId,
      currency: "USD",
      dateFormat: "MM/DD/YYYY",
      emailNotifications: true,
      serviceReminders: true,
      marketAlerts: false,
      reminderDays: [30, 60, 90],
      createdAt: now,
      updatedAt: now,
    });

    return preferencesId;
  },
});
