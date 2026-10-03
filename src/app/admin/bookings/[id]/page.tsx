import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      property: { include: { partner: true } },
      package: true,
      payment: true,
      unit: true,
    },
  });
  if (!booking) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/bookings" className="text-sm text-moss hover:underline">
        ← Bookings
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-forest">
        {booking.bookingNumber}
      </h1>
      <p className="text-ink/60">
        {booking.status} · Payment {booking.paymentStatus} · Partner payout{" "}
        {booking.partnerPaymentStatus}
      </p>

      <div className="mt-6 space-y-3 rounded-2xl border border-mist bg-cream p-5 text-sm">
        <Row label="Customer" value={`${booking.guestName} · ${booking.guestEmail}`} />
        <Row label="Phone" value={booking.guestPhone || "—"} />
        <Row label="Accommodation" value={booking.property.name} />
        <Row label="Partner" value={booking.property.partner.businessName} />
        <Row label="Package" value={booking.package?.name || "Room only"} />
        <Row
          label="Dates"
          value={`${booking.checkIn.toISOString().slice(0, 10)} → ${booking.checkOut.toISOString().slice(0, 10)}`}
        />
        <Row
          label="Guests"
          value={`${booking.adults} adults, ${booking.children} children, ${booking.pets} pets`}
        />
      </div>

      <h2 className="mt-8 font-display text-xl font-semibold">Economics</h2>
      <div className="mt-3 space-y-2 rounded-2xl border border-mist bg-cream p-5 text-sm">
        <Row label="Customer price" value={formatPrice(booking.customerPriceCzk)} />
        <Row label="Taxes (incl.)" value={formatPrice(booking.taxesCzk)} />
        <Row label="Extras" value={formatPrice(booking.extrasCzk)} />
        <Row label="Partner net" value={formatPrice(booking.partnerNetPriceCzk)} />
        <Row label="Commission" value={formatPrice(booking.commissionCzk)} />
        <Row label="Payment fee" value={formatPrice(booking.paymentFeeCzk)} />
        <Row label="Owed to partner" value={formatPrice(booking.amountOwedPartnerCzk)} />
        <Row label="Platform revenue" value={formatPrice(booking.platformRevenueCzk)} />
        <Row label="Refund" value={formatPrice(booking.refundAmountCzk)} />
        <div className="border-t border-mist pt-2 font-semibold">
          <Row
            label="Gross margin (commission − fee)"
            value={formatPrice(booking.commissionCzk - booking.paymentFeeCzk)}
          />
        </div>
      </div>

      {booking.payment && (
        <p className="mt-4 text-sm text-ink/50">
          Payment via {booking.payment.provider} · ref {booking.payment.providerRef}
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-ink/50">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
