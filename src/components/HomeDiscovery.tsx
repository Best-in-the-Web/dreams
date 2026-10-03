"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { brand, tripCategories, radiusOptions, cities } from "@/lib/brand";
import { useDiscoveryStore } from "@/lib/store";
import { getThisWeekend, getNextWeekend, cn } from "@/lib/utils";
import { Search } from "lucide-react";

export function HomeDiscovery() {
  const router = useRouter();
  const store = useDiscoveryStore();
  const [smartQuery, setSmartQuery] = useState("");
  const [customRadius, setCustomRadius] = useState("");
  const [smartLoading, setSmartLoading] = useState(false);

  const goToMap = () => {
    const filters = store.buildFilters();
    let checkIn = store.checkIn;
    let checkOut = store.checkOut;
    if (store.dateMode === "this-weekend") {
      const w = getThisWeekend();
      checkIn = w.checkIn;
      checkOut = w.checkOut;
      store.setDateMode("this-weekend", checkIn, checkOut);
    } else if (store.dateMode === "next-weekend") {
      const w = getNextWeekend();
      checkIn = w.checkIn;
      checkOut = w.checkOut;
      store.setDateMode("next-weekend", checkIn, checkOut);
    }

    const params = new URLSearchParams();
    params.set("origin", filters.originCity || store.originCity);
    params.set("lat", String(filters.originLat || store.originLat));
    params.set("lng", String(filters.originLng || store.originLng));
    params.set("radius", String(filters.radiusKm ?? store.radiusKm));
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (store.adults) params.set("adults", String(store.adults));
    if (store.children) params.set("children", String(store.children));
    if (store.pets) params.set("pets", String(store.pets));
    if (store.categories.length) params.set("categories", store.categories.join(","));
    if (filters.types?.length) params.set("types", filters.types.join(","));
    if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","));
    if (filters.environments?.length) params.set("environments", filters.environments.join(","));
    if (filters.tripTypes?.length) params.set("tripTypes", filters.tripTypes.join(","));
    router.push(`/explore?${params.toString()}`);
  };

  const runSmartSearch = async () => {
    if (!smartQuery.trim()) return;
    setSmartLoading(true);
    try {
      const res = await fetch("/api/smart-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: smartQuery }),
      });
      const data = await res.json();
      store.applySmartFilters(data.filters);
      if (smartQuery.toLowerCase().includes("next weekend")) {
        const w = getNextWeekend();
        store.setDateMode("next-weekend", w.checkIn, w.checkOut);
      } else if (
        smartQuery.toLowerCase().includes("this weekend") ||
        smartQuery.toLowerCase().includes("weekend")
      ) {
        const w = getThisWeekend();
        store.setDateMode("this-weekend", w.checkIn, w.checkOut);
      }
      const f = data.filters;
      const params = new URLSearchParams();
      params.set("origin", f.originCity || store.originCity);
      params.set("lat", String(f.originLat || store.originLat));
      params.set("lng", String(f.originLng || store.originLng));
      params.set("radius", String(f.radiusKm || store.radiusKm || 200));
      if (f.adults) params.set("adults", String(f.adults));
      if (f.children) params.set("children", String(f.children));
      if (f.pets) params.set("pets", String(f.pets));
      if (f.types?.length) params.set("types", f.types.join(","));
      if (f.amenities?.length) params.set("amenities", f.amenities.join(","));
      if (f.environments?.length) params.set("environments", f.environments.join(","));
      if (f.tripTypes?.length) params.set("tripTypes", f.tripTypes.join(","));
      if (f.maxPriceCzk) params.set("maxPrice", String(f.maxPriceCzk));
      if (store.checkIn) params.set("checkIn", store.checkIn);
      if (store.checkOut) params.set("checkOut", store.checkOut);
      params.set("q", smartQuery);
      router.push(`/explore?${params.toString()}`);
    } finally {
      setSmartLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(74,107,88,0.18), transparent),
            radial-gradient(ellipse 60% 40% at 90% 10%, rgba(196,120,74,0.12), transparent),
            linear-gradient(180deg, #faf7f2 0%, #ebe4d8 45%, #f3eee6 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-50"
        style={{
          // Lakeside cycling stop — forest edge, water, soft evening light
          backgroundImage:
            "url(https://images.unsplash.com/photo-1654482276870-d2c4aabc067a?auto=format&fit=crop&w=2000&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 92%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 92%)",
        }}
      />

      <section className="mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-center px-4 pb-16 pt-10 md:px-6 md:pt-16">
        <p className="animate-rise font-display text-4xl font-semibold text-forest sm:text-5xl md:text-6xl lg:text-7xl">
          {brand.name}
        </p>
        <h1
          className="animate-rise mt-4 max-w-3xl font-display text-2xl font-medium leading-tight text-ink sm:text-3xl md:text-4xl"
          style={{ animationDelay: "80ms" }}
        >
          {brand.tagline}
        </h1>
        <p
          className="animate-rise mt-4 max-w-xl text-lg text-ink/70"
          style={{ animationDelay: "140ms" }}
        >
          Choose the kind of weekend you want. We&apos;ll show unusual stays you can actually drive
          to.
        </p>

        <div className="animate-rise mt-8" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-col gap-2 rounded-2xl border border-mist bg-cream/90 p-2 shadow-sm backdrop-blur sm:flex-row">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 shrink-0 text-moss" />
              <input
                value={smartQuery}
                onChange={(e) => setSmartQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSmartSearch()}
                placeholder='e.g. “cabin for two with hot tub, max 2 hours from Brno, under 7,000 Kč”'
                className="w-full bg-transparent py-3 text-base outline-none placeholder:text-ink/40"
              />
            </div>
            <button
              onClick={runSmartSearch}
              disabled={smartLoading}
              className="rounded-xl bg-forest px-5 py-3 text-sm font-semibold text-cream hover:bg-moss disabled:opacity-60"
            >
              {smartLoading ? "Searching…" : "Find on map"}
            </button>
          </div>
        </div>

        <div className="animate-rise mt-12" style={{ animationDelay: "260ms" }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-moss">
            What kind of escape?
          </p>
          <div className="flex flex-wrap gap-2.5">
            {tripCategories.map((cat) => {
              const active = store.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => store.toggleCategory(cat.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left transition-all",
                    active
                      ? "border-forest bg-forest text-cream shadow-md scale-[1.02]"
                      : "border-mist bg-cream/80 text-ink hover:border-moss hover:bg-sand"
                  )}
                >
                  <span className="mr-2 text-lg">{cat.emoji}</span>
                  <span className="text-sm font-semibold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="animate-rise mt-10 grid gap-8 md:grid-cols-3"
          style={{ animationDelay: "320ms" }}
        >
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-moss">
              Starting from
            </p>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <button
                  key={c.city}
                  onClick={() => store.setOrigin(c.city, c.lat, c.lng)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                    store.originCity === c.city
                      ? "border-clay bg-clay text-cream"
                      : "border-mist bg-cream hover:border-clay/50"
                  )}
                >
                  {c.city}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-moss">How far?</p>
            <div className="flex flex-wrap gap-2">
              {radiusOptions.map((r) => (
                <button
                  key={r.label}
                  onClick={() => {
                    setCustomRadius("");
                    store.setRadius(r.value);
                  }}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                    store.radiusKm === r.value && !customRadius
                      ? "border-forest bg-forest text-cream"
                      : "border-mist bg-cream hover:border-forest/40"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                placeholder="Custom km"
                value={customRadius}
                onChange={(e) => {
                  setCustomRadius(e.target.value);
                  const v = parseInt(e.target.value, 10);
                  if (!Number.isNaN(v) && v > 0) store.setRadius(v);
                }}
                className="w-28 rounded-full border border-mist bg-cream px-3 py-1.5 text-sm outline-none focus:border-forest"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-moss">When?</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["this-weekend", "This weekend"],
                  ["next-weekend", "Next weekend"],
                  ["flexible", "Flexible"],
                ] as const
              ).map(([mode, label]) => (
                <button
                  key={mode}
                  onClick={() => store.setDateMode(mode)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                    store.dateMode === mode
                      ? "border-forest bg-forest text-cream"
                      : "border-mist bg-cream hover:border-forest/40"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                type="date"
                value={store.checkIn}
                onChange={(e) => store.setDateMode("choose", e.target.value, store.checkOut)}
                className="rounded-full border border-mist bg-cream px-3 py-1.5 text-sm"
              />
              <input
                type="date"
                value={store.checkOut}
                onChange={(e) => store.setDateMode("choose", store.checkIn, e.target.value)}
                className="rounded-full border border-mist bg-cream px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        <div
          className="animate-rise mt-8 flex flex-wrap items-end gap-6"
          style={{ animationDelay: "380ms" }}
        >
          {(
            [
              ["Adults", store.adults, (n: number) => store.setGuests(n, store.children, store.pets)],
              [
                "Children",
                store.children,
                (n: number) => store.setGuests(store.adults, n, store.pets),
              ],
              ["Pets", store.pets, (n: number) => store.setGuests(store.adults, store.children, n)],
            ] as const
          ).map(([label, value, setter]) => (
            <div key={label}>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-moss">{label}</p>
              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 rounded-full border border-mist bg-cream text-lg leading-none hover:bg-sand"
                  onClick={() => setter(Math.max(0, value - 1))}
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{value}</span>
                <button
                  className="h-8 w-8 rounded-full border border-mist bg-cream text-lg leading-none hover:bg-sand"
                  onClick={() => setter(value + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="animate-rise mt-10" style={{ animationDelay: "420ms" }}>
          <button
            onClick={goToMap}
            className="rounded-2xl bg-clay px-8 py-4 text-base font-semibold text-cream shadow-lg shadow-clay/25 transition hover:scale-[1.02] hover:bg-[#b56a3d]"
          >
            Show places on the map
          </button>
          <p className="mt-3 text-sm text-ink/50">
            {store.categories.length
              ? `${store.categories.length} vibe${store.categories.length > 1 ? "s" : ""} selected · `
              : ""}
            {store.originCity} · {store.radiusKm === 0 ? "any distance" : `${store.radiusKm} km`}
          </p>
        </div>
      </section>
    </div>
  );
}
