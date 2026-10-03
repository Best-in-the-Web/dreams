/**
 * Booking financial model used by checkout and admin.
 * Keep payment-provider-agnostic.
 */
export type BookingEconomicsInput = {
  accommodationCzk: number;
  extrasCzk?: number;
  taxRate?: number; // default 10%
  commissionPercent: number;
  paymentFeeRate?: number; // default 1.5%
};

export type BookingEconomics = {
  accommodationCzk: number;
  extrasCzk: number;
  taxesCzk: number;
  customerPriceCzk: number;
  commissionCzk: number;
  paymentFeeCzk: number;
  partnerNetPriceCzk: number;
  amountOwedPartnerCzk: number;
  platformRevenueCzk: number;
  platformGrossMarginCzk: number;
};

export function calculateBookingEconomics(input: BookingEconomicsInput): BookingEconomics {
  const extrasCzk = input.extrasCzk ?? 0;
  const taxRate = input.taxRate ?? 0.1;
  const paymentFeeRate = input.paymentFeeRate ?? 0.015;

  const accommodationCzk = Math.max(0, Math.round(input.accommodationCzk));
  const subtotal = accommodationCzk + extrasCzk;
  const taxesCzk = Math.round(subtotal * taxRate);
  const customerPriceCzk = subtotal + taxesCzk;

  const commissionCzk = Math.round(customerPriceCzk * (input.commissionPercent / 100));
  const paymentFeeCzk = Math.round(customerPriceCzk * paymentFeeRate);
  const partnerNetPriceCzk = customerPriceCzk - commissionCzk;
  const amountOwedPartnerCzk = partnerNetPriceCzk;
  const platformRevenueCzk = commissionCzk - paymentFeeCzk;
  const platformGrossMarginCzk = commissionCzk - paymentFeeCzk;

  return {
    accommodationCzk,
    extrasCzk,
    taxesCzk,
    customerPriceCzk,
    commissionCzk,
    paymentFeeCzk,
    partnerNetPriceCzk,
    amountOwedPartnerCzk,
    platformRevenueCzk,
    platformGrossMarginCzk,
  };
}
