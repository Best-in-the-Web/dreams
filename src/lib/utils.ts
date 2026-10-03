import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { brand } from "./brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(czk: number): string {
  return `${czk.toLocaleString("cs-CZ")} ${brand.currency}`;
}

export function parseJsonArray<T = string>(value: string | null | undefined): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toJson(value: unknown): string {
  return JSON.stringify(value);
}

/** Haversine distance in km */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Rough driving time estimate (~70 km/h average on CZ roads) */
export function estimateDriveMinutes(km: number): number {
  return Math.round((km / 70) * 60);
}

export function formatDriveTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m.toString().padStart(2, "0")} min`;
}

export function getThisWeekend(): { checkIn: string; checkOut: string } {
  const now = new Date();
  const day = now.getDay();
  const daysUntilFriday = (5 - day + 7) % 7 || (day === 5 ? 0 : 7);
  const friday = new Date(now);
  friday.setDate(now.getDate() + daysUntilFriday);
  friday.setHours(15, 0, 0, 0);
  const sunday = new Date(friday);
  sunday.setDate(friday.getDate() + 2);
  sunday.setHours(11, 0, 0, 0);
  return {
    checkIn: friday.toISOString().slice(0, 10),
    checkOut: sunday.toISOString().slice(0, 10),
  };
}

export function getNextWeekend(): { checkIn: string; checkOut: string } {
  const thisW = getThisWeekend();
  const checkIn = new Date(thisW.checkIn);
  checkIn.setDate(checkIn.getDate() + 7);
  const checkOut = new Date(thisW.checkOut);
  checkOut.setDate(checkOut.getDate() + 7);
  return {
    checkIn: checkIn.toISOString().slice(0, 10),
    checkOut: checkOut.toISOString().slice(0, 10),
  };
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24)));
}
