/**
 * Map provider abstraction — currently Leaflet + OpenStreetMap.
 * Swap tile URL / implementation later for Mapbox or Google Maps.
 */
export type MapProviderConfig = {
  id: "leaflet-osm" | "mapbox" | "google";
  tileUrl: string;
  attribution: string;
  maxZoom: number;
};

export const mapProvider: MapProviderConfig = {
  id: "leaflet-osm",
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
};
