# Setup and operations

## Prerequisites

Use Node.js 22 and npm, matching the repository's Docker runtime. The local database is SQLite; no PostgreSQL server or external credentials are required. Install dependencies from `package-lock.json` with `npm ci`.

```bash
cp .env.example .env
npm ci
npm run db:setup
npm run dev
```

Open [localhost:3000](http://localhost:3000). Use the demo accounts in the [README](../README.md). Keep `.env` and local database files out of Git.

## Environment variables

| Variable | Example | Current behavior |
| --- | --- | --- |
| `DATABASE_URL` | `file:./dev.db` | Required by Prisma; file paths are relative to `prisma/schema.prisma`, so this creates `prisma/dev.db` |
| `NEXT_PUBLIC_BRAND_NAME` | `EscapeMap` | Present for future configuration but unused; edit `src/lib/brand.ts` today |
| `SESSION_SECRET` | Development placeholder | Present but unused by current demo auth; setting a strong value does not secure the unsigned user-ID session |

There is no required map token, payment key, email key, or LLM key. Do not put private credentials in `NEXT_PUBLIC_*` variables, which are intended for browser-visible values.

## Database lifecycle

| Command | Effect |
| --- | --- |
| `npm run db:push` | Synchronize the current schema with the configured database; no migration history is created |
| `npm run db:seed` | Delete existing application records and recreate all demo data |
| `npm run db:setup` | Run schema push, then the destructive demo seed |
| `npm run db:studio` | Open Prisma Studio to inspect/edit the local database |
| `npx prisma generate` | Regenerate the TypeScript client after schema changes |

Seed/setup are for disposable local databases only. Back up any data you need before resetting. The seed creates 21 fictional properties, partners, packages, nearby points, 90 days of availability/prices, customer/admin users, CRM notes/tasks, and a sample favourite. It creates no bookings or reviews. Random blocks and review counts vary between runs. Changes to seeded display text appear after a deliberate demo reseed; they do not update an existing database automatically.

After editing the schema locally, run `npm run db:push`, `npx prisma generate`, and the relevant checks. Use `db:seed` only when you deliberately want to replace the data. Introduce reviewed migrations before maintaining a shared persistent database.

## Checks and production-mode preview

```bash
npm test
npm run lint
npm run build
npx tsc --noEmit
npm start
```

Run the build before the standalone type check on a fresh checkout because Next.js generates route types used by `LayoutProps`. The build also regenerates Prisma. `npm start` serves the result on port 3000. This is a local production-mode preview, not approval for live bookings.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Missing Prisma client | Run `npx prisma generate`; confirm dependency installation completed |
| Prisma reports an empty “Schema engine error” on first setup | With the default local SQLite URL, check whether `prisma/dev.db` exists; creating an empty file with `touch prisma/dev.db` (macOS/Linux) allowed initialization in this review. Then rerun `db:setup` only on disposable data |
| Missing tables / empty map | Check `.env` and run `db:setup` only if this is a disposable demo DB; broaden radius/categories if filters exclude everything |
| Missing `LayoutProps` or generated route types | Run `npm run build` to generate Next.js types |
| Missing fonts during build | `next/font/google` downloads Fraunces and Source Sans 3; allow network access or implement locally hosted fonts separately |
| Blank tiles/photos | Check browser network access to OpenStreetMap and Unsplash; these assets are not bundled offline |
| Unexpected remembered filters | Reset discovery preferences or clear the `escapemap-discovery` local-storage entry |
| Port 3000 in use | Stop the other process or use `npm run dev -- --port 3001` |

## Docker: existing scaffold and limitations

The Dockerfile builds Next.js standalone output and Compose declares a persistent app volume plus an optional PostgreSQL profile. It is a deployment scaffold, not a complete working database/bootstrap workflow.

Known issues to address before relying on `docker compose up --build`:

- The dependencies stage runs `npm ci` (including the Prisma `postinstall`) before copying `prisma/schema.prisma`.
- The runner never applies the schema or seeds/initializes a database.
- The default SQLite URL `file:./data/prod.db` resolves under `prisma/`, while the volume is mounted at `/app/data`. Align it with an absolute URL such as `file:/app/data/prod.db` in a follow-up change.
- Review build context exclusions and runtime permissions before packaging local files.

`docker compose --profile postgres up postgres` starts the optional database container only. It does not connect the app to PostgreSQL. The schema still declares `provider = "sqlite"`; changing `DATABASE_URL` alone is insufficient. A PostgreSQL move requires changing the provider, generating the client, introducing a matching migration history, transferring any required data, and testing search/booking behavior.

## Hosting sequence for a future pilot

1. Make local setup and checks reproducible; fix the container/bootstrap issues if using Docker.
2. Complete the booking/auth/data-protection prerequisites in the [roadmap](ROADMAP.md).
3. Provision a persistent database, backup/restore process, and reviewed migrations. Use a single persistent host for SQLite or migrate to PostgreSQL for a multi-instance/serverless app.
4. Choose a Node-capable host, configure server-side environment variables, deploy the app, and run migrations through a controlled release step. Never run the demo seed against live data.
5. Add a domain, DNS, HTTPS, and secure session settings; verify public URLs and the map/photo dependencies.
6. Configure a map provider suitable for the expected traffic, monitoring, logs, backups, and real transactional integrations only when those features are ready.
7. Run the smoke checklist against an isolated staging environment before inviting pilot users.

A domain can be reserved earlier once a name is chosen; it is not needed for development. Hosting provider choice, pricing, map service quotas, and legal/payment requirements must be checked when a deployment is planned. This repository does not provision any hosted infrastructure.
