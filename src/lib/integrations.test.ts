import { describe, expect, it } from "vitest";
import { mockChannelManager, mockPaymentProvider } from "@/lib/integrations";
import { brand, tripCategories, radiusOptions } from "@/lib/brand";
import { mapProvider } from "@/lib/map-provider";

describe("mockPaymentProvider", () => {
  it("creates a sandbox checkout URL", async () => {
    const checkout = await mockPaymentProvider.createCheckout({
      amountCzk: 6990,
      bookingNumber: "EM-TEST1234",
      returnUrl: "http://localhost:3000/booking/EM-TEST1234/confirm",
      customerEmail: "demo@escapemap.local",
    });
    expect(checkout.providerRef).toContain("EM-TEST1234");
    expect(checkout.checkoutUrl).toContain("mock_pay=1");
    expect(await mockPaymentProvider.verifyPayment(checkout.providerRef)).toEqual({
      paid: true,
    });
  });
});

describe("mockChannelManager", () => {
  it("returns empty availability and accepts booking push", async () => {
    expect(await mockChannelManager.fetchAvailability("ext-1", "2026-10-01", "2026-10-31")).toEqual(
      []
    );
    const push = await mockChannelManager.pushBooking!({
      propertyExternalId: "ext-1",
      unitExternalId: "unit-1",
      checkIn: "2026-10-10",
      checkOut: "2026-10-12",
      guests: 2,
      bookingNumber: "EM-ABC",
    });
    expect(push.ok).toBe(true);
    expect(push.externalRef).toBeTruthy();
  });
});

describe("brand config", () => {
  it("exposes a swappable brand name and default origin", () => {
    expect(brand.name).toBeTruthy();
    expect(brand.defaultOrigin.city).toBe("Brno");
    expect(tripCategories.length).toBeGreaterThanOrEqual(10);
    expect(radiusOptions.map((r) => r.value)).toContain(200);
  });
});

describe("mapProvider", () => {
  it("defaults to Leaflet + OpenStreetMap", () => {
    expect(mapProvider.id).toBe("leaflet-osm");
    expect(mapProvider.tileUrl).toContain("openstreetmap");
  });
});
