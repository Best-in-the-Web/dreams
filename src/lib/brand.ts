/**
 * Brand config — change these values to rebrand without hunting through components.
 */
export const brand = {
  name: "EscapeMap",
  tagline: "Where do you want to escape this weekend?",
  shortTagline: "Discover unusual stays within driving distance",
  currency: "Kč",
  locale: "cs-CZ",
  defaultOrigin: {
    city: "Brno",
    lat: 49.1951,
    lng: 16.6068,
  },
  colors: {
    // Warm forest-olive + soft sand — premium European, not Booking purple
    forest: "#2F4A3C",
    moss: "#4A6B58",
    sand: "#F3EEE6",
    clay: "#C4784A",
    ink: "#1C1A17",
    mist: "#E8E2D8",
    cream: "#FAF7F2",
  },
} as const;

export const tripCategories = [
  { id: "for-two", label: "For two", emoji: "❤️", tripTypes: ["ROMANTIC"], filters: { adults: 2 } },
  { id: "with-children", label: "With children", emoji: "👨‍👩‍👧", tripTypes: ["FAMILY"], filters: {} },
  { id: "with-dog", label: "With a dog", emoji: "🐕", tripTypes: ["DOG_FRIENDLY"], amenities: ["Dogs allowed"] },
  { id: "nature", label: "Nature", emoji: "🌲", environments: ["FOREST", "COUNTRYSIDE"] },
  { id: "cabins", label: "Cabins & tiny houses", emoji: "🔥", types: ["CABIN", "TINY_HOUSE", "COTTAGE"] },
  { id: "unusual", label: "Something unusual", emoji: "✨", types: ["GLAMPING", "TREE_HOUSE", "CASTLE", "OTHER"] },
  { id: "wellness", label: "Wellness", emoji: "💆", tripTypes: ["WELLNESS"], amenities: ["Private hot tub", "Sauna"] },
  { id: "food-wine", label: "Food & wine", emoji: "🍷", tripTypes: ["FOOD_WINE"], environments: ["WINE_REGION"] },
  { id: "active", label: "Active weekend", emoji: "🚲", tripTypes: ["ADVENTURE"] },
  { id: "mountains", label: "Mountains", emoji: "🏔", environments: ["MOUNTAINS"] },
  { id: "water", label: "Water", emoji: "🌊", environments: ["LAKE", "RIVER"] },
  { id: "stars", label: "Under the stars", emoji: "⭐", types: ["GLAMPING", "TINY_HOUSE"] },
] as const;

export const radiusOptions = [
  { label: "50 km", value: 50 },
  { label: "100 km", value: 100 },
  { label: "150 km", value: 150 },
  { label: "200 km", value: 200 },
  { label: "300 km", value: 300 },
  { label: "Any distance", value: 0 },
] as const;

export const nearbyLayers = [
  { id: "NATURE", label: "Nature", emoji: "🌲" },
  { id: "HIKING", label: "Hiking", emoji: "🥾" },
  { id: "RESTAURANT", label: "Restaurants", emoji: "🍴" },
  { id: "CAFE", label: "Cafés", emoji: "☕" },
  { id: "ATTRACTION", label: "Attractions", emoji: "🏰" },
  { id: "SWIMMING", label: "Swimming", emoji: "🏊" },
  { id: "CYCLING", label: "Cycling", emoji: "🚲" },
  { id: "CHILDREN", label: "For children", emoji: "👨‍👩‍👧" },
  { id: "DOG_FRIENDLY", label: "Dog-friendly", emoji: "🐕" },
  { id: "SHOP", label: "Shops", emoji: "🛒" },
] as const;

export const amenityOptions = [
  "Private hot tub",
  "Sauna",
  "Pool",
  "Fireplace",
  "Breakfast",
  "Restaurant",
  "Kitchen",
  "Fenced garden",
  "EV charging",
  "Wi-Fi",
  "Air conditioning",
  "Dogs allowed",
  "Children welcome",
  "No neighbours nearby",
] as const;

export const cities = [
  { city: "Brno", lat: 49.1951, lng: 16.6068, country: "CZ" },
  { city: "Prague", lat: 50.0755, lng: 14.4378, country: "CZ" },
  { city: "Olomouc", lat: 49.5938, lng: 17.2509, country: "CZ" },
  { city: "Ostrava", lat: 49.8209, lng: 18.2625, country: "CZ" },
  { city: "Bratislava", lat: 48.1486, lng: 17.1077, country: "SK" },
  { city: "Vienna", lat: 48.2082, lng: 16.3738, country: "AT" },
  { city: "Kraków", lat: 50.0647, lng: 19.945, country: "PL" },
] as const;
