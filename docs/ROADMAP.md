# MVP roadmap

The repository already demonstrates discovery, maps, packages, customer accounts and admin views. The next goal is a small trustworthy pilot, followed by real marketplace operations. Milestones below are proposed work, not completion claims or dated commitments.

## 1. Reproducible development baseline

- Keep English onboarding, architecture and data-model docs aligned with source.
- Add CI for unit tests, lint, type checks and builds; resolve existing failures and review dependency audit findings.
- Repair container dependency/schema ordering, SQLite volume paths and database initialization. Add migrations and a restore procedure for persistent deployments.

Acceptance: a contributor can start from a clean checkout using the documented commands; automated checks pass; a container restart retains data without reseeding it.

## 2. Trustworthy map discovery

- Preserve map-first search and marker previews on desktop/mobile.
- Carry date/guest/category choices consistently across homepage, natural-language input, map and checkout.
- Implement date-aware inventory results, saved-only filtering, consistent total/night price filters and clear empty/error states.
- Label approximate travel times; decide whether route-based travel limits are necessary for the pilot.

Acceptance: the Brno/200 km/family/dog scenario returns only stays matching the selected constraints; unavailable nights are excluded; saved-map results contain only the signed-in user's favourites; displayed price units are unambiguous.

## 3. Safe pilot booking and accounts

- Replace unsigned user-ID cookies with secure server-validated sessions; enforce authorization and public-response field allowlists.
- Validate dates, guest counts, package duration, minimum stay, pricing inputs and unit ownership on the server.
- Reserve inventory atomically, prevent concurrent double bookings, and make booking/payment creation idempotent.
- Restrict confirmation/contact information to authorized viewers; remove state changes from page reads.
- Limit reviews to completed stays, validate ratings and maintain aggregates.

Acceptance: tampered cookies/requests cannot impersonate users or change another user's booking; concurrent attempts cannot sell the same unit/night twice; direct confirmation URL visits cannot mark payments paid; invalid reviews are rejected.

## 4. Partner-operated inventory

- Add admin editors for properties, units, packages, daily prices, blocked dates and policies.
- Complete task/status workflows and booking lifecycle actions with an audit trail.
- Separate draft/unpublished inventory from publicly visible offers and protect internal partner data.

Acceptance: an admin can onboard a partner, prepare an offer and availability, publish it, then block dates and see that change reflected in discovery/checkout without editing the database directly.

## 5. Staging and real transactions

- Choose persistent hosting/database, domain/DNS/HTTPS, backups, logs, monitoring and a suitable map tile service.
- Implement a real payment adapter in test mode first, signed webhooks, failure/retry/refund handling and reconciliation.
- Add booking/customer/partner notifications and consent/retention policies appropriate to the operating model.
- Verify tax/fee and partner-settlement rules before replacing demo economics. Review public launch readiness using staging data.

Acceptance: sandbox success/failure/refund events update authorized records exactly once; inventory is released correctly on expiry/cancellation; restore and release smoke checks pass; pilot offers are partner-verified.

## Later, after the pilot

Add PostgreSQL/geographic indexing when inventory/hosting requires it; integrate PMS/channel managers or iCal through adapters; improve route-based discovery; introduce optional structured LLM search, recommendations and additional countries/currencies. Keep these separate from proving the core discovery-to-booking journey.

