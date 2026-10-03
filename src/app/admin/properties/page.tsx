import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      partner: true,
      packages: true,
      units: true,
      _count: { select: { bookings: true, nearbyPlaces: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-forest">Properties</h1>
      <p className="mt-1 text-ink/60">{properties.length} accommodations</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-mist bg-cream">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-mist bg-sand/50 text-xs uppercase tracking-wider text-moss">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Packages</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.id} className="border-b border-mist/60 hover:bg-sand/30">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/properties/${p.id}`}
                    className="font-semibold text-forest hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-ink/50">{p.partner.businessName}</p>
                </td>
                <td className="px-4 py-3">{p.type}</td>
                <td className="px-4 py-3">
                  {p.city}, {p.country}
                </td>
                <td className="px-4 py-3">
                  {formatPrice(p.weekendPriceCzk ?? p.basePriceCzk)}
                </td>
                <td className="px-4 py-3">{p.packages.length}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.published ? "bg-forest/15 text-forest" : "bg-mist text-ink/50"
                    }`}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">{p._count.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
