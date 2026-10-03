# EscapeMap

Map-first travel discovery & booking marketplace MVP.

Helps people answer: *“Where can I go for a great short trip based on what I want to do, who I travel with, and how far I’m willing to drive?”*

## Quick start

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo accounts

| Role     | Email                   | Password  |
|----------|-------------------------|-----------|
| Customer | demo@escapemap.local    | demo1234  |
| Admin    | admin@escapemap.local   | demo1234  |

## What works

1. Homepage vibe selection (categories, origin, radius, dates, guests)
2. Natural-language search box (keyword → filters; LLM-ready)
3. Full-screen interactive map (Leaflet + OpenStreetMap)
4. Price markers, radius circle, simple clustering when zoomed out
5. Marker preview cards with save / directions / view stay
6. Nearby layers (hiking, food, attractions, …) around a selected stay
7. Property detail with packages, amenities, map, nearby POIs
8. Booking flow with mock sandbox payment
9. Customer account: trips + saved places
10. Admin: partners CRM notes/tasks, properties, bookings & economics

## Brand

Temporary name **EscapeMap** — change `src/lib/brand.ts` (and `NEXT_PUBLIC_BRAND_NAME`) to rebrand.

## Rebuild with another AI

The full product prompt used to create this MVP lives in:

**[docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)**

Paste that file into another model/agent (on an empty or new repo) to regenerate a site with the same map-first concept, UX, data model, and deliverables.

## Tests

```bash
npm test
```

Coverage focuses on the core product logic:

- Geo / pricing / date helpers (`src/lib/utils.test.ts`)
- Natural-language → filters (`src/lib/smart-search.test.ts`)
- Booking economics (`src/lib/booking-economics.test.ts`)
- Brand, map provider, payment/channel mocks (`src/lib/integrations.test.ts`)

Watch mode: `npm run test:watch`

## Scripts

| Command           | Description                |
|-------------------|----------------------------|
| `npm run dev`     | Dev server                 |
| `npm test`        | Run unit tests             |
| `npm run db:setup`| Push schema + seed demo    |
| `npm run db:seed` | Re-seed demo data          |
| `npm run db:studio` | Prisma Studio            |
| `npm run build`   | Production build           |

## Docker

```bash
docker compose up --build
```

PostgreSQL profile (optional): `docker compose --profile postgres up`

## Project layout

```
docs/              # Product spec (AI rebuild prompt)
src/app/           # Customer + admin routes, API
src/components/    # UI including EscapeMap
src/lib/           # brand, search, auth, integrations (+ *.test.ts)
prisma/            # schema + seed (20+ stays around Brno region)
```
