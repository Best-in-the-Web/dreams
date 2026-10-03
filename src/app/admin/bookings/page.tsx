import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { property: true, package: true },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-forest">Bookings</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-cream">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-mist bg-sand/50 text-xs uppercase tracking-wider text-moss">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Stay</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Commission</th>
              <th className="px-4 py-3">Partner owed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-mist/60 hover:bg-sand/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {b.bookingNumber}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {b.guestName}
                  <p className="text-xs text-ink/50">{b.guestEmail}</p>
                </td>
                <td className="px-4 py-3">
                  {b.property.name}
                  {b.package && <p className="text-xs text-ink/50">{b.package.name}</p>}
                </td>
                <td className="px-4 py-3">
                  {b.checkIn.toISOString().slice(0, 10)} → {b.checkOut.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">{formatPrice(b.customerPriceCzk)}</td>
                <td className="px-4 py-3">{formatPrice(b.commissionCzk)}</td>
                <td className="px-4 py-3">{formatPrice(b.amountOwedPartnerCzk)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold">{b.status}</span>
                  <p className="text-xs text-ink/50">{b.paymentStatus}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
