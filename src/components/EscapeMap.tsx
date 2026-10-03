"use client";

import { useEffect, useMemo, useState } from "react";
import { mapProvider } from "@/lib/map-provider";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { formatPrice, formatDriveTime, parseJsonArray, cn } from "@/lib/utils";
import { nearbyLayers } from "@/lib/brand";
import Link from "next/link";
import { Heart, Navigation, X, Star } from "lucide-react";

export type MapProperty = {
  id: string;
  slug: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  basePriceCzk: number;
  weekendPriceCzk: number | null;
  rating: number;
  images: string;
  tags: string;
  distanceKm: number;
  driveMinutes: number;
  tagline?: string | null;
};

export type MapNearby = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  distanceKm?: number | null;
};

type Props = {
  properties: MapProperty[];
  origin: { city: string; lat: number; lng: number };
  radiusKm: number;
  selectedId?: string | null;
  onSelect: (id: string | null) => void;
  nearby?: MapNearby[];
  activeLayers?: string[];
  onToggleLayer?: (id: string) => void;
  savedIds?: string[];
  onToggleSave?: (propertyId: string) => void;
  checkIn?: string;
  checkOut?: string;
};

function priceIcon(price: number, active: boolean) {
  return L.divIcon({
    className: "price-marker",
    html: `<div class="price-marker-inner ${active ? "active" : ""}">${formatPrice(price)}</div>`,
    iconSize: [90, 28],
    iconAnchor: [45, 14],
  });
}

function originIcon() {
  return L.divIcon({
    className: "price-marker",
    html: `<div class="origin-pulse"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function nearbyIcon(emoji: string) {
  return L.divIcon({
    className: "price-marker",
    html: `<div style="font-size:18px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function clusterIcon(count: number) {
  return L.divIcon({
    className: "price-marker",
    html: `<div class="cluster-marker">${count}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function FitBounds({
  properties,
  origin,
  radiusKm,
}: {
  properties: MapProperty[];
  origin: { lat: number; lng: number };
  radiusKm: number;
}) {
  const map = useMap();
  useEffect(() => {
    const points: L.LatLngExpression[] = [[origin.lat, origin.lng]];
    properties.forEach((p) => points.push([p.lat, p.lng]));
    if (points.length === 1 && radiusKm > 0) {
      map.setView([origin.lat, origin.lng], 8);
    } else {
      map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 10 });
    }
  }, [map, properties, origin, radiusKm]);
  return null;
}

/** Simple grid clustering when zoomed out */
function useClusters(properties: MapProperty[], zoom: number) {
  return useMemo(() => {
    if (zoom >= 9 || properties.length < 8) {
      return { clusters: [] as { lat: number; lng: number; count: number; ids: string[] }[], singles: properties };
    }
    const cell = zoom < 7 ? 1.2 : 0.6;
    const buckets = new Map<string, MapProperty[]>();
    for (const p of properties) {
      const key = `${Math.round(p.lat / cell)}_${Math.round(p.lng / cell)}`;
      const arr = buckets.get(key) || [];
      arr.push(p);
      buckets.set(key, arr);
    }
    const clusters: { lat: number; lng: number; count: number; ids: string[] }[] = [];
    const singles: MapProperty[] = [];
    for (const arr of buckets.values()) {
      if (arr.length >= 3) {
        clusters.push({
          lat: arr.reduce((s, x) => s + x.lat, 0) / arr.length,
          lng: arr.reduce((s, x) => s + x.lng, 0) / arr.length,
          count: arr.length,
          ids: arr.map((x) => x.id),
        });
      } else {
        singles.push(...arr);
      }
    }
    return { clusters, singles };
  }, [properties, zoom]);
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const update = () => onZoom(map.getZoom());
    update();
    map.on("zoomend", update);
    return () => {
      map.off("zoomend", update);
    };
  }, [map, onZoom]);
  return null;
}

export function EscapeMap({
  properties,
  origin,
  radiusKm,
  selectedId,
  onSelect,
  nearby = [],
  activeLayers = [],
  onToggleLayer,
  savedIds = [],
  onToggleSave,
  checkIn,
  checkOut,
}: Props) {
  const [zoom, setZoom] = useState(8);
  const selected = properties.find((p) => p.id === selectedId) || null;
  const { clusters, singles } = useClusters(properties, zoom);

  const layerEmoji = Object.fromEntries(nearbyLayers.map((l) => [l.id, l.emoji]));

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[origin.lat, origin.lng]}
        zoom={8}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution={mapProvider.attribution}
          url={mapProvider.tileUrl}
          maxZoom={mapProvider.maxZoom}
        />
        <ZoomWatcher onZoom={setZoom} />
        <FitBounds properties={properties} origin={origin} radiusKm={radiusKm} />

        <Marker position={[origin.lat, origin.lng]} icon={originIcon()} />
        {radiusKm > 0 && (
          <Circle
            center={[origin.lat, origin.lng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: "#c4784a",
              fillColor: "#c4784a",
              fillOpacity: 0.06,
              weight: 1.5,
              dashArray: "6 8",
            }}
          />
        )}

        {clusters.map((c) => (
          <Marker
            key={`c-${c.lat}-${c.lng}`}
            position={[c.lat, c.lng]}
            icon={clusterIcon(c.count)}
            eventHandlers={{
              click: () => {
                // select first in cluster as entry
                onSelect(c.ids[0]);
              },
            }}
          />
        ))}

        {singles.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={priceIcon(p.weekendPriceCzk ?? p.basePriceCzk, p.id === selectedId)}
            eventHandlers={{ click: () => onSelect(p.id) }}
            zIndexOffset={p.id === selectedId ? 1000 : 0}
          />
        ))}

        {nearby
          .filter((n) => activeLayers.includes(n.category))
          .map((n) => (
            <Marker
              key={n.id}
              position={[n.lat, n.lng]}
              icon={nearbyIcon(layerEmoji[n.category] || "📍")}
            />
          ))}
      </MapContainer>

      {/* Origin badge */}
      <div className="pointer-events-none absolute left-4 top-20 z-[500] rounded-2xl bg-cream/95 px-4 py-2 shadow-md backdrop-blur md:top-24">
        <p className="text-xs font-semibold uppercase tracking-wider text-clay">Starting point</p>
        <p className="font-display text-lg font-semibold text-forest">
          {origin.city}
          {radiusKm > 0 ? (
            <span className="ml-2 text-sm font-normal text-ink/60">{radiusKm} km radius</span>
          ) : null}
        </p>
        <p className="text-sm text-ink/60">{properties.length} stays on the map</p>
      </div>

      {/* Nearby layers */}
      {selected && onToggleLayer && (
        <div className="absolute bottom-[340px] left-4 right-4 z-[500] flex gap-2 overflow-x-auto pb-1 md:bottom-auto md:left-auto md:right-4 md:top-24 md:max-w-xs md:flex-col md:overflow-visible">
          <div className="rounded-2xl bg-cream/95 p-3 shadow-md backdrop-blur">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-moss">
              Around this stay
            </p>
            <div className="flex flex-wrap gap-1.5">
              {nearbyLayers.map((layer) => {
                const count = nearby.filter((n) => n.category === layer.id).length;
                if (!count) return null;
                const on = activeLayers.includes(layer.id);
                return (
                  <button
                    key={layer.id}
                    onClick={() => onToggleLayer(layer.id)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      on ? "border-forest bg-forest text-cream" : "border-mist bg-cream text-ink"
                    )}
                  >
                    {layer.emoji} {layer.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Preview card — bottom sheet on mobile */}
      {selected && (
        <div className="absolute inset-x-0 bottom-0 z-[600] animate-rise md:inset-x-auto md:bottom-6 md:left-6 md:w-[380px]">
          <div className="overflow-hidden rounded-t-3xl border border-mist bg-cream shadow-2xl md:rounded-3xl">
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-cream/90 p-1.5 shadow"
              onClick={() => onSelect(null)}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative h-40 w-full overflow-hidden md:h-44">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={parseJsonArray(selected.images)[0]}
                alt={selected.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl font-semibold text-forest">{selected.name}</h3>
                  <p className="text-sm text-ink/60">
                    {selected.city}, {selected.country}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-clay text-clay" />
                  {selected.rating.toFixed(1)}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {parseJsonArray(selected.tags)
                  .slice(0, 4)
                  .map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-sand px-2.5 py-0.5 text-xs font-medium text-forest"
                    >
                      {t}
                    </span>
                  ))}
              </div>
              <p className="mt-3 text-sm text-ink/70">
                {selected.distanceKm} km from {origin.city} · {formatDriveTime(selected.driveMinutes)}{" "}
                by car
              </p>
              <p className="mt-1 font-display text-lg font-semibold text-ink">
                From {formatPrice(selected.weekendPriceCzk ?? selected.basePriceCzk)}
                <span className="text-sm font-normal text-ink/50"> / night</span>
              </p>
              {(checkIn || checkOut) && (
                <p className="mt-1 text-xs text-ink/50">
                  {checkIn && checkOut ? `${checkIn} → ${checkOut}` : "Flexible dates"}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/stays/${selected.slug}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}` : ""}`}
                  className="flex-1 rounded-xl bg-forest py-2.5 text-center text-sm font-semibold text-cream hover:bg-moss"
                >
                  View stay
                </Link>
                <a
                  href={`https://www.openstreetmap.org/directions?from=${origin.lat},${origin.lng}&to=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-mist px-3 hover:bg-sand"
                  title="Directions"
                >
                  <Navigation className="h-4 w-4 text-forest" />
                </a>
                {onToggleSave && (
                  <button
                    onClick={() => onToggleSave(selected.id)}
                    className="inline-flex items-center justify-center rounded-xl border border-mist px-3 hover:bg-sand"
                    title="Save"
                  >
                    <Heart
                      className={cn(
                        "h-4 w-4",
                        savedIds.includes(selected.id) ? "fill-clay text-clay" : "text-forest"
                      )}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
