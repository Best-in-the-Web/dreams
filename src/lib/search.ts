import { prisma } from "./db";
import { distanceKm, estimateDriveMinutes, parseJsonArray } from "./utils";
import type { SearchFilters } from "./smart-search";
import type { Property, Package, NearbyPlace } from "@prisma/client";

export type PropertyCard = Property & {
  distanceKm: number;
  driveMinutes: number;
  packages: Package[];
  weekendPriceCzk: number | null;
};

export async function searchProperties(filters: SearchFilters): Promise<PropertyCard[]> {
  const properties = await prisma.property.findMany({
    where: { published: true },
    include: {
      packages: { where: { active: true } },
      units: true,
    },
  });

  const originLat = filters.originLat ?? 49.1951;
  const originLng = filters.originLng ?? 16.6068;
  const radius = filters.radiusKm && filters.radiusKm > 0 ? filters.radiusKm : 9999;

  let results = properties.map((p) => {
    const dist = distanceKm(originLat, originLng, p.lat, p.lng);
    return {
      ...p,
      distanceKm: Math.round(dist * 10) / 10,
      driveMinutes: estimateDriveMinutes(dist),
    };
  });

  results = results.filter((p) => p.distanceKm <= radius);

  if (filters.maxDriveMinutes) {
    results = results.filter((p) => p.driveMinutes <= filters.maxDriveMinutes!);
  }

  if (filters.types?.length) {
    results = results.filter((p) => filters.types!.includes(p.type));
  }

  if (filters.amenities?.length) {
    results = results.filter((p) => {
      const am = parseJsonArray(p.amenities);
      return filters.amenities!.every((a) => am.includes(a));
    });
  }

  if (filters.environments?.length) {
    results = results.filter((p) => {
      const env = parseJsonArray(p.environments);
      return filters.environments!.some((e) => env.includes(e));
    });
  }

  if (filters.tripTypes?.length) {
    results = results.filter((p) => {
      const tt = parseJsonArray(p.tripTypes);
      return filters.tripTypes!.some((t) => tt.includes(t));
    });
  }

  const guests = (filters.adults || 0) + (filters.children || 0);
  if (guests > 0) {
    results = results.filter((p) => p.guestCapacity >= guests);
  }

  if (filters.pets && filters.pets > 0) {
    results = results.filter((p) => {
      const am = parseJsonArray(p.amenities);
      return am.includes("Dogs allowed") || p.petPolicy.toLowerCase().includes("welcome");
    });
  }

  if (filters.maxPriceCzk) {
    results = results.filter((p) => {
      const weekend = p.weekendPriceCzk ?? p.basePriceCzk;
      const pkgMin = p.packages.length
        ? Math.min(...p.packages.map((x) => x.priceCzk))
        : weekend * 2;
      return Math.min(weekend * 2, pkgMin) <= filters.maxPriceCzk!;
    });
  }

  if (filters.maxPricePerNightCzk) {
    results = results.filter(
      (p) => (p.weekendPriceCzk ?? p.basePriceCzk) <= filters.maxPricePerNightCzk!
    );
  }

  results.sort((a, b) => a.distanceKm - b.distanceKm);
  return results;
}

export async function getPropertyBySlug(slug: string) {
  return prisma.property.findUnique({
    where: { slug },
    include: {
      packages: { where: { active: true } },
      nearbyPlaces: true,
      units: { include: { availability: true, prices: true } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" }, take: 10 },
      partner: true,
    },
  });
}

export function serializeProperty(p: Property & { packages?: Package[]; nearbyPlaces?: NearbyPlace[] }) {
  return {
    ...p,
    images: parseJsonArray(p.images),
    amenities: parseJsonArray(p.amenities),
    tripTypes: parseJsonArray(p.tripTypes),
    environments: parseJsonArray(p.environments),
    tags: parseJsonArray(p.tags),
    packages: p.packages?.map((pkg) => ({
      ...pkg,
      includes: parseJsonArray(pkg.includes),
    })),
  };
}
