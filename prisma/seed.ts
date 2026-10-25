import { PrismaClient, PropertyType, TripType, Environment, NearbyCategory, PartnerStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

type SeedProperty = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  whySpecial: string;
  type: PropertyType;
  city: string;
  country: string;
  lat: number;
  lng: number;
  basePriceCzk: number;
  weekendPriceCzk: number;
  guestCapacity: number;
  beds: number;
  amenities: string[];
  tripTypes: TripType[];
  environments: Environment[];
  tags: string[];
  rating: number;
  childrenPolicy: string;
  petPolicy: string;
  images: string[];
  packages: {
    name: string;
    slug: string;
    description: string;
    priceCzk: number;
    includes: string[];
    tripType?: TripType;
  }[];
  nearby: {
    name: string;
    category: NearbyCategory;
    lat: number;
    lng: number;
    distanceKm: number;
    description?: string;
  }[];
};

const properties: SeedProperty[] = [
  {
    slug: "forest-cube-beskydy",
    name: "Forest Cube Beskydy",
    tagline: "A glass cube in the trees with a private hot tub",
    description:
      "Wake up among the beeches in a contemporary tiny house perched above a quiet Beskydy valley. Floor-to-ceiling glass, a wood stove, and a steaming hot tub under the stars.",
    whySpecial: "Total privacy, designer interiors, and a hot tub with forest views — yet only about two hours from Brno.",
    type: "TINY_HOUSE",
    city: "Frenštát pod Radhoštěm",
    country: "CZ",
    lat: 49.5482,
    lng: 18.2108,
    basePriceCzk: 4490,
    weekendPriceCzk: 5490,
    guestCapacity: 2,
    beds: 1,
    amenities: ["Private hot tub", "Fireplace", "Kitchen", "Wi-Fi", "Dogs allowed", "No neighbours nearby"],
    tripTypes: ["ROMANTIC", "DOG_FRIENDLY", "RELAX"],
    environments: ["FOREST", "MOUNTAINS"],
    tags: ["Tiny house", "Dogs welcome", "Private hot tub"],
    rating: 4.9,
    childrenPolicy: "Best for adults; children 12+ welcome.",
    petPolicy: "Dogs welcome (max 1). No extra fee.",
    images: [unsplash("photo-1520250497591-112f2f40a3f4"), unsplash("photo-1510798831973-bcc53124e4a0"), unsplash("photo-1449158743715-0a90ebb6d2d8")],
    packages: [
      {
        name: "Romantic Weekend",
        slug: "romantic-weekend",
        description: "Two nights with hot tub, breakfast basket and prosecco.",
        priceCzk: 6990,
        includes: ["2 nights", "Private hot tub", "Breakfast basket", "Bottle of prosecco", "Late checkout"],
        tripType: "ROMANTIC",
      },
      {
        name: "Dog Weekend",
        slug: "dog-weekend",
        description: "Bring your dog for forest walks and a fenced garden.",
        priceCzk: 5990,
        includes: ["2 nights", "Dog included", "Welcome dog package", "Nearby forest trails"],
        tripType: "DOG_FRIENDLY",
      },
    ],
    nearby: [
      { name: "Radhošť ridge trail", category: "HIKING", lat: 49.491, lng: 18.223, distanceKm: 8, description: "Iconic Beskydy hike" },
      { name: "Pustevny viewpoint", category: "NATURE", lat: 49.489, lng: 18.265, distanceKm: 12 },
      { name: "Koliba U Záryša", category: "RESTAURANT", lat: 49.55, lng: 18.22, distanceKm: 3 },
      { name: "Rožnov Open-Air Museum", category: "ATTRACTION", lat: 49.458, lng: 18.143, distanceKm: 15 },
      { name: "Forest café", category: "CAFE", lat: 49.545, lng: 18.205, distanceKm: 2 },
    ],
  },
  {
    slug: "vinohrad-cabin-mikulov",
    name: "Vinohrad Cabin Mikulov",
    tagline: "Wine-country cabin above the Pálava hills",
    description:
      "A restored wine cabin with panoramic views over South Moravian vineyards. Taste local whites on the terrace, then cycle between cellars.",
    whySpecial: "You sleep inside a working vineyard landscape — sunrise over Pálava is unforgettable.",
    type: "CABIN",
    city: "Mikulov",
    country: "CZ",
    lat: 48.8056,
    lng: 16.6378,
    basePriceCzk: 3900,
    weekendPriceCzk: 4900,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Kitchen", "Wi-Fi", "Breakfast", "Children welcome", "EV charging"],
    tripTypes: ["FOOD_WINE", "ROMANTIC", "FAMILY"],
    environments: ["WINE_REGION", "COUNTRYSIDE"],
    tags: ["Wine region", "Cabin", "Pálava views"],
    rating: 4.8,
    childrenPolicy: "Children welcome. Cot available on request.",
    petPolicy: "Pets not allowed.",
    images: [unsplash("photo-1500076656116-558758c991c1"), unsplash("photo-1464822759023-fed622ff2c3b"), unsplash("photo-1414235077428-338989a2e8c0")],
    packages: [
      {
        name: "Wine Escape",
        slug: "wine-escape",
        description: "Two nights with tasting for two and breakfast.",
        priceCzk: 6490,
        includes: ["2 nights", "Wine tasting for 2", "Breakfast", "Cellar map"],
        tripType: "FOOD_WINE",
      },
    ],
    nearby: [
      { name: "Mikulov Castle", category: "ATTRACTION", lat: 48.8069, lng: 16.6375, distanceKm: 1 },
      { name: "Holy Hill (Svatý kopeček)", category: "HIKING", lat: 48.812, lng: 16.65, distanceKm: 2 },
      { name: "Nové Mlýny lakes", category: "SWIMMING", lat: 48.85, lng: 16.72, distanceKm: 12 },
      { name: "Pavlov Winery", category: "RESTAURANT", lat: 48.874, lng: 16.672, distanceKm: 10 },
    ],
  },
  {
    slug: "jeseniky-eagle-cottage",
    name: "Eagle Nest Jeseníky",
    tagline: "Mountain cottage with sauna and endless trails",
    description:
      "A classic Jeseníky wooden cottage modernised for comfort. Sauna after long ridge walks, fireplace in the evening, stars at night.",
    whySpecial: "Gateway to Praděd trails with a proper Finnish sauna waiting when you return.",
    type: "COTTAGE",
    city: "Karlova Studánka",
    country: "CZ",
    lat: 50.0731,
    lng: 17.3067,
    basePriceCzk: 4200,
    weekendPriceCzk: 5200,
    guestCapacity: 6,
    beds: 3,
    amenities: ["Sauna", "Fireplace", "Kitchen", "Wi-Fi", "Children welcome", "Dogs allowed", "Fenced garden"],
    tripTypes: ["FAMILY", "ADVENTURE", "DOG_FRIENDLY", "WELLNESS"],
    environments: ["MOUNTAINS", "FOREST"],
    tags: ["Mountains", "Sauna", "Family"],
    rating: 4.7,
    childrenPolicy: "Children of all ages welcome. High chair available.",
    petPolicy: "Dogs welcome in fenced garden. 300 Kč/night.",
    images: [unsplash("photo-1518780664697-55e3abfb2956"), unsplash("photo-1542718610-a1d656d1884c"), unsplash("photo-1501785888041-af3ef285b470")],
    packages: [
      {
        name: "Family Weekend",
        slug: "family-weekend",
        description: "Two nights with breakfast and family-friendly extras.",
        priceCzk: 7490,
        includes: ["2 nights", "Breakfast", "Children under 6 free", "Late checkout", "Trail map"],
        tripType: "FAMILY",
      },
    ],
    nearby: [
      { name: "Praděd trailhead", category: "HIKING", lat: 50.083, lng: 17.231, distanceKm: 8 },
      { name: "White water pool", category: "SWIMMING", lat: 50.07, lng: 17.3, distanceKm: 1 },
      { name: "Spa colonnade", category: "ATTRACTION", lat: 50.073, lng: 17.307, distanceKm: 0.5 },
      { name: "Dog forest loop", category: "DOG_FRIENDLY", lat: 50.075, lng: 17.31, distanceKm: 1 },
    ],
  },
  {
    slug: "slovak-canopy-treehouse",
    name: "Canopy Treehouse Malá Fatra",
    tagline: "Sleep in the canopy above a Slovak mountain stream",
    description:
      "A handcrafted tree house suspended among spruce. Rope bridge entrance, panoramic deck, and the sound of the river below.",
    whySpecial: "Genuine tree-house romance with mountain hiking from the door.",
    type: "TREE_HOUSE",
    city: "Terchová",
    country: "SK",
    lat: 49.2558,
    lng: 19.0319,
    basePriceCzk: 4800,
    weekendPriceCzk: 5800,
    guestCapacity: 2,
    beds: 1,
    amenities: ["Private hot tub", "Kitchen", "No neighbours nearby", "Wi-Fi"],
    tripTypes: ["ROMANTIC", "ADVENTURE", "RELAX"],
    environments: ["FOREST", "MOUNTAINS"],
    tags: ["Tree house", "Hot tub", "Malá Fatra"],
    rating: 4.95,
    childrenPolicy: "Adults only (safety).",
    petPolicy: "Pets not allowed.",
    images: [unsplash("photo-1520250497591-112f2f40a3f4"), unsplash("photo-1478131143081-80f7f84ca84d"), unsplash("photo-1504280390367-361c6d9f38f4")],
    packages: [
      {
        name: "Romantic Weekend",
        slug: "romantic-weekend",
        description: "Two nights with hot tub and breakfast hamper.",
        priceCzk: 7990,
        includes: ["2 nights", "Hot tub", "Breakfast hamper", "Prosecco"],
        tripType: "ROMANTIC",
      },
    ],
    nearby: [
      { name: "Jánošíkove Diery Gorge", category: "HIKING", lat: 49.25, lng: 19.05, distanceKm: 4 },
      { name: "Vrátna valley", category: "NATURE", lat: 49.23, lng: 19.03, distanceKm: 6 },
      { name: "Koliba Terchová", category: "RESTAURANT", lat: 49.256, lng: 19.03, distanceKm: 1 },
    ],
  },
  {
    slug: "alpine-hut-schneeberg",
    name: "Schneeberg Alpine Cabin",
    tagline: "Austrian alpine cabin with mountain panorama",
    description:
      "A cosy alpine cabin beneath Schneeberg. Wood interiors, mountain breakfast culture, and alpine meadows for summer walks.",
    whySpecial: "True Alps feeling within a comfortable drive from Brno via Vienna.",
    type: "CABIN",
    city: "Puchberg am Schneeberg",
    country: "AT",
    lat: 47.7872,
    lng: 15.8989,
    basePriceCzk: 5200,
    weekendPriceCzk: 6200,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Fireplace", "Kitchen", "Wi-Fi", "Breakfast", "Children welcome"],
    tripTypes: ["FAMILY", "ADVENTURE", "RELAX"],
    environments: ["MOUNTAINS"],
    tags: ["Alps", "Cabin", "Panorama"],
    rating: 4.8,
    childrenPolicy: "Children welcome.",
    petPolicy: "Pets on request.",
    images: [unsplash("photo-1464822759023-fed622ff2c3b"), unsplash("photo-1486870591958-9b9d0d1dda99"), unsplash("photo-1506905925346-21bda4d32df4")],
    packages: [
      {
        name: "Alpine Weekend",
        slug: "alpine-weekend",
        description: "Two nights with mountain breakfast.",
        priceCzk: 8490,
        includes: ["2 nights", "Mountain breakfast", "Trail tips"],
        tripType: "ADVENTURE",
      },
    ],
    nearby: [
      { name: "Schneeberg cog railway", category: "ATTRACTION", lat: 47.79, lng: 15.9, distanceKm: 2 },
      { name: "Alpine meadow loop", category: "HIKING", lat: 47.8, lng: 15.91, distanceKm: 3 },
      { name: "Gasthof zur Bahn", category: "RESTAURANT", lat: 47.787, lng: 15.9, distanceKm: 1 },
    ],
  },
  {
    slug: "polish-glamping-dome",
    name: "Star Dome Pieniny",
    tagline: "Transparent glamping dome under Polish mountain skies",
    description:
      "A geodesic dome with a transparent roof for stargazing. Comfortable bed, wood stove, and the Dunajec gorge nearby.",
    whySpecial: "Fall asleep watching the Milky Way — proper glamping, not a tent.",
    type: "GLAMPING",
    city: "Sromowce Niżne",
    country: "PL",
    lat: 49.405,
    lng: 20.41,
    basePriceCzk: 4100,
    weekendPriceCzk: 5100,
    guestCapacity: 2,
    beds: 1,
    amenities: ["Fireplace", "Private hot tub", "Kitchen", "No neighbours nearby"],
    tripTypes: ["ROMANTIC", "ADVENTURE", "RELAX"],
    environments: ["MOUNTAINS", "RIVER"],
    tags: ["Glamping", "Stars", "Hot tub"],
    rating: 4.85,
    childrenPolicy: "Adults preferred; children 10+ OK.",
    petPolicy: "Pets not allowed.",
    images: [unsplash("photo-1504280390367-361c6d9f38f4"), unsplash("photo-1478131143081-80f7f84ca84d"), unsplash("photo-1537905569824-f89f14cceb68")],
    packages: [
      {
        name: "Under the Stars",
        slug: "under-the-stars",
        description: "Two nights with hot tub and stargazing kit.",
        priceCzk: 7290,
        includes: ["2 nights", "Hot tub", "Stargazing kit", "Breakfast"],
        tripType: "ROMANTIC",
      },
    ],
    nearby: [
      { name: "Dunajec rafting", category: "ATTRACTION", lat: 49.41, lng: 20.42, distanceKm: 2 },
      { name: "Trzy Korony", category: "HIKING", lat: 49.413, lng: 20.413, distanceKm: 5 },
      { name: "River café", category: "CAFE", lat: 49.406, lng: 20.41, distanceKm: 1 },
    ],
  },
  {
    slug: "lednice-orangery-suite",
    name: "Lednice Orangery Hideaway",
    tagline: "Boutique stay by the Lednice UNESCO gardens",
    description:
      "An unusual boutique suite in a restored orangery wing. Step outside into UNESCO palace gardens and a maze of parks.",
    whySpecial: "Sleep next to one of Central Europe's most beautiful historic landscapes.",
    type: "HOTEL",
    city: "Lednice",
    country: "CZ",
    lat: 48.7997,
    lng: 16.8036,
    basePriceCzk: 3600,
    weekendPriceCzk: 4500,
    guestCapacity: 2,
    beds: 1,
    amenities: ["Breakfast", "Wi-Fi", "Air conditioning", "Restaurant", "EV charging"],
    tripTypes: ["ROMANTIC", "FOOD_WINE", "RELAX"],
    environments: ["COUNTRYSIDE", "WINE_REGION"],
    tags: ["Boutique", "UNESCO", "Gardens"],
    rating: 4.75,
    childrenPolicy: "Children welcome.",
    petPolicy: "Small pets on request.",
    images: [unsplash("photo-1566073771259-6a8506099945"), unsplash("photo-1582719478250-c89cae4dc85b"), unsplash("photo-1551882547-ff40c63fe5fa")],
    packages: [
      {
        name: "Garden Romance",
        slug: "garden-romance",
        description: "Two nights with breakfast and garden tickets.",
        priceCzk: 5990,
        includes: ["2 nights", "Breakfast", "Garden tickets", "Late checkout"],
        tripType: "ROMANTIC",
      },
    ],
    nearby: [
      { name: "Lednice Castle", category: "ATTRACTION", lat: 48.802, lng: 16.805, distanceKm: 0.5 },
      { name: "Minaret walk", category: "HIKING", lat: 48.81, lng: 16.81, distanceKm: 2 },
      { name: "Wine bar Apollo", category: "RESTAURANT", lat: 48.8, lng: 16.803, distanceKm: 0.3 },
    ],
  },
  {
    slug: "moravian-karst-cave-cabin",
    name: "Karst Edge Cabin",
    tagline: "Cabin above the Moravian Karst gorges",
    description:
      "A modern cabin on the rim of the Moravian Karst. Visit Punkva caves in the morning, grill on the deck in the evening.",
    whySpecial: "Dramatic limestone landscape minutes from the door — still an easy drive from Brno.",
    type: "CABIN",
    city: "Blansko",
    country: "CZ",
    lat: 49.3633,
    lng: 16.6445,
    basePriceCzk: 3400,
    weekendPriceCzk: 4200,
    guestCapacity: 5,
    beds: 3,
    amenities: ["Kitchen", "Fireplace", "Wi-Fi", "Children welcome", "Dogs allowed", "Fenced garden"],
    tripTypes: ["FAMILY", "ADVENTURE", "DOG_FRIENDLY"],
    environments: ["FOREST", "COUNTRYSIDE"],
    tags: ["Near Brno", "Karst", "Family"],
    rating: 4.7,
    childrenPolicy: "Ideal for families. Play corner indoors.",
    petPolicy: "Dogs welcome. Fenced garden.",
    images: [unsplash("photo-1449158743715-0a90ebb6d2d8"), unsplash("photo-1499696010180-025ef6e1a8f9"), unsplash("photo-1501785888041-af3ef285b470")],
    packages: [
      {
        name: "Family Weekend",
        slug: "family-weekend",
        description: "Two nights with cave tickets for the family.",
        priceCzk: 6990,
        includes: ["2 nights", "Punkva cave tickets", "Breakfast", "Children under 6 free"],
        tripType: "FAMILY",
      },
    ],
    nearby: [
      { name: "Punkva Caves", category: "ATTRACTION", lat: 49.37, lng: 16.72, distanceKm: 8 },
      { name: "Macocha abyss", category: "NATURE", lat: 49.373, lng: 16.729, distanceKm: 9 },
      { name: "Children's forest path", category: "CHILDREN", lat: 49.365, lng: 16.65, distanceKm: 2 },
      { name: "Blansko brewery", category: "RESTAURANT", lat: 49.363, lng: 16.644, distanceKm: 1 },
    ],
  },
  {
    slug: "valachian-farm-stay",
    name: "Valachian Meadow Farm",
    tagline: "Farm stay with animals, meadows and homemade breakfast",
    description:
      "A welcoming farm in Wallachia. Collect eggs, meet sheep, and eat breakfast with products from the farm.",
    whySpecial: "Real farm life without sacrificing clean, comfortable rooms.",
    type: "FARM_STAY",
    city: "Vizovice",
    country: "CZ",
    lat: 49.2228,
    lng: 17.8503,
    basePriceCzk: 2800,
    weekendPriceCzk: 3500,
    guestCapacity: 8,
    beds: 4,
    amenities: ["Breakfast", "Kitchen", "Children welcome", "Dogs allowed", "Fenced garden", "Wi-Fi"],
    tripTypes: ["FAMILY", "DOG_FRIENDLY", "RELAX"],
    environments: ["COUNTRYSIDE", "FOREST"],
    tags: ["Farm", "Kids", "Breakfast"],
    rating: 4.9,
    childrenPolicy: "Wonderful for children. Animal feeding supervised.",
    petPolicy: "Dogs welcome if friendly with farm animals.",
    images: [unsplash("photo-1500382017468-9049fed747ef"), unsplash("photo-1416879595882-3373a0480b5b"), unsplash("photo-1464226184884-fa280b87c399")],
    packages: [
      {
        name: "Family Farm Weekend",
        slug: "family-farm",
        description: "Two nights with breakfast and farm activities.",
        priceCzk: 5990,
        includes: ["2 nights", "Farm breakfast", "Animal feeding", "Children under 6 free"],
        tripType: "FAMILY",
      },
    ],
    nearby: [
      { name: "Vizovice distillery tour", category: "ATTRACTION", lat: 49.223, lng: 17.85, distanceKm: 2 },
      { name: "Meadow bike loop", category: "CYCLING", lat: 49.22, lng: 17.86, distanceKm: 3 },
      { name: "Farm shop", category: "SHOP", lat: 49.223, lng: 17.851, distanceKm: 0.2 },
      { name: "Playground meadow", category: "CHILDREN", lat: 49.222, lng: 17.849, distanceKm: 0.1 },
    ],
  },
  {
    slug: "cesky-krumlov-tower-suite",
    name: "Tower Suite Český Krumlov",
    tagline: "Historic tower room above the UNESCO old town",
    description:
      "A romantic suite in a medieval tower with river views. Cobblestone streets, castle gardens, and candlelit dinners below.",
    whySpecial: "You don't visit the fairy-tale town — you sleep inside it.",
    type: "CASTLE",
    city: "Český Krumlov",
    country: "CZ",
    lat: 48.8107,
    lng: 14.3152,
    basePriceCzk: 5500,
    weekendPriceCzk: 6800,
    guestCapacity: 2,
    beds: 1,
    amenities: ["Breakfast", "Wi-Fi", "Restaurant", "Air conditioning"],
    tripTypes: ["ROMANTIC", "FOOD_WINE"],
    environments: ["CITY", "RIVER"],
    tags: ["Castle", "UNESCO", "Romantic"],
    rating: 4.85,
    childrenPolicy: "Adults preferred (steep stairs).",
    petPolicy: "Pets not allowed.",
    images: [unsplash("photo-1566073771259-6a8506099945"), unsplash("photo-1520250497591-112f2f40a3f4"), unsplash("photo-1551882547-ff40c63fe5fa")],
    packages: [
      {
        name: "Romantic Weekend",
        slug: "romantic-weekend",
        description: "Two nights with breakfast and castle tickets.",
        priceCzk: 8990,
        includes: ["2 nights", "Breakfast", "Castle tickets", "Prosecco"],
        tripType: "ROMANTIC",
      },
    ],
    nearby: [
      { name: "Krumlov Castle", category: "ATTRACTION", lat: 48.8127, lng: 14.3175, distanceKm: 0.3 },
      { name: "Vltava rafting", category: "ATTRACTION", lat: 48.81, lng: 14.32, distanceKm: 0.5 },
      { name: "Nonnenmühle", category: "RESTAURANT", lat: 48.811, lng: 14.316, distanceKm: 0.2 },
    ],
  },
  {
    slug: "brdy-forest-sauna-house",
    name: "Brdy Sauna House",
    tagline: "Forest house with outdoor sauna near Prague & Brno midpoint",
    description:
      "A quiet forest hideaway in the Brdy hills. Outdoor wood-fired sauna, cold plunge barrel, and kilometres of trails.",
    whySpecial: "Serious wellness ritual in a former military forest wilderness.",
    type: "COTTAGE",
    city: "Obecnice",
    country: "CZ",
    lat: 49.715,
    lng: 13.94,
    basePriceCzk: 4000,
    weekendPriceCzk: 5000,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Sauna", "Private hot tub", "Fireplace", "Kitchen", "Wi-Fi", "No neighbours nearby"],
    tripTypes: ["WELLNESS", "ROMANTIC", "RELAX"],
    environments: ["FOREST"],
    tags: ["Sauna", "Forest", "Wellness"],
    rating: 4.9,
    childrenPolicy: "Children 8+ welcome.",
    petPolicy: "Pets not allowed (sauna rules).",
    images: [unsplash("photo-1542718610-a1d656d1884c"), unsplash("photo-1515362778563-6a8d0eb89d1a"), unsplash("photo-1510798831973-bcc53124e4a0")],
    packages: [
      {
        name: "Wellness Weekend",
        slug: "wellness-weekend",
        description: "Two nights with sauna ritual and breakfast basket.",
        priceCzk: 7490,
        includes: ["2 nights", "Sauna wood included", "Hot tub", "Breakfast basket"],
        tripType: "WELLNESS",
      },
    ],
    nearby: [
      { name: "Brdy lookout", category: "HIKING", lat: 49.72, lng: 13.95, distanceKm: 4 },
      { name: "Forest lake", category: "SWIMMING", lat: 49.71, lng: 13.93, distanceKm: 3 },
      { name: "Village pub", category: "RESTAURANT", lat: 49.715, lng: 13.94, distanceKm: 1 },
    ],
  },
  {
    slug: "lipno-lake-tiny-house",
    name: "Lipno Water Tiny House",
    tagline: "Tiny house on stilts by Lipno lake",
    description:
      "A Scandinavian-style tiny house steps from Lipno. SUP boards, cycling paths, and summer swimming.",
    whySpecial: "Water mornings and forest afternoons — perfect active family base.",
    type: "TINY_HOUSE",
    city: "Černá v Pošumaví",
    country: "CZ",
    lat: 48.738,
    lng: 14.11,
    basePriceCzk: 3700,
    weekendPriceCzk: 4600,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Kitchen", "Wi-Fi", "Children welcome", "Dogs allowed", "EV charging"],
    tripTypes: ["FAMILY", "ADVENTURE", "DOG_FRIENDLY"],
    environments: ["LAKE", "FOREST"],
    tags: ["Lake", "Tiny house", "Active"],
    rating: 4.75,
    childrenPolicy: "Family-friendly. Life jackets available.",
    petPolicy: "Dogs welcome.",
    images: [unsplash("photo-1501785888041-af3ef285b470"), unsplash("photo-1476514525535-07fb3b4ae5f1"), unsplash("photo-1449824913935-59a10b8d2000")],
    packages: [
      {
        name: "Active Lake Weekend",
        slug: "active-lake",
        description: "Two nights with bike hire tips and lake map.",
        priceCzk: 6490,
        includes: ["2 nights", "SUP tips", "Cycle map", "Late checkout"],
        tripType: "ADVENTURE",
      },
    ],
    nearby: [
      { name: "Lipno beach", category: "SWIMMING", lat: 48.74, lng: 14.12, distanceKm: 1 },
      { name: "Lipno cycle path", category: "CYCLING", lat: 48.738, lng: 14.11, distanceKm: 0.2 },
      { name: "Boat café", category: "CAFE", lat: 48.739, lng: 14.115, distanceKm: 1 },
      { name: "Kids adventure park", category: "CHILDREN", lat: 48.75, lng: 14.15, distanceKm: 8 },
    ],
  },
  {
    slug: "tatra-chalet-zakopane",
    name: "Giewont View Chalet",
    tagline: "Polish Tatra chalet with mountain drama",
    description:
      "A wooden chalet near Zakopane with views toward Giewont. Ideal for hiking weekends and highland cuisine.",
    whySpecial: "High-mountain energy with cosy evenings by the fireplace.",
    type: "COTTAGE",
    city: "Zakopane",
    country: "PL",
    lat: 49.2992,
    lng: 19.9496,
    basePriceCzk: 4500,
    weekendPriceCzk: 5500,
    guestCapacity: 6,
    beds: 3,
    amenities: ["Fireplace", "Kitchen", "Wi-Fi", "Children welcome", "Sauna"],
    tripTypes: ["FAMILY", "ADVENTURE", "WELLNESS"],
    environments: ["MOUNTAINS"],
    tags: ["Tatra", "Chalet", "Hiking"],
    rating: 4.8,
    childrenPolicy: "Children welcome.",
    petPolicy: "Pets on request.",
    images: [unsplash("photo-1486870591958-9b9d0d1dda99"), unsplash("photo-1464822759023-fed622ff2c3b"), unsplash("photo-1518780664697-55e3abfb2956")],
    packages: [
      {
        name: "Mountain Family",
        slug: "mountain-family",
        description: "Two nights with highland breakfast.",
        priceCzk: 7990,
        includes: ["2 nights", "Breakfast", "Trail tips"],
        tripType: "FAMILY",
      },
    ],
    nearby: [
      { name: "Krupówki promenade", category: "ATTRACTION", lat: 49.294, lng: 19.958, distanceKm: 3 },
      { name: "Dolina Białego", category: "HIKING", lat: 49.28, lng: 19.95, distanceKm: 5 },
      { name: "Oscypek market", category: "SHOP", lat: 49.295, lng: 19.96, distanceKm: 3 },
    ],
  },
  {
    slug: "bratislava-danube-glamping",
    name: "Danube Willow Glamping",
    tagline: "Riverside glamping tents near Bratislava",
    description:
      "Stylish canvas tents under willows on a Danube side-arm. Kayaks, birdwatching, and city culture a short drive away.",
    whySpecial: "Nature reset with Bratislava cafés still within reach.",
    type: "GLAMPING",
    city: "Šamorín",
    country: "SK",
    lat: 48.0267,
    lng: 17.3097,
    basePriceCzk: 3200,
    weekendPriceCzk: 4000,
    guestCapacity: 3,
    beds: 1,
    amenities: ["Private hot tub", "Breakfast", "Wi-Fi", "Children welcome", "Dogs allowed"],
    tripTypes: ["ROMANTIC", "FAMILY", "DOG_FRIENDLY", "RELAX"],
    environments: ["RIVER", "COUNTRYSIDE"],
    tags: ["Glamping", "Danube", "Hot tub"],
    rating: 4.7,
    childrenPolicy: "Children welcome. Life jackets for water play.",
    petPolicy: "Dogs welcome on leash.",
    images: [unsplash("photo-1537905569824-f89f14cceb68"), unsplash("photo-1504280390367-361c6d9f38f4"), unsplash("photo-1478131143081-80f7f84ca84d")],
    packages: [
      {
        name: "River Romance",
        slug: "river-romance",
        description: "Two nights with hot tub and breakfast.",
        priceCzk: 5990,
        includes: ["2 nights", "Hot tub", "Breakfast", "Kayak tips"],
        tripType: "ROMANTIC",
      },
    ],
    nearby: [
      { name: "Danube cycle path", category: "CYCLING", lat: 48.027, lng: 17.31, distanceKm: 0.5 },
      { name: "Bird wetland", category: "NATURE", lat: 48.03, lng: 17.32, distanceKm: 2 },
      { name: "Fish restaurant", category: "RESTAURANT", lat: 48.025, lng: 17.308, distanceKm: 1 },
      { name: "Dog beach", category: "DOG_FRIENDLY", lat: 48.028, lng: 17.312, distanceKm: 1 },
    ],
  },
  {
    slug: "podyji-river-cottage",
    name: "Podyjí River Cottage",
    tagline: "Cottage on the edge of Podyjí National Park",
    description:
      "A stone cottage above the Dyje river meanders. Quiet, green, and perfect for hikers and photographers.",
    whySpecial: "One of Czechia's most dramatic river canyons — without tourist crowds.",
    type: "COTTAGE",
    city: "Čížov",
    country: "CZ",
    lat: 48.875,
    lng: 15.873,
    basePriceCzk: 3300,
    weekendPriceCzk: 4100,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Kitchen", "Fireplace", "Wi-Fi", "Dogs allowed", "Children welcome", "No neighbours nearby"],
    tripTypes: ["ADVENTURE", "DOG_FRIENDLY", "RELAX", "FAMILY"],
    environments: ["FOREST", "RIVER"],
    tags: ["National park", "Quiet", "Hiking"],
    rating: 4.85,
    childrenPolicy: "Children welcome; supervise near cliffs.",
    petPolicy: "Dogs welcome on trails (leash in park).",
    images: [unsplash("photo-1499696010180-025ef6e1a8f9"), unsplash("photo-1449158743715-0a90ebb6d2d8"), unsplash("photo-1501785888041-af3ef285b470")],
    packages: [
      {
        name: "Park Explorer",
        slug: "park-explorer",
        description: "Two nights with hiking map and picnic basket.",
        priceCzk: 5790,
        includes: ["2 nights", "Picnic basket", "Park map"],
        tripType: "ADVENTURE",
      },
    ],
    nearby: [
      { name: "Šobes vineyard trail", category: "HIKING", lat: 48.86, lng: 15.9, distanceKm: 5 },
      { name: "Hardegg viewpoint", category: "NATURE", lat: 48.85, lng: 15.86, distanceKm: 6 },
      { name: "Znojmo old town", category: "ATTRACTION", lat: 48.855, lng: 16.049, distanceKm: 18 },
    ],
  },
  {
    slug: "wine-cellar-loft-valtice",
    name: "Cellar Loft Valtice",
    tagline: "Sleep above a historic wine cellar",
    description:
      "An unusual loft apartment above a working cellar in the Valtice wine town. Degustations downstairs, bikes upstairs.",
    whySpecial: "Accommodation and wine culture in one atmospheric building.",
    type: "APARTMENT",
    city: "Valtice",
    country: "CZ",
    lat: 48.7408,
    lng: 16.755,
    basePriceCzk: 2900,
    weekendPriceCzk: 3600,
    guestCapacity: 3,
    beds: 1,
    amenities: ["Kitchen", "Wi-Fi", "Breakfast", "EV charging", "Air conditioning"],
    tripTypes: ["FOOD_WINE", "ROMANTIC"],
    environments: ["WINE_REGION", "CITY"],
    tags: ["Wine", "Unusual", "Cellar"],
    rating: 4.8,
    childrenPolicy: "Children 8+ welcome.",
    petPolicy: "Pets not allowed.",
    images: [unsplash("photo-1414235077428-338989a2e8c0"), unsplash("photo-1500076656116-558758c991c1"), unsplash("photo-1517248135467-4c7edcad34c4")],
    packages: [
      {
        name: "Cellar & Sleep",
        slug: "cellar-sleep",
        description: "Two nights with tasting for two.",
        priceCzk: 5490,
        includes: ["2 nights", "Wine tasting", "Breakfast"],
        tripType: "FOOD_WINE",
      },
    ],
    nearby: [
      { name: "Valtice Castle", category: "ATTRACTION", lat: 48.741, lng: 16.756, distanceKm: 0.4 },
      { name: "Lednice-Valtice path", category: "CYCLING", lat: 48.75, lng: 16.78, distanceKm: 5 },
      { name: "Wine salon", category: "RESTAURANT", lat: 48.741, lng: 16.755, distanceKm: 0.2 },
    ],
  },
  {
    slug: "white-carpathian-sheepfold",
    name: "White Carpathian Sheepfold",
    tagline: "Converted sheepfold on flower meadows",
    description:
      "A poetic conversion of an old sheepfold in the White Carpathians. Meadows full of orchids in spring, silence all year.",
    whySpecial: "UNESCO biosphere meadows and almost no light pollution.",
    type: "OTHER",
    city: "Nová Lhota",
    country: "CZ",
    lat: 48.866,
    lng: 17.58,
    basePriceCzk: 3100,
    weekendPriceCzk: 3900,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Fireplace", "Kitchen", "Dogs allowed", "Children welcome", "No neighbours nearby"],
    tripTypes: ["RELAX", "DOG_FRIENDLY", "FAMILY", "ADVENTURE"],
    environments: ["COUNTRYSIDE", "MOUNTAINS"],
    tags: ["Unusual", "Meadows", "Quiet"],
    rating: 4.9,
    childrenPolicy: "Children welcome.",
    petPolicy: "Dogs very welcome.",
    images: [unsplash("photo-1500382017468-9049fed747ef"), unsplash("photo-1470071459604-3b5ec3a7fe05"), unsplash("photo-1441974231531-c6227db76b6e")],
    packages: [
      {
        name: "Meadow Slow Weekend",
        slug: "meadow-slow",
        description: "Two nights with breakfast basket.",
        priceCzk: 5290,
        includes: ["2 nights", "Breakfast basket", "Star map"],
        tripType: "RELAX",
      },
    ],
    nearby: [
      { name: "Orchid meadows", category: "NATURE", lat: 48.87, lng: 17.59, distanceKm: 2 },
      { name: "Ridge walk", category: "HIKING", lat: 48.86, lng: 17.57, distanceKm: 3 },
      { name: "Village shop", category: "SHOP", lat: 48.865, lng: 17.581, distanceKm: 1 },
    ],
  },
  {
    slug: "vienna-woods-cabin",
    name: "Vienna Woods Hideout",
    tagline: "Cabin in the Wienerwald with city day-trip option",
    description:
      "A green refuge in the Vienna Woods. Morning forest walks, afternoon museums in Vienna, evening fireplace.",
    whySpecial: "Combines nature escape with one of Europe's great cities.",
    type: "CABIN",
    city: "Purkersdorf",
    country: "AT",
    lat: 48.205,
    lng: 16.175,
    basePriceCzk: 4800,
    weekendPriceCzk: 5800,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Kitchen", "Wi-Fi", "Fireplace", "Children welcome", "EV charging"],
    tripTypes: ["FAMILY", "RELAX", "FOOD_WINE"],
    environments: ["FOREST", "COUNTRYSIDE"],
    tags: ["Near Vienna", "Forest", "Cabin"],
    rating: 4.75,
    childrenPolicy: "Children welcome.",
    petPolicy: "Pets on request.",
    images: [unsplash("photo-1518780664697-55e3abfb2956"), unsplash("photo-1449158743715-0a90ebb6d2d8"), unsplash("photo-1506905925346-21bda4d32df4")],
    packages: [
      {
        name: "Woods & City",
        slug: "woods-city",
        description: "Two nights with Vienna transport tips.",
        priceCzk: 7990,
        includes: ["2 nights", "City day-trip guide", "Breakfast"],
        tripType: "RELAX",
      },
    ],
    nearby: [
      { name: "Wienerwald trails", category: "HIKING", lat: 48.21, lng: 16.17, distanceKm: 2 },
      { name: "Heuriger wine tavern", category: "RESTAURANT", lat: 48.2, lng: 16.18, distanceKm: 3 },
      { name: "Forest playground", category: "CHILDREN", lat: 48.206, lng: 16.176, distanceKm: 1 },
    ],
  },
  {
    slug: "bohemian-paradise-rock-cabin",
    name: "Rock Gate Cabin",
    tagline: "Cabin beneath sandstone towers of Bohemian Paradise",
    description:
      "Wake among sandstone rock towns. Climbing, hiking, and fairy-tale formations everywhere you look.",
    whySpecial: "Bohemian Paradise scenery with a private cabin basecamp.",
    type: "CABIN",
    city: "Hrubá Skála",
    country: "CZ",
    lat: 50.547,
    lng: 15.19,
    basePriceCzk: 3800,
    weekendPriceCzk: 4700,
    guestCapacity: 5,
    beds: 3,
    amenities: ["Kitchen", "Fireplace", "Wi-Fi", "Children welcome", "Dogs allowed"],
    tripTypes: ["FAMILY", "ADVENTURE", "DOG_FRIENDLY"],
    environments: ["FOREST", "COUNTRYSIDE"],
    tags: ["Sandstone", "Hiking", "Family"],
    rating: 4.8,
    childrenPolicy: "Great for adventurous families.",
    petPolicy: "Dogs welcome.",
    images: [unsplash("photo-1464822759023-fed622ff2c3b"), unsplash("photo-1441974231531-c6227db76b6e"), unsplash("photo-1501785888041-af3ef285b470")],
    packages: [
      {
        name: "Rock Family Weekend",
        slug: "rock-family",
        description: "Two nights with climbing gym voucher nearby.",
        priceCzk: 6990,
        includes: ["2 nights", "Trail map", "Breakfast"],
        tripType: "FAMILY",
      },
    ],
    nearby: [
      { name: "Hruboskalsko towers", category: "HIKING", lat: 50.55, lng: 15.195, distanceKm: 1 },
      { name: "Trosky castle", category: "ATTRACTION", lat: 50.516, lng: 15.23, distanceKm: 8 },
      { name: "Climbing café", category: "CAFE", lat: 50.548, lng: 15.19, distanceKm: 0.5 },
    ],
  },
  {
    slug: "thermal-wellness-loft-heviz",
    name: "Thermal Garden Loft",
    tagline: "Wellness loft near Austrian-Slovak border spas",
    description:
      "A calm loft apartment designed for recovery weekends — sauna, yoga deck, and day trips to regional thermal baths.",
    whySpecial: "Built for digital detox and slow wellness, not nightlife.",
    type: "APARTMENT",
    city: "Piešťany area",
    country: "SK",
    lat: 48.594,
    lng: 17.833,
    basePriceCzk: 3500,
    weekendPriceCzk: 4300,
    guestCapacity: 2,
    beds: 1,
    amenities: ["Sauna", "Private hot tub", "Wi-Fi", "Air conditioning", "Breakfast"],
    tripTypes: ["WELLNESS", "ROMANTIC", "RELAX"],
    environments: ["COUNTRYSIDE", "RIVER"],
    tags: ["Wellness", "Sauna", "Quiet"],
    rating: 4.85,
    childrenPolicy: "Adults only.",
    petPolicy: "Pets not allowed.",
    images: [unsplash("photo-1515362778563-6a8d0eb89d1a"), unsplash("photo-1540555700478-4be289fbecef"), unsplash("photo-1542718610-a1d656d1884c")],
    packages: [
      {
        name: "Reset Weekend",
        slug: "reset-weekend",
        description: "Two nights with spa ritual and healthy breakfast.",
        priceCzk: 6990,
        includes: ["2 nights", "Sauna ritual", "Hot tub", "Healthy breakfast"],
        tripType: "WELLNESS",
      },
    ],
    nearby: [
      { name: "Spa park", category: "NATURE", lat: 48.59, lng: 17.83, distanceKm: 1 },
      { name: "River walk", category: "HIKING", lat: 48.595, lng: 17.835, distanceKm: 2 },
      { name: "Healthy café", category: "CAFE", lat: 48.594, lng: 17.832, distanceKm: 0.5 },
    ],
  },
  {
    slug: "ostrava-industrial-loft-nature",
    name: "Black Meadow Cabin",
    tagline: "Design cabin between industrial heritage and Beskydy foothills",
    description:
      "A bold black cabin near Ostrava's edge — visit Dolní Vítkovice by day, disappear into foothill forests by evening.",
    whySpecial: "Contrast weekend: industrial culture + nature silence.",
    type: "CABIN",
    city: "Frýdek-Místek",
    country: "CZ",
    lat: 49.685,
    lng: 18.35,
    basePriceCzk: 3600,
    weekendPriceCzk: 4400,
    guestCapacity: 4,
    beds: 2,
    amenities: ["Kitchen", "Wi-Fi", "Fireplace", "Children welcome", "EV charging", "Dogs allowed"],
    tripTypes: ["FAMILY", "ADVENTURE", "DOG_FRIENDLY", "WORK_RETREAT"],
    environments: ["FOREST", "COUNTRYSIDE"],
    tags: ["Design", "Near Ostrava", "Cabin"],
    rating: 4.7,
    childrenPolicy: "Children welcome.",
    petPolicy: "Dogs welcome.",
    images: [unsplash("photo-1518780664697-55e3abfb2956"), unsplash("photo-1499696010180-025ef6e1a8f9"), unsplash("photo-1449158743715-0a90ebb6d2d8")],
    packages: [
      {
        name: "Design Escape",
        slug: "design-escape",
        description: "Two nights with breakfast.",
        priceCzk: 6290,
        includes: ["2 nights", "Breakfast", "Late checkout"],
        tripType: "RELAX",
      },
    ],
    nearby: [
      { name: "Ondřejník trail", category: "HIKING", lat: 49.65, lng: 18.35, distanceKm: 8 },
      { name: "Dolní Vítkovice", category: "ATTRACTION", lat: 49.82, lng: 18.28, distanceKm: 20 },
      { name: "Dog forest path", category: "DOG_FRIENDLY", lat: 49.686, lng: 18.351, distanceKm: 1 },
      { name: "Family bike trail", category: "CYCLING", lat: 49.684, lng: 18.348, distanceKm: 2 },
    ],
  },
];

async function main() {
  console.log("Seeding EscapeMap...");

  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favourite.deleteMany();
  await prisma.nearbyPlace.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.price.deleteMany();
  await prisma.package.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.internalNote.deleteMany();
  await prisma.task.deleteMany();
  await prisma.property.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("demo1234", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@escapemap.local",
      name: "Anna Nováková",
      passwordHash,
      role: "ADMIN",
      phone: "+420 777 000 001",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "demo@escapemap.local",
      name: "Jan Svoboda",
      passwordHash,
      role: "CUSTOMER",
      phone: "+420 777 000 002",
    },
  });

  const noteDates = [
    "Owner interested in joining.",
    "Agreed 15% commission.",
    "Photos received.",
    "Waiting for contract.",
    "Property published.",
  ];

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const partner = await prisma.partner.create({
      data: {
        businessName: `${p.name} s.r.o.`,
        propertyName: p.name,
        contactPerson: `Partner ${i + 1}`,
        phone: `+420 60${(1000000 + i).toString().slice(0, 7)}`,
        email: `partner${i + 1}@example.com`,
        address: `${p.city}, ${p.country}`,
        lat: p.lat,
        lng: p.lng,
        status: PartnerStatus.ACTIVE,
        contractStatus: "SIGNED",
        commissionModel: "PERCENTAGE",
        commissionPercent: 15,
        paymentDetails: "Bank transfer — CZ demo IBAN",
        internalTags: JSON.stringify(["mvp", p.country.toLowerCase()]),
        accountManagerId: admin.id,
      },
    });

    for (let n = 0; n < Math.min(3, noteDates.length); n++) {
      const d = new Date();
      d.setDate(d.getDate() - (20 - n * 4));
      await prisma.internalNote.create({
        data: {
          partnerId: partner.id,
          authorId: admin.id,
          body: noteDates[n],
          createdAt: d,
        },
      });
    }

    if (i % 4 === 0) {
      await prisma.task.create({
        data: {
          partnerId: partner.id,
          assigneeId: admin.id,
          title: "Follow up on seasonal pricing",
          description: "Confirm autumn weekend rates.",
          dueDate: new Date(Date.now() + 7 * 86400000),
          status: "OPEN",
        },
      });
    }

    const property = await prisma.property.create({
      data: {
        partnerId: partner.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        whySpecial: p.whySpecial,
        type: p.type,
        address: p.city,
        city: p.city,
        country: p.country,
        lat: p.lat,
        lng: p.lng,
        guestCapacity: p.guestCapacity,
        beds: p.beds,
        childrenPolicy: p.childrenPolicy,
        petPolicy: p.petPolicy,
        parking: "Free on-site parking",
        foodOptions: p.amenities.includes("Breakfast")
          ? "Breakfast available; kitchen for self-catering"
          : "Self-catering kitchen",
        cancellation: "Free cancellation up to 7 days before arrival. 50% refund up to 48 hours.",
        basePriceCzk: p.basePriceCzk,
        weekendPriceCzk: p.weekendPriceCzk,
        rating: p.rating,
        reviewCount: Math.floor(12 + Math.random() * 40),
        published: true,
        images: JSON.stringify(p.images),
        amenities: JSON.stringify(p.amenities),
        tripTypes: JSON.stringify(p.tripTypes),
        environments: JSON.stringify(p.environments),
        tags: JSON.stringify(p.tags),
      },
    });

    const unit = await prisma.unit.create({
      data: {
        propertyId: property.id,
        name: "Entire place",
        capacity: p.guestCapacity,
        beds: p.beds,
        basePriceCzk: p.basePriceCzk,
        minStay: 1,
        description: "Book the entire stay",
      },
    });

    // Availability for next 90 days — block ~15% randomly
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let d = 0; d < 90; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + d);
      const blocked = Math.random() < 0.12;
      await prisma.availability.create({
        data: {
          unitId: unit.id,
          date,
          available: !blocked,
          blocked,
        },
      });
      const isWeekend = date.getDay() === 5 || date.getDay() === 6 || date.getDay() === 0;
      await prisma.price.create({
        data: {
          unitId: unit.id,
          date,
          priceCzk: isWeekend ? p.weekendPriceCzk : p.basePriceCzk,
        },
      });
    }

    for (const pkg of p.packages) {
      await prisma.package.create({
        data: {
          propertyId: property.id,
          name: pkg.name,
          slug: pkg.slug,
          description: pkg.description,
          nights: 2,
          priceCzk: pkg.priceCzk,
          includes: JSON.stringify(pkg.includes),
          maxGuests: p.guestCapacity,
          tripType: pkg.tripType,
          active: true,
        },
      });
    }

    for (const np of p.nearby) {
      await prisma.nearbyPlace.create({
        data: {
          propertyId: property.id,
          name: np.name,
          category: np.category,
          description: np.description,
          lat: np.lat,
          lng: np.lng,
          distanceKm: np.distanceKm,
        },
      });
    }
  }

  // Demo favourite
  const favProp = await prisma.property.findFirst({ where: { slug: "forest-cube-beskydy" } });
  if (favProp) {
    await prisma.favourite.create({
      data: { userId: customer.id, propertyId: favProp.id },
    });
  }

  console.log(`Seeded ${properties.length} properties.`);
  console.log("Admin: admin@escapemap.local / demo1234");
  console.log("Customer: demo@escapemap.local / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
