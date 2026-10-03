import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  const bookings = await prisma.booking.findMany({
    where: { OR: [{ userId: user.id }, { guestEmail: user.email }] },
    include: { property: true, package: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const upcoming = bookings.filter((b) => b.checkOut >= now && b.status !== "CANCELLED");
  const past = bookings.filter((b) => b.checkOut < now || b.status === "COMPLETED");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest">Hi, {user.name}</h1>
          <p className="text-ink/60">{user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <nav className="mt-8 flex gap-3 text-sm font-semibold">
        <Link href="/account" className="text-forest underline">
          My trips
        </Link>
        <Link href="/account/saved" className="text-ink/50 hover:text-forest">
          Saved places
        </Link>
        {user.role === "ADMIN" && (
          <Link href="/admin" className="text-clay hover:underline">
            Admin
          </Link>
        )}
      </nav>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Upcoming</h2>
        {upcoming.length === 0 && <p className="mt-2 text-ink/50">No trips yet — explore the map.</p>}
        <div className="mt-4 space-y-3">
          {upcoming.map((b) => (
            <Link
              key={b.id}
              href={`/booking/${b.bookingNumber}/confirm`}
              className="block rounded-2xl border border-mist p-4 hover:bg-sand/40"
            >
              <p className="font-semibold">{b.property.name}</p>
              <p className="text-sm text-ink/60">
                {b.checkIn.toISOString().slice(0, 10)} → {b.checkOut.toISOString().slice(0, 10)} ·{" "}
                {formatPrice(b.customerPriceCzk)} · {b.status}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Previous trips</h2>
        {past.length === 0 && <p className="mt-2 text-ink/50">No previous trips.</p>}
        <div className="mt-4 space-y-3">
          {past.map((b) => (
            <div key={b.id} className="rounded-2xl border border-mist p-4">
              <p className="font-semibold">{b.property.name}</p>
              <p className="text-sm text-ink/60">
                {b.checkIn.toISOString().slice(0, 10)} · {formatPrice(b.customerPriceCzk)}
              </p>
              {b.status === "COMPLETED" && (
                <Link
                  href={`/stays/${b.property.slug}/review?booking=${b.bookingNumber}`}
                  className="mt-2 inline-block text-sm font-semibold text-clay"
                >
                  Leave a review
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
