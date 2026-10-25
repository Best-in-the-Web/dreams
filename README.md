# EscapeMap

EscapeMap (repository name: `dreams`) is a **map-first travel discovery and booking prototype** for short trips to cabins, tiny houses, glamping sites, cottages, and other unusual stays in Central Europe.

Start with the weekend you want: choose “For two”, “With children”, “With a dog”, or “Nature”; set your origin, dates, guests, and radius; then explore stays and nearby activities on a map. The map is the main search experience, rather than a hotel feed.

**Status:** local MVP with fictional inventory and mock payments. It is not ready to accept real bookings or customer data. Date availability is stored but not enforced in search or checkout. See [current capabilities and gaps](docs/PRODUCT.md#current-capabilities).

## Start locally

Use Node.js 22 (matching the Dockerfile) and npm. No external database, map API key, payment account, or AI account is needed for the local demo. Internet access is needed to install dependencies and load map tiles, photos, and Google fonts.

```bash
git clone https://github.com/Best-in-the-Web/dreams.git
cd dreams
cp .env.example .env
npm ci
npm run db:setup
npm run dev
```

Open [localhost:3000](http://localhost:3000). `db:setup` creates the SQLite schema and **deletes/replaces all demo database records** through the seed script. Use it only against a disposable local database. Full setup, environment variables, troubleshooting, and deployment limits: [Setup guide](docs/SETUP.md).

| Role | Email | Password |
| --- | --- | --- |
| Customer | demo@escapemap.local | demo1234 |
| Admin | admin@escapemap.local | demo1234 |

Use these accounts only in local demos. Visit `/admin` after signing in as the admin.

## Explore the demo

1. Select trip categories, Brno, 200 km, dates, and guests on the homepage.
2. Open the map and select a price marker to preview a stay without leaving the map.
3. Enable nearby layers to see seeded attractions, nature, and restaurants.
4. Open a stay, select a package, and complete the clearly labelled mock checkout.
5. Sign in to save places and view trips. Use the admin area for partner notes/tasks, publishing controls, and booking economics.

The seed creates 21 fictional stays across CZ/SK/AT/PL, one unit per stay, packages, nearby points, and 90 days of sample availability/prices. Availability blocks and displayed review counts are randomized. Photos and real geographic names are illustrative; these are not verified bookable offers.

## Contributor documentation

| Read | Purpose |
| --- | --- |
| [Documentation index](docs/README.md) | Suggested reading order |
| [Product and current scope](docs/PRODUCT.md) | Map-first concept, user journeys, implemented features and gaps |
| [Architecture](docs/ARCHITECTURE.md) | Stack, request flow, routes, integrations, and constraints |
| [Setup](docs/SETUP.md) | Local environment, database, build, Docker and hosting |
| [Data model](docs/DATA_MODEL.md) | Entities, relationships, money, statuses, and inventory |
| [Contributing](CONTRIBUTING.md) | Branches, checks, manual verification, and PR expectations |
| [MVP roadmap](docs/ROADMAP.md) | Ordered milestones and acceptance criteria |
| [Original product specification](docs/PRODUCT_SPEC.md) | English design brief and AI rebuild prompt; includes planned behavior |

## Everyday commands

```bash
npm test          # Unit tests
npm run lint     # ESLint
npx tsc --noEmit  # Type checking (run build first for generated Next.js route types)
npm run build    # Generate Prisma client and build Next.js
npm start        # Serve the production build
```

`npm run test:watch` runs tests interactively. `npm run db:studio` opens the local database editor. See [Contributing](CONTRIBUTING.md) before modifying data or schema.

## Branding and language

The interface and documentation use English. Keep local geographic/business names, Czech source links, and CZK amounts where useful. Map tile labels come from the map provider and can be in the local language.

Edit `src/lib/brand.ts` for the display name, copy, colours, English formatting locale, default origin, and trip categories. `NEXT_PUBLIC_BRAND_NAME` exists in the example environment but is currently unused; changing it alone does not rebrand the app. Cookie/storage names, seeded emails, booking prefixes, and some hard-coded defaults require separate edits for a full rename.
