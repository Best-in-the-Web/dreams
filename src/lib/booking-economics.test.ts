import { describe, expect, it } from "vitest";
import { calculateBookingEconomics } from "@/lib/booking-economics";

describe("calculateBookingEconomics", () => {
  it("matches the MVP example economics shape", () => {
    // Customer pays 6000 incl. path: accommodation 5455 + ~10% tax ≈ 6000
    // Use accommodation that yields customer total 6000 with 15% commission
    const result = calculateBookingEconomics({
      accommodationCzk: 5455,
      commissionPercent: 15,
    });

    // taxes = round(5455 * 0.1) = 546; total = 6001
    expect(result.taxesCzk).toBe(546);
    expect(result.customerPriceCzk).toBe(6001);
    expect(result.commissionCzk).toBe(Math.round(6001 * 0.15));
    expect(result.paymentFeeCzk).toBe(Math.round(6001 * 0.015));
    expect(result.partnerNetPriceCzk).toBe(
      result.customerPriceCzk - result.commissionCzk
    );
    expect(result.amountOwedPartnerCzk).toBe(result.partnerNetPriceCzk);
    expect(result.platformRevenueCzk).toBe(
      result.commissionCzk - result.paymentFeeCzk
    );
    expect(result.platformGrossMarginCzk).toBe(result.platformRevenueCzk);
  });

  it("applies extras before tax", () => {
    const result = calculateBookingEconomics({
      accommodationCzk: 5000,
      extrasCzk: 500,
      commissionPercent: 15,
    });
    expect(result.extrasCzk).toBe(500);
    expect(result.taxesCzk).toBe(Math.round(5500 * 0.1));
    expect(result.customerPriceCzk).toBe(5500 + result.taxesCzk);
  });

  it("supports custom commission", () => {
    const result = calculateBookingEconomics({
      accommodationCzk: 10000,
      commissionPercent: 20,
      taxRate: 0,
      paymentFeeRate: 0,
    });
    expect(result.customerPriceCzk).toBe(10000);
    expect(result.commissionCzk).toBe(2000);
    expect(result.partnerNetPriceCzk).toBe(8000);
    expect(result.platformGrossMarginCzk).toBe(2000);
  });
});
