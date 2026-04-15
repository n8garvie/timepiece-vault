import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get price history for a watch
export const history = query({
  args: { watchId: v.id("watches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify watch ownership
    const watch = await ctx.db.get(args.watchId);
    if (!watch || watch.ownerId !== userId) return [];

    const values = await ctx.db
      .query("marketValues")
      .withIndex("by_watch_date", (q) => q.eq("watchId", args.watchId))
      .order("asc")
      .collect();

    return values;
  },
});

// Record a new market value
export const record = mutation({
  args: {
    watchId: v.id("watches"),
    value: v.number(),
    currency: v.string(),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Verify watch ownership
    const watch = await ctx.db.get(args.watchId);
    if (!watch || watch.ownerId !== userId) {
      throw new Error("Watch not found or unauthorized");
    }

    const now = Date.now();
    const recordId = await ctx.db.insert("marketValues", {
      watchId: args.watchId,
      value: args.value,
      currency: args.currency,
      source: args.source || "user",
      recordedAt: now,
      notes: args.notes,
    });

    // Update watch with current market value
    await ctx.db.patch(args.watchId, {
      currentMarketValue: args.value,
      lastValuationDate: now,
      updatedAt: now,
    });

    return recordId;
  },
});

// Get latest market value
export const latest = query({
  args: { watchId: v.id("watches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Verify watch ownership
    const watch = await ctx.db.get(args.watchId);
    if (!watch || watch.ownerId !== userId) return null;

    const value = await ctx.db
      .query("marketValues")
      .withIndex("by_watch_date", (q) => q.eq("watchId", args.watchId))
      .order("desc")
      .first();

    return value;
  },
});

// Get market value statistics for a watch
export const getStats = query({
  args: { watchId: v.id("watches") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Verify watch ownership
    const watch = await ctx.db.get(args.watchId);
    if (!watch || watch.ownerId !== userId) return null;

    const values = await ctx.db
      .query("marketValues")
      .withIndex("by_watch_date", (q) => q.eq("watchId", args.watchId))
      .order("asc")
      .collect();

    if (values.length === 0) {
      return {
        currentValue: watch.purchasePrice,
        initialValue: watch.purchasePrice,
        highestValue: watch.purchasePrice,
        lowestValue: watch.purchasePrice,
        appreciation: 0,
        appreciationPercent: 0,
        dataPoints: 0,
      };
    }

    const currentValue = values[values.length - 1].value;
    const initialValue = values[0].value;
    const highestValue = Math.max(...values.map((v) => v.value));
    const lowestValue = Math.min(...values.map((v) => v.value));
    const appreciation = currentValue - initialValue;
    const appreciationPercent = (appreciation / initialValue) * 100;

    return {
      currentValue,
      initialValue,
      highestValue,
      lowestValue,
      appreciation,
      appreciationPercent,
      dataPoints: values.length,
    };
  },
});

// Delete a market value record
export const remove = mutation({
  args: { recordId: v.id("marketValues") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const record = await ctx.db.get(args.recordId);
    if (!record) throw new Error("Record not found");

    // Verify watch ownership
    const watch = await ctx.db.get(record.watchId);
    if (!watch || watch.ownerId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.recordId);

    // Update watch's current market value to the latest remaining record
    const latestValue = await ctx.db
      .query("marketValues")
      .withIndex("by_watch_date", (q) => q.eq("watchId", record.watchId))
      .order("desc")
      .first();

    await ctx.db.patch(record.watchId, {
      currentMarketValue: latestValue?.value,
      lastValuationDate: latestValue?.recordedAt,
      updatedAt: Date.now(),
    });

    return args.recordId;
  },
});
