import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminDashboard() {
  const [partners, properties, bookings, revenue] = await Promise.all([
    prisma.partner.count(),
    prisma.property.count({ where: { published: true } }),
    prisma.booking.count(),
    prisma.booking.aggregate({
      _sum: { platformRevenueCzk: true, customerPriceCzk: true, commissionCzk: true },
      where: { paymentStatus: "PAID" },
    }),
  ]);

  const recentBookings = await prisma.booking.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { property: true },
  });

  const openTasks = await prisma.task.findMany({
    where: { status: "OPEN" },
    include: { partner: true },
    take: 6,
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-forest">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Partners" value={String(partners)} href="/admin/partners" />
        <Stat label="Published stays" value={String(properties)} href="/admin/properties" />
        <Stat label="Bookings" value={String(bookings)} href="/admin/bookings" />
        <Stat
          label="Platform revenue"
          value={formatPrice(revenue._sum.platformRevenueCzk || 0)}
          href="/admin/bookings"
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="font-display text-xl font-semibold">Recent bookings</h2>
          <div className="mt-3 space-y-2">
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex justify-between rounded-xl border border-mist bg-cream px-4 py-3 text-sm hover:bg-sand/50"
              >
                <span>
                  <span className="font-semibold">{b.bookingNumber}</span> · {b.property.name}
                </span>
                <span>
                  {formatPrice(b.customerPriceCzk)} · {b.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold">Open tasks</h2>
          <div className="mt-3 space-y-2">
            {openTasks.map((t) => (
              <div key={t.id} className="rounded-xl border border-mist bg-cream px-4 py-3 text-sm">
                <p className="font-semibold">{t.title}</p>
                <p className="text-ink/60">{t.partner?.businessName}</p>
              </div>
            ))}
            {openTasks.length === 0 && <p className="text-ink/50">No open tasks.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-mist bg-cream p-5 hover:border-forest/30">
      <p className="text-xs font-semibold uppercase tracking-wider text-moss">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-forest">{value}</p>
    </Link>
  );
}
