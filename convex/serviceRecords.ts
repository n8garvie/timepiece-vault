import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List service records for a watch
export const listByWatch = query({
  args: { watchId: v.id("watches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify watch ownership
    const watch = await ctx.db.get(args.watchId);
    if (!watch || watch.ownerId !== userId) return [];

    const records = await ctx.db
      .query("serviceRecords")
      .withIndex("by_watch", (q) => q.eq("watchId", args.watchId))
      .order("desc")
      .collect();

    return records;
  },
});

// Get upcoming services for user
export const upcoming = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const now = Date.now();
    const cutoff = args.days
      ? now + args.days * 24 * 60 * 60 * 1000
      : now + 365 * 24 * 60 * 60 * 1000;

    const records = await ctx.db
      .query("serviceRecords")
      .filter((q) => q.eq(q.field("ownerId"), userId))
      .filter((q) => q.lt(q.field("nextServiceDue"), cutoff))
      .filter((q) => q.gt(q.field("nextServiceDue"), now))
      .order("asc")
      .collect();

    // Enrich with watch details
    const enriched = await Promise.all(
      records.map(async (record) => {
        const watch = await ctx.db.get(record.watchId);
        return {
          ...record,
          watch: watch
            ? {
                brand: watch.brand,
                model: watch.model,
                reference: watch.reference,
                photos: watch.photos,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Create a service record
export const create = mutation({
  args: {
    watchId: v.id("watches"),
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
    photos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Verify watch ownership
    const watch = await ctx.db.get(args.watchId);
    if (!watch || watch.ownerId !== userId) {
      throw new Error("Watch not found or unauthorized");
    }

    const recordId = await ctx.db.insert("serviceRecords", {
      ...args,
      ownerId: userId,
      photos: args.photos || [],
      createdAt: Date.now(),
    });

    return recordId;
  },
});

// Update a service record
export const update = mutation({
  args: {
    recordId: v.id("serviceRecords"),
    serviceType: v.optional(
      v.union(
        v.literal("full_service"),
        v.literal("polishing"),
        v.literal("battery_replacement"),
        v.literal("water_resistance_test"),
        v.literal("regulation"),
        v.literal("other")
      )
    ),
    serviceDate: v.optional(v.number()),
    serviceProvider: v.optional(v.string()),
    cost: v.optional(v.number()),
    currency: v.optional(v.string()),
    description: v.optional(v.string()),
    nextServiceDue: v.optional(v.number()),
    warrantyUntil: v.optional(v.number()),
    photos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { recordId, ...updates } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const record = await ctx.db.get(recordId);
    if (!record || record.ownerId !== userId) {
      throw new Error("Record not found or unauthorized");
    }

    await ctx.db.patch(recordId, updates);
    return recordId;
  },
});

// Delete a service record
export const remove = mutation({
  args: { recordId: v.id("serviceRecords") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const record = await ctx.db.get(args.recordId);
    if (!record || record.ownerId !== userId) {
      throw new Error("Record not found or unauthorized");
    }

    await ctx.db.delete(args.recordId);
    return args.recordId;
  },
});

// Get service statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const records = await ctx.db
      .query("serviceRecords")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    const totalServices = records.length;
    const totalCost = records.reduce(
      (sum, r) => sum + (r.cost || 0),
      0
    );

    const servicesByType = records.reduce((acc, r) => {
      acc[r.serviceType] = (acc[r.serviceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const upcomingCount = records.filter(
      (r) => r.nextServiceDue && r.nextServiceDue > Date.now()
    ).length;

    return {
      totalServices,
      totalCost,
      servicesByType,
      upcomingCount,
    };
  },
});
