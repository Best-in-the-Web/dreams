"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchFilters } from "./smart-search";
import { brand } from "./brand";

type DiscoveryState = {
  step: number;
  categories: string[];
  originCity: string;
  originLat: number;
  originLng: number;
  radiusKm: number;
  dateMode: "this-weekend" | "next-weekend" | "choose" | "flexible";
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  pets: number;
  filters: SearchFilters;
  setCategories: (ids: string[]) => void;
  toggleCategory: (id: string) => void;
  setOrigin: (city: string, lat: number, lng: number) => void;
  setRadius: (km: number) => void;
  setDateMode: (mode: DiscoveryState["dateMode"], checkIn?: string, checkOut?: string) => void;
  setGuests: (adults: number, children: number, pets: number) => void;
  setStep: (step: number) => void;
  buildFilters: () => SearchFilters;
  applySmartFilters: (f: SearchFilters) => void;
  reset: () => void;
};

const initial = {
  step: 0,
  categories: [] as string[],
  originCity: brand.defaultOrigin.city,
  originLat: brand.defaultOrigin.lat,
  originLng: brand.defaultOrigin.lng,
  radiusKm: 200,
  dateMode: "this-weekend" as const,
  checkIn: "",
  checkOut: "",
  adults: 2,
  children: 0,
  pets: 0,
  filters: {} as SearchFilters,
};

export const useDiscoveryStore = create<DiscoveryState>()(
  persist(
    (set, get) => ({
      ...initial,
      setCategories: (ids) => set({ categories: ids }),
      toggleCategory: (id) =>
        set((s) => ({
          categories: s.categories.includes(id)
            ? s.categories.filter((c) => c !== id)
            : [...s.categories, id],
        })),
      setOrigin: (city, lat, lng) => set({ originCity: city, originLat: lat, originLng: lng }),
      setRadius: (km) => set({ radiusKm: km }),
      setDateMode: (mode, checkIn, checkOut) =>
        set({
          dateMode: mode,
          checkIn: checkIn ?? "",
          checkOut: checkOut ?? "",
        }),
      setGuests: (adults, children, pets) => set({ adults, children, pets }),
      setStep: (step) => set({ step }),
      buildFilters: () => {
        const s = get();
        const filters: SearchFilters = {
          originCity: s.originCity,
          originLat: s.originLat,
          originLng: s.originLng,
          radiusKm: s.radiusKm,
          adults: s.adults,
          children: s.children,
          pets: s.pets,
          categories: s.categories,
          checkIn: s.checkIn || undefined,
          checkOut: s.checkOut || undefined,
          flexibleDates: s.dateMode === "flexible",
          types: [],
          amenities: [],
          environments: [],
          tripTypes: [],
        };

        // Map category ids → filter facets via brand.tripCategories logic inline
        const catMap: Record<string, Partial<SearchFilters>> = {
          "for-two": { tripTypes: ["ROMANTIC"], adults: 2 },
          "with-children": { tripTypes: ["FAMILY"] },
          "with-dog": { tripTypes: ["DOG_FRIENDLY"], amenities: ["Dogs allowed"], pets: 1 },
          nature: { environments: ["FOREST", "COUNTRYSIDE"] },
          cabins: { types: ["CABIN", "TINY_HOUSE", "COTTAGE"] },
          unusual: { types: ["GLAMPING", "TREE_HOUSE", "CASTLE", "OTHER"] },
          wellness: { tripTypes: ["WELLNESS"], amenities: ["Private hot tub", "Sauna"] },
          "food-wine": { tripTypes: ["FOOD_WINE"], environments: ["WINE_REGION"] },
          active: { tripTypes: ["ADVENTURE"] },
          mountains: { environments: ["MOUNTAINS"] },
          water: { environments: ["LAKE", "RIVER"] },
          stars: { types: ["GLAMPING", "TINY_HOUSE"] },
        };

        for (const id of s.categories) {
          const m = catMap[id];
          if (!m) continue;
          if (m.types) filters.types = [...new Set([...(filters.types || []), ...m.types])];
          if (m.amenities)
            filters.amenities = [...new Set([...(filters.amenities || []), ...m.amenities])];
          if (m.environments)
            filters.environments = [
              ...new Set([...(filters.environments || []), ...m.environments]),
            ];
          if (m.tripTypes)
            filters.tripTypes = [...new Set([...(filters.tripTypes || []), ...m.tripTypes])];
          if (m.pets) filters.pets = Math.max(filters.pets || 0, m.pets);
          if (m.adults) filters.adults = m.adults;
        }

        set({ filters });
        return filters;
      },
      applySmartFilters: (f) =>
        set({
          filters: f,
          originCity: f.originCity ?? get().originCity,
          originLat: f.originLat ?? get().originLat,
          originLng: f.originLng ?? get().originLng,
          radiusKm: f.radiusKm ?? get().radiusKm,
          adults: f.adults ?? get().adults,
          children: f.children ?? get().children,
          pets: f.pets ?? get().pets,
        }),
      reset: () => set(initial),
    }),
    { name: "escapemap-discovery" }
  )
);
