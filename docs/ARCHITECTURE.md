# Architecture

## Current stack

| Component | Implementation |
| --- | --- |
| Web application | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4, shared brand config, Lucide icons |
| Server | Next.js server components and route handlers in `src/app/api` |
| Database | SQLite through Prisma 6; `prisma/schema.prisma` is the schema authority |
| Browser state | Zustand discovery store persisted as `escapemap-discovery` in local storage |
| Map | Leaflet 1.9 / React Leaflet 5, OpenStreetMap raster tiles |
| Authentication | bcrypt password hashing and a demo cookie containing the user ID |
| Tests | Vitest unit tests in `src/lib/*.test.ts` |
| Packaging | Next.js standalone output and an existing Dockerfile/Compose draft |

There are no separate microservices, Supabase integration, PostGIS queries, hosted auth, or real LLM/payment services in this implementation. PostgreSQL is a future deployment option, not the current database.

## Source layout

```text
src/app/              Pages, server components, route handlers
src/components/       Discovery, map, booking, shared header, admin UI
src/lib/              Database client, auth, search, state, brand, helpers, adapters
prisma/schema.prisma  Models, enums, constraints
prisma/seed.ts        Fictional inventory and demo accounts
public/               Static assets
docs/                 Product, engineering guides and roadmap
```

## Discovery request flow

1. `HomeDiscovery.tsx` collects preferences in `store.ts` and opens `/explore` with query parameters. Natural-language input goes through `POST /api/smart-search` and the keyword parser in `smart-search.ts`.
2. `ExploreClient.tsx` reads URL parameters and requests `GET /api/properties`.
3. `search.ts` loads published properties and active packages through Prisma, calculates Haversine distance, filters in memory, and sorts by distance. Amenities use an all-match rule; types, environments, and trip types allow alternatives within each facet.
4. The client dynamically loads `EscapeMap.tsx` with server rendering disabled because Leaflet requires browser APIs. The map renders markers, a radius circle, previews, and simple zoom-dependent grouping.
5. Selecting a stay loads `/api/properties/[slug]/nearby`. These are property-linked seeded points, not live results from a places service.
6. `/stays/[slug]` loads the detailed database record on the server and renders the booking widget.

Distance is straight-line kilometres. Estimated drive time is `distance / 70 km/h`, without roads or traffic. Directions open an external OpenStreetMap page. Search loads all published stays, so it is suitable only for small demo inventories.

`SearchFilters` contains fields that are not fully wired through the URL/API/UI. In particular, dates do not filter inventory; `maxDriveMinutes`, `maxPricePerNightCzk`, and saved-only selection are not parsed by the properties endpoint. The weekend budget compares a two-night estimate or a package minimum, before checkout tax, rather than an authoritative selected-date total.

## Route map

| Route | Purpose |
| --- | --- |
| `/`, `/explore` | Discovery and map results |
| `/stays/[slug]`, `/stays/[slug]/review` | Stay details and review form |
| `/login`, `/account`, `/account/saved` | Customer session, trips and saved-place cards |
| `/booking/[number]/confirm` | Demo booking/payment confirmation |
| `/admin` | Internal dashboard |
| `/admin/partners`, `/admin/partners/new`, `/admin/partners/[id]` | Partner CRM |
| `/admin/properties`, `/admin/properties/[id]` | Property inspection and publishing |
| `/admin/bookings`, `/admin/bookings/[id]` | Booking inspection and financial breakdown |

| API | Methods / responsibility |
| --- | --- |
| `/api/auth` | GET current user; POST login/register/logout |
| `/api/properties` | GET filtered published properties |
| `/api/properties/[slug]/nearby` | GET nearby points |
| `/api/smart-search` | POST query → filters |
| `/api/favourites` | GET saved IDs; POST toggle |
| `/api/bookings` | POST demo booking and mock payment |
| `/api/reviews` | POST review for own booking |
| `/api/admin/partners` | POST partner |
| `/api/admin/partners/[id]` | PATCH metadata |
| `/api/admin/partners/[id]/notes` | POST note |
| `/api/admin/partners/[id]/tasks` | POST task |
| `/api/admin/properties/[id]` | PATCH property fields |

## Booking and integration boundaries

`BookingWidget.tsx` calculates a display estimate and posts to `/api/bookings`. The server chooses the property's first unit, calculates economics, creates a booking and payment, and returns a mock checkout URL. Visiting the confirmation route with `mock_pay=1` marks pending records paid/confirmed. No payment processor is contacted and no inventory is reserved.

`integrations.ts` defines `PaymentProvider` and `ChannelManagerAdapter` contracts. The mock payment always verifies successfully; the mock channel manager returns empty availability and accepts pushes. The booking route directly imports the mock payment implementation. Real adapters require selection/configuration, server-verified webhooks, retry/idempotency handling, and integration tests. The channel adapter is not wired into booking/search.

`map-provider.ts` supplies tile URL, attribution, and zoom. Switching raster tile providers is a config change; switching to a different map SDK requires component work. Branding lives in `brand.ts`; the example brand environment variable is not read by the code.

## Prototype limitations relevant to contributors

The session cookie stores an unsigned user ID and has no `secure` flag; `SESSION_SECRET` is unused. Admin checks rely on that session. Booking confirmation exposes contact details by booking number and performs a mock state change during a page request. Public property queries also return database records without a dedicated public-field allowlist. These boundaries need hardening before a public pilot.

Booking validation, availability/capacity enforcement, concurrent reservations, and atomic booking/payment updates are incomplete. Review creation checks ownership/uniqueness but does not require a completed stay. The current review endpoint itself sets the booking to completed. Treat these as roadmap work, not production guarantees.
