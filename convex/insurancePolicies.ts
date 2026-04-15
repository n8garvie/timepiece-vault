import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// List all insurance policies for user
export const list = query({
  args: {
    includeInactive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let policies;
    if (args.includeInactive) {
      policies = await ctx.db
        .query("insurancePolicies")
        .withIndex("by_owner", (q) => q.eq("ownerId", userId))
        .collect();
    } else {
      policies = await ctx.db
        .query("insurancePolicies")
        .filter((q) => q.eq(q.field("ownerId"), userId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();
    }

    // Enrich with watch details
    const enriched = await Promise.all(
      policies.map(async (policy) => {
        const watches = await Promise.all(
          policy.watches.map(async (watchId: any) => {
            const watch = await ctx.db.get(watchId);
            return watch
              ? {
                  _id: watch._id,
                  brand: watch.brand,
                  model: watch.model,
                  reference: watch.reference,
                  currentMarketValue: watch.currentMarketValue,
                }
              : null;
          })
        );

        return {
          ...policy,
          watches: watches.filter(Boolean),
        };
      })
    );

    return enriched;
  },
});

// Get a single policy
export const get = query({
  args: { policyId: v.id("insurancePolicies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const policy = await ctx.db.get(args.policyId);
    if (!policy || policy.ownerId !== userId) return null;

    // Enrich with watch details
    const watches = await Promise.all(
      policy.watches.map(async (watchId: any) => {
        const watch = await ctx.db.get(watchId);
        return watch
          ? {
              _id: watch._id,
              brand: watch.brand,
              model: watch.model,
              reference: watch.reference,
              currentMarketValue: watch.currentMarketValue,
              photos: watch.photos,
            }
          : null;
      })
    );

    return {
      ...policy,
      watches: watches.filter(Boolean),
    };
  },
});

// Create an insurance policy
export const create = mutation({
  args: {
    policyNumber: v.string(),
    provider: v.string(),
    coverageAmount: v.number(),
    currency: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    deductible: v.optional(v.number()),
    documents: v.optional(v.array(v.string())),
    watches: v.array(v.id("watches")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    // Verify all watches belong to user
    for (const watchId of args.watches) {
      const watch = await ctx.db.get(watchId);
      if (!watch || watch.ownerId !== userId) {
        throw new Error(`Watch ${watchId} not found or unauthorized`);
      }
    }

    const now = Date.now();
    const policyId = await ctx.db.insert("insurancePolicies", {
      ...args,
      ownerId: userId,
      documents: args.documents || [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    return policyId;
  },
});

// Update an insurance policy
export const update = mutation({
  args: {
    policyId: v.id("insurancePolicies"),
    policyNumber: v.optional(v.string()),
    provider: v.optional(v.string()),
    coverageAmount: v.optional(v.number()),
    currency: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    deductible: v.optional(v.number()),
    documents: v.optional(v.array(v.string())),
    watches: v.optional(v.array(v.id("watches"))),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { policyId, ...updates } = args;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const policy = await ctx.db.get(policyId);
    if (!policy || policy.ownerId !== userId) {
      throw new Error("Policy not found or unauthorized");
    }

    // Verify all watches belong to user if updating watches
    if (updates.watches) {
      for (const watchId of updates.watches) {
        const watch = await ctx.db.get(watchId);
        if (!watch || watch.ownerId !== userId) {
          throw new Error(`Watch ${watchId} not found or unauthorized`);
        }
      }
    }

    await ctx.db.patch(policyId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return policyId;
  },
});

// Delete an insurance policy
export const remove = mutation({
  args: { policyId: v.id("insurancePolicies") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const policy = await ctx.db.get(args.policyId);
    if (!policy || policy.ownerId !== userId) {
      throw new Error("Policy not found or unauthorized");
    }

    await ctx.db.delete(args.policyId);
    return args.policyId;
  },
});

// Get insurance statistics
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const policies = await ctx.db
      .query("insurancePolicies")
      .filter((q) => q.eq(q.field("ownerId"), userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const totalCoverage = policies.reduce(
      (sum, p) => sum + p.coverageAmount,
      0
    );
    const totalWatchesCovered = policies.reduce(
      (sum, p) => sum + p.watches.length,
      0
    );

    const expiringSoon = policies.filter(
      (p) => p.endDate < Date.now() + 30 * 24 * 60 * 60 * 1000
    ).length;

    return {
      totalPolicies: policies.length,
      totalCoverage,
      totalWatchesCovered,
      expiringSoon,
    };
  },
});
