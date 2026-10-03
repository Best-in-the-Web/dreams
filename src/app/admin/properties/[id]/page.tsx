import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import { TogglePublishButton } from "@/components/admin/TogglePublishButton";

export default async function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      partner: true,
      packages: true,
      units: { include: { availability: { take: 14, orderBy: { date: "asc" } } } },
      nearbyPlaces: true,
      notes: { include: { author: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!property) notFound();

  const amenities = parseJsonArray(property.amenities);
  const images = parseJsonArray(property.images);

  return (
    <div>
      <Link href="/admin/properties" className="text-sm text-moss hover:underline">
        ← Properties
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-forest">{property.name}</h1>
          <p className="text-ink/60">
            {property.city}, {property.country} · {property.type}
          </p>
          <Link href={`/stays/${property.slug}`} className="text-sm text-clay hover:underline">
            View public page →
          </Link>
        </div>
        <TogglePublishButton id={property.id} published={property.published} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-mist bg-cream p-5">
          <h2 className="font-semibold">Details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/50">Partner</dt>
              <dd>
                <Link href={`/admin/partners/${property.partnerId}`} className="text-forest hover:underline">
                  {property.partner.businessName}
                </Link>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">Capacity</dt>
              <dd>
                {property.guestCapacity} guests · {property.beds} beds
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">Base / weekend</dt>
              <dd>
                {formatPrice(property.basePriceCzk)} / {formatPrice(property.weekendPriceCzk || 0)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">GPS</dt>
              <dd>
                {property.lat}, {property.lng}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/50">Check-in / out</dt>
              <dd>
                {property.checkIn} / {property.checkOut}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-ink/70">{property.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {amenities.map((a) => (
              <span key={a} className="rounded-full bg-sand px-2 py-0.5 text-xs">
                {a}
              </span>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt="" className="mt-4 h-40 w-full rounded-xl object-cover" />
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-mist bg-cream p-5">
            <h2 className="font-semibold">Packages ({property.packages.length})</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {property.packages.map((pkg) => (
                <li key={pkg.id} className="flex justify-between rounded-lg bg-sand/40 px-3 py-2">
                  <span>{pkg.name}</span>
                  <span className="font-semibold">{formatPrice(pkg.priceCzk)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-mist bg-cream p-5">
            <h2 className="font-semibold">Nearby places ({property.nearbyPlaces.length})</h2>
            <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm">
              {property.nearbyPlaces.map((n) => (
                <li key={n.id}>
                  {n.name}{" "}
                  <span className="text-ink/40">· {n.category}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-mist bg-cream p-5">
            <h2 className="font-semibold">Availability (next days)</h2>
            <div className="mt-3 flex flex-wrap gap-1">
              {property.units[0]?.availability.map((a) => (
                <span
                  key={a.id}
                  title={a.date.toISOString().slice(0, 10)}
                  className={`h-6 w-6 rounded ${a.available && !a.blocked ? "bg-forest/40" : "bg-ink/20"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-ink/50">Green = available · managed manually in MVP</p>
          </div>
        </section>
      </div>
    </div>
  );
}
