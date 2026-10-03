/**
 * Keyword-based natural language search.
 * Structured so an LLM layer can replace `parseNaturalQuery` later.
 */

export type SearchFilters = {
  originCity?: string;
  originLat?: number;
  originLng?: number;
  radiusKm?: number;
  maxDriveMinutes?: number;
  checkIn?: string;
  checkOut?: string;
  flexibleDates?: boolean;
  adults?: number;
  children?: number;
  pets?: number;
  types?: string[];
  amenities?: string[];
  environments?: string[];
  tripTypes?: string[];
  maxPriceCzk?: number;
  maxPricePerNightCzk?: number;
  categories?: string[];
  query?: string;
};

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  brno: { lat: 49.1951, lng: 16.6068 },
  prague: { lat: 50.0755, lng: 14.4378 },
  praha: { lat: 50.0755, lng: 14.4378 },
  olomouc: { lat: 49.5938, lng: 17.2509 },
  ostrava: { lat: 49.8209, lng: 18.2625 },
  bratislava: { lat: 48.1486, lng: 17.1077 },
  vienna: { lat: 48.2082, lng: 16.3738 },
  wien: { lat: 48.2082, lng: 16.3738 },
  krakow: { lat: 50.0647, lng: 19.945 },
  kraków: { lat: 50.0647, lng: 19.945 },
};

export function parseNaturalQuery(text: string): SearchFilters {
  const q = text.toLowerCase();
  const filters: SearchFilters = { query: text };

  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (q.includes(city)) {
      filters.originCity = city.charAt(0).toUpperCase() + city.slice(1);
      if (city === "praha") filters.originCity = "Prague";
      if (city === "wien") filters.originCity = "Vienna";
      if (city === "kraków") filters.originCity = "Kraków";
      filters.originLat = coords.lat;
      filters.originLng = coords.lng;
      break;
    }
  }

  const hourMatch = q.match(/(\d+)\s*hours?/);
  if (hourMatch) {
    filters.maxDriveMinutes = parseInt(hourMatch[1], 10) * 60;
    filters.radiusKm = parseInt(hourMatch[1], 10) * 70;
  }

  const kmMatch = q.match(/(\d+)\s*km/);
  if (kmMatch) {
    filters.radiusKm = parseInt(kmMatch[1], 10);
  }

  const priceMatch = q.match(/under\s*([\d\s.,]+)\s*(kč|czk|kc)?/i) ||
    q.match(/([\d\s.,]+)\s*(kč|czk)/i);
  if (priceMatch) {
    filters.maxPriceCzk = parseInt(priceMatch[1].replace(/[\s.,]/g, ""), 10);
  }

  if (q.includes("cabin") || q.includes("chata")) filters.types = [...(filters.types || []), "CABIN"];
  if (q.includes("tiny")) filters.types = [...(filters.types || []), "TINY_HOUSE"];
  if (q.includes("glamping") || q.includes("dome")) filters.types = [...(filters.types || []), "GLAMPING"];
  if (q.includes("tree")) filters.types = [...(filters.types || []), "TREE_HOUSE"];
  if (q.includes("castle") || q.includes("zámek")) filters.types = [...(filters.types || []), "CASTLE"];
  if (q.includes("farm")) filters.types = [...(filters.types || []), "FARM_STAY"];
  if (q.includes("cottage")) filters.types = [...(filters.types || []), "COTTAGE"];

  if (q.includes("hot tub") || q.includes("vířiv")) filters.amenities = [...(filters.amenities || []), "Private hot tub"];
  if (q.includes("sauna")) filters.amenities = [...(filters.amenities || []), "Sauna"];
  if (q.includes("fireplace") || q.includes("krb")) filters.amenities = [...(filters.amenities || []), "Fireplace"];
  if (q.includes("breakfast")) filters.amenities = [...(filters.amenities || []), "Breakfast"];

  if (q.includes("dog") || q.includes("pes") || q.includes("pet")) {
    filters.pets = 1;
    filters.tripTypes = [...(filters.tripTypes || []), "DOG_FRIENDLY"];
    filters.amenities = [...(filters.amenities || []), "Dogs allowed"];
  }
  if (q.includes("child") || q.includes("kids") || q.includes("family") || q.includes("děti")) {
    filters.children = Math.max(filters.children || 0, 1);
    filters.tripTypes = [...(filters.tripTypes || []), "FAMILY"];
  }
  if (q.includes("romantic") || q.includes("couple") || q.includes("for two")) {
    filters.adults = 2;
    filters.tripTypes = [...(filters.tripTypes || []), "ROMANTIC"];
  }
  if (q.includes("wellness") || q.includes("spa")) {
    filters.tripTypes = [...(filters.tripTypes || []), "WELLNESS"];
  }
  if (q.includes("nature") || q.includes("forest") || q.includes("přírod")) {
    filters.environments = [...(filters.environments || []), "FOREST", "COUNTRYSIDE"];
  }
  if (q.includes("mountain") || q.includes("alps") || q.includes("beskyd") || q.includes("jeseník")) {
    filters.environments = [...(filters.environments || []), "MOUNTAINS"];
  }
  if (q.includes("wine") || q.includes("víno")) {
    filters.tripTypes = [...(filters.tripTypes || []), "FOOD_WINE"];
    filters.environments = [...(filters.environments || []), "WINE_REGION"];
  }

  if (q.includes("next weekend")) {
    // handled by caller with getNextWeekend()
    filters.query = text;
  }
  if (q.includes("this weekend")) {
    filters.query = text;
  }

  const peopleMatch = q.match(/(\d+)\s*people|(\d+)\s*adults?|for\s*(\d+)/);
  if (peopleMatch) {
    const n = parseInt(peopleMatch[1] || peopleMatch[2] || peopleMatch[3], 10);
    if (!Number.isNaN(n)) filters.adults = n;
  }

  return filters;
}

/** Future: swap this for an LLM call that returns SearchFilters */
export async function smartSearch(text: string): Promise<SearchFilters> {
  return parseNaturalQuery(text);
}
