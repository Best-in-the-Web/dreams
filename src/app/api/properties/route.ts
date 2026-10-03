import { NextRequest, NextResponse } from "next/server";
import { searchProperties } from "@/lib/search";
import type { SearchFilters } from "@/lib/smart-search";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const filters: SearchFilters = {
    originCity: sp.get("origin") || undefined,
    originLat: sp.get("lat") ? parseFloat(sp.get("lat")!) : undefined,
    originLng: sp.get("lng") ? parseFloat(sp.get("lng")!) : undefined,
    radiusKm: sp.get("radius") ? parseInt(sp.get("radius")!, 10) : 200,
    adults: sp.get("adults") ? parseInt(sp.get("adults")!, 10) : undefined,
    children: sp.get("children") ? parseInt(sp.get("children")!, 10) : undefined,
    pets: sp.get("pets") ? parseInt(sp.get("pets")!, 10) : undefined,
    types: sp.get("types")?.split(",").filter(Boolean),
    amenities: sp.get("amenities")?.split(",").filter(Boolean),
    environments: sp.get("environments")?.split(",").filter(Boolean),
    tripTypes: sp.get("tripTypes")?.split(",").filter(Boolean),
    maxPriceCzk: sp.get("maxPrice") ? parseInt(sp.get("maxPrice")!, 10) : undefined,
    checkIn: sp.get("checkIn") || undefined,
    checkOut: sp.get("checkOut") || undefined,
  };

  const properties = await searchProperties(filters);
  return NextResponse.json({ properties });
}
