import { describe, expect, it } from "vitest";
import { parseNaturalQuery, smartSearch } from "@/lib/smart-search";

describe("parseNaturalQuery", () => {
  it("parses the canonical MVP example query", () => {
    const f = parseNaturalQuery(
      "Find me a cabin for two people with a private hot tub, maximum 2 hours from Brno, available next weekend and under 7,000 Kč."
    );

    expect(f.originCity).toBe("Brno");
    expect(f.originLat).toBeCloseTo(49.1951);
    expect(f.originLng).toBeCloseTo(16.6068);
    expect(f.maxDriveMinutes).toBe(120);
    expect(f.types).toContain("CABIN");
    expect(f.amenities).toContain("Private hot tub");
    expect(f.adults).toBe(2);
    expect(f.tripTypes).toContain("ROMANTIC");
    expect(f.maxPriceCzk).toBe(7000);
  });

  it("detects dog-friendly family trips", () => {
    const f = parseNaturalQuery(
      "family cabin with dog near Olomouc, children welcome"
    );
    expect(f.originCity).toBe("Olomouc");
    expect(f.pets).toBe(1);
    expect(f.tripTypes).toEqual(expect.arrayContaining(["DOG_FRIENDLY", "FAMILY"]));
    expect(f.children).toBeGreaterThanOrEqual(1);
  });

  it("maps wine / wellness / glamping keywords", () => {
    const wine = parseNaturalQuery("wine region stay near Mikulov");
    expect(wine.tripTypes).toContain("FOOD_WINE");
    expect(wine.environments).toContain("WINE_REGION");

    const wellness = parseNaturalQuery("wellness spa with sauna");
    expect(wellness.tripTypes).toContain("WELLNESS");
    expect(wellness.amenities).toContain("Sauna");

    const glamping = parseNaturalQuery("glamping dome under the stars");
    expect(glamping.types).toContain("GLAMPING");
  });

  it("parses explicit km radius", () => {
    const f = parseNaturalQuery("cottage within 150 km of Vienna");
    expect(f.originCity).toBe("Vienna");
    expect(f.radiusKm).toBe(150);
    expect(f.types).toContain("COTTAGE");
  });
});

describe("smartSearch", () => {
  it("is async-ready for a future LLM layer", async () => {
    const f = await smartSearch("tiny house Prague");
    expect(f.types).toContain("TINY_HOUSE");
    expect(f.originCity).toBe("Prague");
  });
});
