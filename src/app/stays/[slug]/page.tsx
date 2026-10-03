import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyBySlug, serializeProperty } from "@/lib/search";
import { brand } from "@/lib/brand";
import {
  formatDriveTime,
  formatPrice,
  distanceKm,
  estimateDriveMinutes,
  parseJsonArray,
} from "@/lib/utils";
import { Star, MapPin, Clock, Users, Dog, Baby } from "lucide-react";
import { BookingWidget } from "@/components/BookingWidget";

export default async function StayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; originLat?: string; originLng?: string; origin?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const raw = await getPropertyBySlug(slug);
  if (!raw) notFound();
  const property = serializeProperty(raw);

  const originLat = sp.originLat ? parseFloat(sp.originLat) : brand.defaultOrigin.lat;
  const originLng = sp.originLng ? parseFloat(sp.originLng) : brand.defaultOrigin.lng;
  const originCity = sp.origin || brand.defaultOrigin.city;
  const dist = distanceKm(originLat, originLng, property.lat, property.lng);
  const drive = estimateDriveMinutes(dist);
  const images = property.images as string[];
  const amenities = property.amenities as string[];
  const tags = property.tags as string[];

  return (
    <div className="bg-cream">
      {/* Gallery */}
      <div className="mx-auto grid max-w-6xl gap-2 px-4 pt-4 md:grid-cols-4 md:px-6">
        <div className="relative col-span-2 row-span-2 aspect-[4/3] overflow-hidden rounded-3xl md:aspect-auto md:min-h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={property.name} className="h-full w-full object-cover" />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1fr_360px] md:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-forest md:text-4xl">
              {property.name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-sand px-3 py-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-clay text-clay" />
              {property.rating.toFixed(1)}
              <span className="font-normal text-ink/50">({property.reviewCount})</span>
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-ink/70">
            <MapPin className="h-4 w-4" />
            {property.city}, {property.country} · {property.type.replace("_", " ")}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
            <Clock className="h-4 w-4" />
            {Math.round(dist * 10) / 10} km from {originCity} · ~{formatDriveTime(drive)} by car
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-mist/60 px-3 py-1 text-sm font-medium text-forest">
                {t}
              </span>
            ))}
          </div>

          <p className="mt-6 text-lg text-ink/80">{property.tagline}</p>
          <p className="mt-4 leading-relaxed text-ink/75">{property.description}</p>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-forest">Why this place is special</h2>
            <p className="mt-3 leading-relaxed text-ink/75">{property.whySpecial}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-forest">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {amenities.map((a) => (
                <div key={a} className="rounded-xl bg-sand/80 px-3 py-2 text-sm font-medium">
                  {a}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-mist p-4">
              <Users className="mb-2 h-5 w-5 text-moss" />
              <p className="font-semibold">Capacity</p>
              <p className="text-sm text-ink/70">
                Up to {property.guestCapacity} guests · {property.beds} beds
              </p>
              <p className="mt-1 text-sm text-ink/60">
                Check-in {property.checkIn} · Check-out {property.checkOut}
              </p>
            </div>
            <div className="rounded-2xl border border-mist p-4">
              <Baby className="mb-2 h-5 w-5 text-moss" />
              <p className="font-semibold">Children</p>
              <p className="text-sm text-ink/70">{property.childrenPolicy}</p>
            </div>
            <div className="rounded-2xl border border-mist p-4">
              <Dog className="mb-2 h-5 w-5 text-moss" />
              <p className="font-semibold">Pets</p>
              <p className="text-sm text-ink/70">{property.petPolicy}</p>
            </div>
            <div className="rounded-2xl border border-mist p-4">
              <p className="font-semibold">Parking & food</p>
              <p className="text-sm text-ink/70">{property.parking}</p>
              <p className="mt-1 text-sm text-ink/70">{property.foodOptions}</p>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-forest">Experience packages</h2>
            <div className="mt-4 space-y-4">
              {(property.packages || []).map((pkg) => (
                <div key={pkg.id} className="rounded-2xl border border-mist bg-sand/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{pkg.name}</h3>
                      <p className="mt-1 text-sm text-ink/70">{pkg.description}</p>
                    </div>
                    <p className="font-display text-xl font-semibold text-forest">
                      {formatPrice(pkg.priceCzk)}
                    </p>
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {(pkg.includes as string[]).map((inc) => (
                      <li
                        key={inc}
                        className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-forest"
                      >
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-forest">Nearby</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {raw.nearbyPlaces.map((n) => (
                <div key={n.id} className="rounded-xl border border-mist px-4 py-3">
                  <p className="font-semibold">{n.name}</p>
                  <p className="text-xs uppercase tracking-wide text-moss">{n.category.replace("_", " ")}</p>
                  {n.distanceKm != null && (
                    <p className="text-sm text-ink/60">{n.distanceKm} km away</p>
                  )}
                </div>
              ))}
            </div>
            <Link
              href={`/explore?origin=${encodeURIComponent(originCity)}&lat=${originLat}&lng=${originLng}&radius=300`}
              className="mt-4 inline-block text-sm font-semibold text-clay hover:underline"
            >
              Back to map →
            </Link>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-forest">Map</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-mist">
              <iframe
                title="map"
                className="h-64 w-full"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.lng - 0.08}%2C${property.lat - 0.05}%2C${property.lng + 0.08}%2C${property.lat + 0.05}&layer=mapnik&marker=${property.lat}%2C${property.lng}`}
              />
            </div>
          </section>

          <section className="mt-10 mb-8">
            <h2 className="font-display text-2xl font-semibold text-forest">Cancellation</h2>
            <p className="mt-2 text-ink/70">{property.cancellation}</p>
          </section>

          {raw.reviews.length > 0 && (
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-forest">Reviews</h2>
              <div className="mt-4 space-y-4">
                {raw.reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-mist p-4">
                    <p className="font-semibold">
                      {r.user.name} · {r.overall}/5
                    </p>
                    <p className="mt-1 text-sm text-ink/70">{r.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div>
          <BookingWidget
            propertyId={property.id}
            slug={property.slug}
            basePrice={property.weekendPriceCzk ?? property.basePriceCzk}
            packages={(property.packages || []).map((p) => ({
              id: p.id,
              name: p.name,
              priceCzk: p.priceCzk,
              nights: p.nights,
            }))}
            defaultCheckIn={sp.checkIn}
            defaultCheckOut={sp.checkOut}
            capacity={property.guestCapacity}
          />
        </div>
      </div>
    </div>
  );
}
