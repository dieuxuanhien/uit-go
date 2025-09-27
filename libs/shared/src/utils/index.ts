import { Location } from "../types";

export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth radius in km
  const dLat = (loc2.latitude - loc1.latitude) * Math.PI / 180;
  const dLon = (loc2.longitude - loc1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(loc1.latitude * Math.PI / 180) * Math.cos(loc2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

export function estimateFare(distance: number, baseFare: number = 5000): number {
  const ratePerKm = 8000; // VND per km
  return baseFare + (distance * ratePerKm);
}

export function formatCurrency(amount: number, currency: "VND" | "USD"): string {
  if (currency === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency", 
    currency: "USD"
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
