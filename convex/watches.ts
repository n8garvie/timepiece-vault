import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper to verify ownership
async function verifyWatchOwnership(ctx: any, watchId: string) {
  const watch = await ctx.db.get(watchId);
  if (!watch) throw new Error("Watch not found");
  const userId = await getAuthUserId(ctx);
  if (watch.ownerId !== userId) throw new Error("Unauthorized");
  return watch;
}

// List all watches for the current user
export const list = query({
  args: {
    includeArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let watches;
    if (args.includeArchived) {
      watches = await ctx.db
        .query("watches")
        .withIndex("by_owner", (q) => q.eq("ownerId", userId))
        .collect();
    } else {
      watches = await ctx.db
        .query("watches")
        .filter((q) => q.eq(q.field("ownerId"), userId))
        .filter((q) => q.eq(q.field("isArchived"), false))
        .collect();
    }

    return watches;
  },
});

// Get a single watch by ID
export const get = query({
  args: { watchId: v.id("watches") },
  handler: async (ctx, args) => {
    const watch = await ctx.db.get(args.watchId);
    if (!watch) return null;

    const userId = await getAuthUserId(ctx);
    if (watch.ownerId !== userId) return null;

    return watch;
  },
});

// Create a new watch
export const create = mutation({
  args: {
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
    photos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const now = Date.now();
    const watchId = await ctx.db.insert("watches", {
      ...args,
      ownerId: userId,
      isArchived: false,
      photos: args.photos || [],
      lastValuationDate: args.currentMarketValue ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });

    // If initial market value provided, record it
    if (args.currentMarketValue) {
      await ctx.db.insert("marketValues", {
        watchId,
        value: args.currentMarketValue,
        currency: args.purchaseCurrency,
        source: "user",
        recordedAt: now,
      });
    }

    return watchId;
  },
});

// Update a watch
export const update = mutation({
  args: {
    watchId: v.id("watches"),
    brand: v.optional(v.string()),
    model: v.optional(v.string()),
    reference: v.optional(v.string()),
    serialNumber: v.optional(v.string()),
    movementType: v.optional(
      v.union(
        v.literal("automatic"),
        v.literal("manual"),
        v.literal("quartz"),
        v.literal("tourbillon")
      )
    ),
    caseMaterial: v.optional(v.string()),
    caseDiameter: v.optional(v.number()),
    dialColor: v.optional(v.string()),
    braceletMaterial: v.optional(v.string()),
    yearOfProduction: v.optional(v.number()),
    limitedEdition: v.optional(
      v.object({
        isLimited: v.boolean(),
        number: v.optional(v.number()),
        totalPieces: v.optional(v.number()),
      })
    ),
    purchaseDate: v.optional(v.number()),
    purchasePrice: v.optional(v.number()),
    purchaseCurrency: v.optional(v.string()),
    retailer: v.optional(v.string()),
    currentMarketValue: v.optional(v.number()),
    condition: v.optional(
      v.union(
        v.literal("mint"),
        v.literal("excellent"),
        v.literal("very_good"),
        v.literal("good"),
        v.literal("fair")
      )
    ),
    boxPapers: v.optional(
      v.union(
        v.literal("full_set"),
        v.literal("box_only"),
        v.literal("papers_only"),
        v.literal("watch_only")
      )
    ),
    notes: v.optional(v.string()),
    photos: v.optional(v.array(v.string())),
    isArchived: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { watchId, ...updates } = args;
    const watch = await verifyWatchOwnership(ctx, watchId);

    const now = Date.now();
    const updateData: any = {
      ...updates,
      updatedAt: now,
    };

    // If market value is being updated, record it in history
    if (updates.currentMarketValue && updates.currentMarketValue !== watch.currentMarketValue) {
      updateData.lastValuationDate = now;
      await ctx.db.insert("marketValues", {
        watchId,
        value: updates.currentMarketValue,
        currency: watch.purchaseCurrency,
        source: "user",
        recordedAt: now,
      });
    }

    await ctx.db.patch(watchId, updateData);
    return watchId;
  },
});

// Delete a watch
export const remove = mutation({
  args: { watchId: v.id("watches") },
  handler: async (ctx, args) => {
    await verifyWatchOwnership(ctx, args.watchId);

    // Delete related records
    const serviceRecords = await ctx.db
      .query("serviceRecords")
      .withIndex("by_watch", (q) => q.eq("watchId", args.watchId))
      .collect();
    for (const record of serviceRecords) {
      await ctx.db.delete(record._id);
    }

    const marketValues = await ctx.db
      .query("marketValues")
      .withIndex("by_watch", (q) => q.eq("watchId", args.watchId))
      .collect();
    for (const value of marketValues) {
      await ctx.db.delete(value._id);
    }

    await ctx.db.delete(args.watchId);
    return args.watchId;
  },
});

// Search watches
export const search = query({
  args: {
    query: v.optional(v.string()),
    brand: v.optional(v.string()),
    condition: v.optional(
      v.union(
        v.literal("mint"),
        v.literal("excellent"),
        v.literal("very_good"),
        v.literal("good"),
        v.literal("fair")
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let watches = await ctx.db
      .query("watches")
      .filter((q) => q.eq(q.field("ownerId"), userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    if (args.query) {
      const lowerQuery = args.query.toLowerCase();
      watches = watches.filter(
        (w) =>
          w.brand.toLowerCase().includes(lowerQuery) ||
          w.model.toLowerCase().includes(lowerQuery) ||
          w.reference.toLowerCase().includes(lowerQuery)
      );
    }

    if (args.brand) {
      watches = watches.filter((w) =>
        w.brand.toLowerCase() === args.brand!.toLowerCase()
      );
    }

    if (args.condition) {
      watches = watches.filter((w) => w.condition === args.condition);
    }

    return watches;
  },
});

// Get collection statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const watches = await ctx.db
      .query("watches")
      .filter((q) => q.eq(q.field("ownerId"), userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .collect();

    const totalWatches = watches.length;
    const totalPurchaseValue = watches.reduce(
      (sum, w) => sum + w.purchasePrice,
      0
    );
    const totalMarketValue = watches.reduce(
      (sum, w) => sum + (w.currentMarketValue || w.purchasePrice),
      0
    );
    const appreciation = totalMarketValue - totalPurchaseValue;
    const appreciationPercent =
      totalPurchaseValue > 0
        ? (appreciation / totalPurchaseValue) * 100
        : 0;

    const brands = watches.reduce((acc, w) => {
      acc[w.brand] = (acc[w.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalWatches,
      totalPurchaseValue,
      totalMarketValue,
      appreciation,
      appreciationPercent,
      brands,
    };
  },
});
