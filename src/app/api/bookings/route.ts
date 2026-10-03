import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { mockPaymentProvider } from "@/lib/integrations";
import { calculateBookingEconomics } from "@/lib/booking-economics";
import { customAlphabet } from "nanoid";

const bookingId = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await getSessionUser();

  const property = await prisma.property.findUnique({
    where: { id: body.propertyId },
    include: { partner: true, units: true, packages: true },
  });
  if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  const pkg = body.packageId
    ? property.packages.find((p) => p.id === body.packageId)
    : null;

  const nights = Math.max(
    1,
    Math.round(
      (new Date(body.checkOut).getTime() - new Date(body.checkIn).getTime()) / 86400000
    )
  );

  const accommodationCzk = pkg
    ? pkg.priceCzk
    : (property.weekendPriceCzk ?? property.basePriceCzk) * nights;

  const economics = calculateBookingEconomics({
    accommodationCzk,
    extrasCzk: body.extrasCzk || 0,
    commissionPercent: property.partner.commissionPercent || 15,
  });

  const number = `EM-${bookingId()}`;

  const booking = await prisma.booking.create({
    data: {
      bookingNumber: number,
      userId: user?.id,
      propertyId: property.id,
      unitId: property.units[0]?.id,
      packageId: pkg?.id,
      checkIn: new Date(body.checkIn),
      checkOut: new Date(body.checkOut),
      adults: body.adults || 2,
      children: body.children || 0,
      childrenAges: JSON.stringify(body.childrenAges || []),
      pets: body.pets || 0,
      guestName: body.guestName,
      guestEmail: body.guestEmail,
      guestPhone: body.guestPhone || null,
      customerPriceCzk: economics.customerPriceCzk,
      partnerNetPriceCzk: economics.partnerNetPriceCzk,
      commissionCzk: economics.commissionCzk,
      paymentFeeCzk: economics.paymentFeeCzk,
      amountOwedPartnerCzk: economics.amountOwedPartnerCzk,
      platformRevenueCzk: economics.platformRevenueCzk,
      extrasCzk: economics.extrasCzk,
      taxesCzk: economics.taxesCzk,
      status: "PENDING",
      paymentStatus: "PENDING",
    },
  });

  const returnUrl = `${req.nextUrl.origin}/booking/${booking.bookingNumber}/confirm`;
  const checkout = await mockPaymentProvider.createCheckout({
    amountCzk: economics.customerPriceCzk,
    bookingNumber: booking.bookingNumber,
    returnUrl,
    customerEmail: body.guestEmail,
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: "mock",
      providerRef: checkout.providerRef,
      amountCzk: economics.customerPriceCzk,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    bookingNumber: booking.bookingNumber,
    checkoutUrl: checkout.checkoutUrl,
    total: economics.customerPriceCzk,
  });
}
