/**
 * Channel manager / PMS integration interface stubs.
 * Do not implement real integrations in MVP — keep the contract ready.
 */

export type ExternalAvailability = {
  unitExternalId: string;
  date: string; // YYYY-MM-DD
  available: boolean;
  priceCzk?: number;
  minStay?: number;
};

export type ChannelManagerAdapter = {
  name: string;
  fetchAvailability: (
    propertyExternalId: string,
    from: string,
    to: string
  ) => Promise<ExternalAvailability[]>;
  pushBooking?: (payload: {
    propertyExternalId: string;
    unitExternalId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    bookingNumber: string;
  }) => Promise<{ ok: boolean; externalRef?: string }>;
};

/** Placeholder adapter — replace with Booking.com / iCal / PMS later */
export const mockChannelManager: ChannelManagerAdapter = {
  name: "mock",
  async fetchAvailability() {
    return [];
  },
  async pushBooking() {
    return { ok: true, externalRef: `mock-${Date.now()}` };
  },
};

export type PaymentProvider = {
  name: string;
  createCheckout: (input: {
    amountCzk: number;
    bookingNumber: string;
    returnUrl: string;
    customerEmail: string;
  }) => Promise<{ checkoutUrl: string; providerRef: string }>;
  verifyPayment: (providerRef: string) => Promise<{ paid: boolean }>;
};

export const mockPaymentProvider: PaymentProvider = {
  name: "mock",
  async createCheckout({ bookingNumber, returnUrl }) {
    const providerRef = `mock_pay_${bookingNumber}`;
    return {
      providerRef,
      checkoutUrl: `${returnUrl}?mock_pay=1&ref=${providerRef}`,
    };
  },
  async verifyPayment() {
    return { paid: true };
  },
};
