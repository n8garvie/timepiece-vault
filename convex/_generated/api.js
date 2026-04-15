/* eslint-disable */
/**
 * Generated API for Convex functions.
 *
 * This file is generated automatically and should not be edited manually.
 */

import { anyApi } from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = {
  insurancePolicies: {
    create: anyApi,
    get: anyApi,
    getStats: anyApi,
    list: anyApi,
    remove: anyApi,
    update: anyApi,
  },
  marketValues: {
    getStats: anyApi,
    history: anyApi,
    latest: anyApi,
    record: anyApi,
    remove: anyApi,
  },
  serviceRecords: {
    create: anyApi,
    getStats: anyApi,
    listByWatch: anyApi,
    remove: anyApi,
    upcoming: anyApi,
    update: anyApi,
  },
  userPreferences: {
    get: anyApi,
    initialize: anyApi,
    upsert: anyApi,
  },
  watches: {
    create: anyApi,
    get: anyApi,
    getStats: anyApi,
    list: anyApi,
    remove: anyApi,
    search: anyApi,
    update: anyApi,
  },
};

export const internal = {};
