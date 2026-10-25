# Data model

The authoritative schema is [`prisma/schema.prisma`](../prisma/schema.prisma). The local provider is SQLite through Prisma. There are 15 models; several support planned workflows that are not yet available in the UI.

## Entities and relationships

| Model | Purpose and relationships |
| --- | --- |
| `User` | Unique email, password hash, name, optional phone, CUSTOMER/ADMIN/PARTNER role; owns bookings, favourites and reviews; can manage partners, author notes, and receive tasks |
| `Partner` | Supplier business/contact details, optional coordinates, CRM/contract/commission states, payout text and account manager; has properties, notes and tasks |
| `Property` | Unique slug, partner, location, type, descriptions/policies, capacity, base/weekend prices, published flag, sample rating and JSON text fields; parent of units, packages and nearby points |
| `Unit` | Bookable room/entire place under a property; capacity, beds, base price and minimum stay; has daily availability/prices and bookings |
| `Package` | Experience offer under a property; name/slug, nights, price, included items, optional max guests/trip type and active flag; linked by bookings |
| `Availability` | Unit/date availability and blocked flags; unique `(unitId, date)` with a date index |
| `Price` | Unit/date amount; unique `(unitId, date)` |
| `NearbyPlace` | Property-linked point of interest with category, name, optional description/distance and coordinates |
| `Booking` | Unique booking number, property, optional user/unit/package, dates, guest details/counts, economics and lifecycle states |
| `Payment` | At most one per booking via unique `bookingId`; provider/ref, amount, status and paid timestamp |
| `Review` | At most one per booking via unique `bookingId`; user/property, category ratings, optional trip scores and review text |
| `Favourite` | Saved property; unique `(userId, propertyId)` prevents duplicates |
| `InternalNote` | Author and body with optional partner/property links |
| `Task` | Optional partner/assignee, title, description, due date and OPEN/DONE/CANCELLED status |

Core relationships: `Partner → Property → Unit → Availability/Price`; `Property → Package/NearbyPlace`; `User → Booking → Payment/Review`; `User ↔ Property` through `Favourite`.

Optional note/task relationships are not constrained to exactly one target. A PARTNER user role exists, but no partner self-service portal or direct partner-login mapping is implemented. The schema has no separate `Amenity` model: amenities are string keys in property JSON text.

## JSON text and identifiers

SQLite-compatible string fields store JSON arrays: property `images`, `amenities`, `tripTypes`, `environments`, `tags`; package `includes`; partner `internalTags`; booking `childrenAges`. Use `parseJsonArray` / `toJson` in `utils.ts` or explicit JSON serialization at boundaries.

Amenity strings such as `Dogs allowed` and `Private hot tub` are also filter keys. Keep stored keys aligned with `brand.ts`, the discovery store, parser and seed. Translate display labels separately if localization is added. Preserve slugs, enum values and external IDs when translating visible text.

Coordinates use floating-point latitude/longitude. Dates are Prisma `DateTime` values; UI input uses `YYYY-MM-DD`. Establish a consistent accommodation-local date/timezone convention before inventory enforcement, especially across DST boundaries.

## Money and pricing

All `*Czk` integer fields store whole Czech koruna, not minor units. Display uses English number formatting and the `Kč` currency symbol. There is no exchange-rate or multi-currency system.

Current checkout uses a package's flat price, or the property's weekend-price fallback multiplied by nights. Daily `Price` rows, unit-specific rates and `minStay` are not used. The server selects the first unit. Package night count and guest limits are not enforced.

`calculateBookingEconomics` currently calculates:

```text
subtotal = rounded accommodation + extras
taxes = round(subtotal × 10%)
customer price = subtotal + taxes
commission = round(customer price × partner commission percentage)
payment fee = round(customer price × 1.5%)
partner net / amount owed = customer price − commission
platform revenue / gross margin = commission − payment fee
```

These are demo assumptions, not verified tax rates or processor charges. For accommodation of 6,000 CZK, no extras and 15% commission: taxes are 600, customer price 6,600, commission 990, payment fee 99, partner owed 5,610, and platform revenue 891 CZK. `platformGrossMarginCzk` is returned by the helper but is not a separate database column.

The schema permits `PERCENTAGE` and `NET_PRICE`, but checkout uses the percentage path only. Refund fields exist without an implemented refund workflow. Moving to minor units or additional currencies needs a deliberate migration and rounding policy.

## States: schema versus implemented transitions

| Domain | Allowed enum values |
| --- | --- |
| Partner | LEAD, CONTACTED, NEGOTIATING, ONBOARDING, ACTIVE, PAUSED, CLOSED |
| Contract | NONE, DRAFT, SENT, SIGNED, EXPIRED |
| Booking | PENDING, PAID, CONFIRMED, COMPLETED, CANCELLED, REFUNDED |
| Payment | PENDING, PAID, FAILED, REFUNDED |
| Partner payment | NOT_DUE, PENDING, PAID |

Creating a booking currently creates pending booking/payment records. Mock confirmation marks the booking CONFIRMED, payment PAID, and partner payment PENDING. Posting a review marks a booking COMPLETED. Other statuses are schema vocabulary, not a complete transition engine. Define authorized transitions and transactional updates before real checkout.

## Inventory and integrity gaps

Availability rows and prices are demo data. Search does not exclude blocked/sold-out nights; booking does not reserve inventory or prevent overlapping stays. Enforce unit capacity, date order, minimum stays, package limits, and availability on the server within a concurrency-safe reservation flow.

Several child relations use cascading deletes; bookings refer to historical property/unit/package records without a complete immutable offer snapshot. Use reviewed data-retention and deletion rules before storing real transactions. The seed explicitly deletes application records in dependency order and must never run on a live database.
