"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { amenityOptions, brand } from "@/lib/brand";
import { cn } from "@/lib/utils";
import type { MapNearby, MapProperty } from "./EscapeMap";

const EscapeMap = dynamic(() => import("./EscapeMap").then((m) => m.EscapeMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-mist/40 text-moss">Loading map…</div>
  ),
});

export function ExploreClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<MapProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [nearby, setNearby] = useState<MapNearby[]>([]);
  const [layers, setLayers] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(params.get("maxPrice") || "");

  const origin = useMemo(
    () => ({
      city: params.get("origin") || brand.defaultOrigin.city,
      lat: parseFloat(params.get("lat") || String(brand.defaultOrigin.lat)),
      lng: parseFloat(params.get("lng") || String(brand.defaultOrigin.lng)),
    }),
    [params]
  );
  const radiusKm = parseInt(params.get("radius") || "200", 10);
  const checkIn = params.get("checkIn") || undefined;
  const checkOut = params.get("checkOut") || undefined;

  const queryString = params.toString();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/properties?${queryString}`);
      const data = await res.json();
      if (!cancelled) {
        setProperties(data.properties || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  useEffect(() => {
    fetch("/api/favourites")
      .then((r) => r.json())
      .then((d) => setSavedIds(d.ids || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setNearby([]);
      return;
    }
    const prop = properties.find((p) => p.id === selectedId);
    if (!prop) return;
    fetch(`/api/properties/${prop.slug}/nearby`)
      .then((r) => r.json())
      .then((d) => setNearby(d.nearby || []))
      .catch(() => setNearby([]));
  }, [selectedId, properties]);

  const toggleSave = useCallback(async (propertyId: string) => {
    const res = await fetch("/api/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId }),
    });
    if (res.status === 401) {
      router.push("/login?next=/explore");
      return;
    }
    const data = await res.json();
    setSavedIds((prev) =>
      data.saved ? [...prev, propertyId] : prev.filter((id) => id !== propertyId)
    );
  }, [router]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    router.push(`/explore?${next.toString()}`);
  };

  return (
    <div className="relative h-[calc(100dvh-0px)] w-full pt-0">
      <div className="absolute inset-0">
        {!loading && (
          <EscapeMap
            properties={properties}
            origin={origin}
            radiusKm={radiusKm || 0}
            selectedId={selectedId}
            onSelect={setSelectedId}
            nearby={nearby}
            activeLayers={layers}
            onToggleLayer={(id) =>
              setLayers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
            }
            savedIds={savedIds}
            onToggleSave={toggleSave}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        )}
        {loading && (
          <div className="flex h-full items-center justify-center bg-sand text-moss">
            Finding escapes near {origin.city}…
          </div>
        )}
      </div>

      {/* Filter FAB / bottom sheet trigger */}
      <button
        onClick={() => setFiltersOpen(true)}
        className="absolute bottom-6 right-4 z-[700] flex items-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-semibold text-cream shadow-lg md:bottom-auto md:right-4 md:top-24"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      {filtersOpen && (
        <div className="absolute inset-0 z-[800] flex flex-col justify-end bg-ink/30 md:justify-center md:items-end md:pr-4 md:pt-20">
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl bg-cream p-5 shadow-2xl md:max-w-md md:rounded-3xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Filters</h2>
              <button onClick={() => setFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-moss">
              Max weekend price (Kč)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="mb-4 w-full rounded-xl border border-mist px-3 py-2"
              placeholder="e.g. 7000"
            />

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-moss">Features</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {amenityOptions.map((a) => {
                const current = (params.get("amenities") || "").split(",").filter(Boolean);
                const on = current.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => {
                      const next = on ? current.filter((x) => x !== a) : [...current, a];
                      updateParam("amenities", next.join(",") || null);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      on ? "border-forest bg-forest text-cream" : "border-mist"
                    )}
                  >
                    {a}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateParam("maxPrice", maxPrice || null);
                  setFiltersOpen(false);
                }}
                className="flex-1 rounded-xl bg-forest py-3 text-sm font-semibold text-cream"
              >
                Apply on map
              </button>
              <button
                onClick={() => {
                  setMaxPrice("");
                  router.push(
                    `/explore?origin=${origin.city}&lat=${origin.lat}&lng=${origin.lng}&radius=${radiusKm}`
                  );
                  setFiltersOpen(false);
                }}
                className="rounded-xl border border-mist px-4 py-3 text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
