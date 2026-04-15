import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(
  timestamp: number,
  format: string = "MM/DD/YYYY"
): string {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "MM/DD/YYYY":
    default:
      return `${month}/${day}/${year}`;
  }
}

export function calculateAppreciation(
  purchasePrice: number,
  currentValue: number
): { amount: number; percent: number } {
  const amount = currentValue - purchasePrice;
  const percent = purchasePrice > 0 ? (amount / purchasePrice) * 100 : 0;
  return { amount, percent };
}

export const CONDITION_LABELS: Record<string, string> = {
  mint: "Mint",
  excellent: "Excellent",
  very_good: "Very Good",
  good: "Good",
  fair: "Fair",
};

export const BOX_PAPERS_LABELS: Record<string, string> = {
  full_set: "Full Set",
  box_only: "Box Only",
  papers_only: "Papers Only",
  watch_only: "Watch Only",
};

export const MOVEMENT_TYPE_LABELS: Record<string, string> = {
  automatic: "Automatic",
  manual: "Manual",
  quartz: "Quartz",
  tourbillon: "Tourbillon",
};

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  full_service: "Full Service",
  polishing: "Polishing",
  battery_replacement: "Battery Replacement",
  water_resistance_test: "Water Resistance Test",
  regulation: "Regulation",
  other: "Other",
};
