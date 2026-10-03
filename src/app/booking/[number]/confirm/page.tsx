import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function ConfirmBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ mock_pay?: string; ref?: string }>;
}) {
  const { number } = await params;
  const sp = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { bookingNumber: number },
    include: { property: true, package: true, payment: true },
  });
  if (!booking) notFound();

  // Mock payment success
  if (sp.mock_pay === "1" && booking.paymentStatus === "PENDING") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
        partnerPaymentStatus: "PENDING",
      },
    });
    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: { status: "PAID", paidAt: new Date() },
      });
    }
  }

  const fresh = await prisma.booking.findUnique({
    where: { bookingNumber: number },
    include: { property: true, package: true, payment: true },
  });
  if (!fresh) notFound();

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-moss">Booking confirmed</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-forest">You&apos;re going!</h1>
      <div className="mt-8 space-y-3 rounded-3xl border border-mist bg-sand/40 p-6">
        <Row label="Booking number" value={fresh.bookingNumber} />
        <Row label="Place" value={fresh.property.name} />
        <Row
          label="Dates"
          value={`${fresh.checkIn.toISOString().slice(0, 10)} → ${fresh.checkOut.toISOString().slice(0, 10)}`}
        />
        {fresh.package && <Row label="Package" value={fresh.package.name} />}
        <Row label="Guests" value={`${fresh.adults} adults${fresh.children ? `, ${fresh.children} children` : ""}${fresh.pets ? `, ${fresh.pets} pets` : ""}`} />
        <Row label="Total" value={formatPrice(fresh.customerPriceCzk)} />
        <Row label="Payment" value={fresh.paymentStatus} />
        <Row label="Contact" value={`${fresh.guestName} · ${fresh.guestEmail}`} />
      </div>
      <a
        href={`https://www.openstreetmap.org/directions?to=${fresh.property.lat}%2C${fresh.property.lng}`}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-forest py-3 text-sm font-semibold text-cream"
      >
        Get directions
      </a>
      <Link href="/account" className="mt-3 block text-center text-sm text-moss hover:underline">
        View in My trips
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-ink/50">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
