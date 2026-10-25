# Product and MVP scope

## The idea

EscapeMap helps a traveller answer: “What kind of weekend do we want, and what interesting places can we reach?” It combines map-based discovery with experience packages inspired by travel marketplaces such as TravelKing. It focuses on cabins, tiny houses, glamping, cottages, tree houses, farm stays, wellness retreats, and unusual boutique or historic accommodation.

The primary flow is **trip preferences → origin and travel radius → interactive map → stay preview → destination exploration → stay detail → booking**. A long hotel list should not replace the map as the main interface.

## Example journey

A family starts from Brno with two adults, two children, and a dog. They choose Nature, a 200 km radius, and this weekend. The intended experience shows suitable stays on the map, lets them compare marker previews, inspect nearby walks/restaurants/children's activities, and select a package with clear dates and pricing.

In the current prototype, the radius is straight-line distance and driving time is a rough estimate. Selected dates are passed through parts of the flow, but results do not guarantee availability. Treat this journey as discovery plus a simulated reservation.

## Current capabilities

| Area | Present in the repository | Remaining work |
| --- | --- | --- |
| Discovery | Multiple trip categories; predefined origins; custom radius; dates and guest controls | Stronger validation and consistent transfer of preferences between screens |
| Map | Leaflet/OSM, origin/radius circle, price markers, simple clustering and marker previews | Production tile plan, accessible interactions, performance at larger inventory sizes |
| Nearby exploration | Category layers and seeded points for the selected stay | Verified partner-supplied data or an external places provider |
| Search | Published properties filtered by distance, capacity, amenities, type, environment, pets, trip type, and sample budget | Inventory/date-aware search, accurate trip totals, scalable geographic queries |
| Natural-language search | English keywords plus some Czech aliases produce structured filters | Robust intent/date/guest parsing; optional LLM integration; complete parameter propagation |
| Stay detail | Photos, policies, packages, reviews, nearby points and booking widget | Availability calendar and authoritative date-based quotes |
| Booking/payment | Booking/payment records, cost breakdown, redirect to mock confirmation | Server validation, inventory reservation, real payment verification, cancellations/refunds |
| Customer account | Registration/login, trips, favourites and saved-place cards | Secure sessions, profile editing, saved-only map filtering |
| Admin | Partner creation; partner status/commission editing; notes/tasks; property views and publish toggle; booking views/economics | Full property/unit/package/price/availability editors, task completion, booking lifecycle actions |
| Reviews | Signed-in user can review their own booking; one review per booking | Enforce completed-stay eligibility and rating validation; update aggregates |

The saved-place page has a “View all on map” link, but its `saved=1` parameter is not applied by the properties endpoint. Availability indicators in admin are read-only; there is no manual availability editor yet. The schema supports more workflows than the UI implements.

## Packages and marketplace operations

A package is a separate record with a name, included experiences, number of nights, price, and optional guest/trip limits. Examples include a romantic weekend with a hot tub, a family trip with breakfast, or a dog-friendly cabin stay. Package length and capacity still need checkout enforcement.

Partners have CRM statuses, contracts, account managers, notes, tasks, and commission settings. Bookings store customer price, partner proceeds, commission, fees, refunds, and payment states. These are demonstration operations; there is no real settlement or accounting integration.

## MVP boundaries

Keep the application as one maintainable service. Prioritize finding an appropriate stay on the map, understanding the surrounding area, and completing a trustworthy booking before expanding inventory or adding enterprise features.

Mock checkout, seeded prices, estimated tax/fees, sample ratings, and random availability are demonstrations. Real payments, supplier inventory sync, transactional emails, and verified route times are not connected. See the [roadmap](ROADMAP.md) for the path to a pilot.
