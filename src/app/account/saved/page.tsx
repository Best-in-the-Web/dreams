import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice, parseJsonArray } from "@/lib/utils";

export default async function SavedPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account/saved");

  const favourites = await prisma.favourite.findMany({
    where: { userId: user.id },
    include: { property: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <h1 className="font-display text-3xl font-semibold text-forest">Saved places</h1>
      <p className="mt-2 text-ink/60">{favourites.length} places you loved</p>

      {favourites.length > 0 && (
        <Link
          href={`/explore?origin=Brno&lat=49.1951&lng=16.6068&radius=0&saved=1`}
          className="mt-4 inline-block text-sm font-semibold text-clay hover:underline"
        >
          View all on map →
        </Link>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favourites.map((f) => {
          const img = parseJsonArray(f.property.images)[0];
          return (
            <Link
              key={f.id}
              href={`/stays/${f.property.slug}`}
              className="group overflow-hidden rounded-3xl border border-mist bg-cream"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={f.property.name}
                className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
              />
              <div className="p-4">
                <p className="font-display text-lg font-semibold">{f.property.name}</p>
                <p className="text-sm text-ink/60">
                  {f.property.city} · from {formatPrice(f.property.weekendPriceCzk ?? f.property.basePriceCzk)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {favourites.length === 0 && (
        <p className="mt-8 text-ink/50">
          Heart places on the map to save them here.{" "}
          <Link href="/explore" className="font-semibold text-forest underline">
            Explore
          </Link>
        </p>
      )}
    </div>
  );
}
