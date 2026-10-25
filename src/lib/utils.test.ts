import { describe, expect, it } from "vitest";
import {
  distanceKm,
  estimateDriveMinutes,
  formatDriveTime,
  formatPrice,
  nightsBetween,
  parseJsonArray,
  getThisWeekend,
  getNextWeekend,
} from "@/lib/utils";

describe("formatPrice", () => {
  it("formats CZK for the English interface", () => {
    expect(formatPrice(5490)).toBe("5,490 Kč");
  });
});

describe("parseJsonArray", () => {
  it("parses valid JSON arrays", () => {
    expect(parseJsonArray('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns empty array for invalid input", () => {
    expect(parseJsonArray(null)).toEqual([]);
    expect(parseJsonArray("not-json")).toEqual([]);
    expect(parseJsonArray("{}")).toEqual([]);
  });
});

describe("distanceKm", () => {
  it("returns ~0 for the same point", () => {
    expect(distanceKm(49.1951, 16.6068, 49.1951, 16.6068)).toBeCloseTo(0, 1);
  });

  it("estimates Brno → Prague around 185 km", () => {
    const km = distanceKm(49.1951, 16.6068, 50.0755, 14.4378);
    expect(km).toBeGreaterThan(170);
    expect(km).toBeLessThan(210);
  });
});

describe("drive time helpers", () => {
  it("estimates minutes from km", () => {
    expect(estimateDriveMinutes(70)).toBe(60);
    expect(estimateDriveMinutes(140)).toBe(120);
  });

  it("formats drive time", () => {
    expect(formatDriveTime(45)).toBe("45 min");
    expect(formatDriveTime(132)).toBe("2h 12 min");
  });
});

describe("nightsBetween", () => {
  it("counts nights between dates", () => {
    expect(nightsBetween("2026-10-09", "2026-10-11")).toBe(2);
  });

  it("returns at least 1", () => {
    expect(nightsBetween("2026-10-09", "2026-10-09")).toBe(1);
  });
});

describe("weekend helpers", () => {
  it("returns Friday→Sunday for this weekend", () => {
    const w = getThisWeekend();
    expect(w.checkIn < w.checkOut).toBe(true);
    // Noon avoids timezone edge cases on date-only strings
    expect(new Date(`${w.checkIn}T12:00:00`).getDay()).toBe(5); // Friday
    expect(new Date(`${w.checkOut}T12:00:00`).getDay()).toBe(0); // Sunday
  });

  it("next weekend is 7 days after this weekend", () => {
    const a = getThisWeekend();
    const b = getNextWeekend();
    const diff =
      (new Date(`${b.checkIn}T12:00:00`).getTime() -
        new Date(`${a.checkIn}T12:00:00`).getTime()) /
      86400000;
    expect(diff).toBe(7);
  });
});
