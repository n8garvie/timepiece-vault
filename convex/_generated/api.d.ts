/* eslint-disable */
/**
 * Generated API for Convex functions.
 *
 * This file is generated automatically and should not be edited manually.
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as insurancePolicies from "../insurancePolicies.js";
import type * as marketValues from "../marketValues.js";
import type * as serviceRecords from "../serviceRecords.js";
import type * as userPreferences from "../userPreferences.js";
import type * as watches from "../watches.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  insurancePolicies: typeof insurancePolicies;
  marketValues: typeof marketValues;
  serviceRecords: typeof serviceRecords;
  userPreferences: typeof userPreferences;
  watches: typeof watches;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
