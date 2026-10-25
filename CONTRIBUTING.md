# Contributing

## First contribution

Read the [product overview](docs/PRODUCT.md), [setup guide](docs/SETUP.md), and [architecture](docs/ARCHITECTURE.md). The full product prompt describes a target; the overview lists what is actually implemented. Choose a scoped item from the [roadmap](docs/ROADMAP.md).

Use a separate branch for every change:

```bash
git switch main
git pull --ff-only
git switch -c your-change-name
```

If you have existing local edits, preserve them before switching branches. Submit a pull request targeting `main`; do not push feature work directly to `main`.

## Development loop

1. Install with `npm ci`, copy `.env.example` to `.env`, and initialize a disposable demo DB using `npm run db:setup`.
2. Run `npm run dev` and keep the map-first discovery flow usable on desktop and mobile.
3. Make the smallest complete change. Keep shared product configuration in `src/lib/brand.ts` and business logic in `src/lib` where practical.
4. For schema edits, regenerate Prisma and synchronize only your local database. Explain migration/data implications in the PR. Seed commands replace all application data.
5. Run the checks below and exercise affected user journeys. Report failures and limitations accurately.

The repository's [AGENTS.md](AGENTS.md) requires coding agents to read the relevant bundled Next.js guides under `node_modules/next/dist/docs/` before writing framework code. Install dependencies first; use the docs shipped with this version.

## Language and content

Write interface copy, comments, maintained documentation, and contributor-facing instructions in English. Local place/business/person names, currency symbols, and useful Czech-language external sources can stay in their original form; explain linked references in English. Preserve URLs, slugs, enum values, amenity keys and supported search aliases when changing display copy.

Use `brand.locale` for shared number formatting and retain CZK as the demo currency. Do not invent supplier availability, reviews, travel times or verified offers. Demo inventory must remain clearly identifiable as fictional.

## Checks

```bash
npm test
npm run lint
npm run build
npx tsc --noEmit
```

Build before the standalone type check on a fresh checkout so Next.js route types exist. A build downloads Google fonts and requires network access. Unit tests currently cover geographic/date/price helpers, keyword parsing, booking economics and adapter/config contracts. They do not prove end-to-end booking correctness or deployment readiness.

Add meaningful coverage when changing behavior, particularly search, pricing, inventory or authorization. Documentation-only edits need checked links, correct commands and claims verified against source. Inspect the final diff for accidental lockfile, generated-file, `.env`, database or unrelated changes.

## Manual smoke checklist

Use disposable local data and mock checkout only.

- [ ] Homepage: select categories, origin, radius, dates and guest counts; open map.
- [ ] Map: pan/zoom, inspect markers and radius, open a preview without leaving the map.
- [ ] Nearby: select a stay, toggle layers and inspect points.
- [ ] Detail: verify policies, package contents, prices, photos and directions.
- [ ] Booking: select dates/package, enter demo contact details, complete mock checkout and inspect confirmation.
- [ ] Account: sign in, save/unsave a place and check trips/saved cards.
- [ ] Admin: view partners/properties/bookings; add a demo note/task; change partner status or publishing if affected.
- [ ] Mobile: check narrow-screen filters, marker cards, form controls and scrolling.
- [ ] Copy: check English labels/formatting and preserve correct local names.

Check known limitations in [Product](docs/PRODUCT.md) when interpreting results; a completed mock checkout does not verify inventory locking or real payment processing.

## Pull requests

Explain the problem, changed behavior, and validation performed. Link the relevant roadmap item/issue if one exists. Include screenshots for visible UI changes and call out new environment variables, schema changes, data resets or deployment steps. Distinguish completed checks from blocked or unrun checks. Never include credentials, private customer data or generated database files.
