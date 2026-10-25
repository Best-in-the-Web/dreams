# EscapeMap — Product specification (AI rebuild prompt)

Use this document as a **standalone design and build prompt** with another AI coding model. It captures the intended EscapeMap experience, including features that are not implemented yet.

For the current repository, read [Product and MVP scope](PRODUCT.md), [Architecture](ARCHITECTURE.md), and the [MVP roadmap](ROADMAP.md). The checked-in app uses SQLite locally, approximate travel times, and mock payments. It does not yet enforce date availability, provide full inventory editors, or filter the map to saved places.

Copy everything below the line into a new chat / agent session (optionally attach or open an empty repo first).

---

Build a functional MVP of a modern travel discovery and booking marketplace inspired by the best ideas from TravelKing, Booking.com, Airbnb and niche glamping/cabin platforms.

The product should NOT look like a traditional hotel search website with a long vertical feed of hotels.

The main experience should be MAP-FIRST.

## Product concept

The service helps people answer a simple question:

“Where can I go for a great short trip based on what I want to do, who I travel with, and how far I am willing to drive?”

The initial focus is on interesting and unusual places to stay:

- cabins
- tiny houses
- glamping
- cottages
- tree houses
- romantic hideaways
- wellness stays
- farm stays
- houses in nature
- unusual boutique hotels
- castles or historical stays
- family-friendly stays
- pet-friendly stays

The product should feel more like discovering an experience than searching for a hotel room.

Use a temporary project name such as "EscapeMap". Make branding easy to change later.

## Main UX principle

Do NOT make a Booking.com-style hotel list the primary interface.

The primary interface should be:

SEARCH / FILTERS
↓
INTERACTIVE MAP
↓
PLACES APPEAR ON THE MAP
↓
USER EXPLORES THE AREA

The map is the main product.

For example:

User enters:

Location: Brno

Travel radius:
200 km

Dates:
This weekend

Travelling:
2 adults
2 children
1 dog

Interests:
Nature
Private hot tub
Family friendly

The map should then show suitable places within approximately 200 km of Brno.

Markers should display a small price or visual category.

Clicking a marker should open a compact place card without leaving the map.

## Homepage

Make the homepage visually beautiful, simple and emotional.

Large headline such as:

“Where do you want to escape this weekend?”

Under it, provide large visual selectable chips/cards.

Examples:

❤️ For two

👨‍👩‍👧 With children

🐕 With a dog

🌲 Nature

🔥 Cabins & tiny houses

✨ Something unusual

💆 Wellness

🍷 Food & wine

🚲 Active weekend

🏔 Mountains

🌊 Water

⭐ Under the stars

Allow users to select multiple categories.

For example:

“With children” + “With a dog” + “Nature”.

Then ask:

Where are you starting from?

Example:
Brno

Then:

How far are you willing to travel?

50 km
100 km
150 km
200 km
300 km
Any distance

Also allow a custom radius.

Then:

When?

This weekend
Next weekend
Choose dates
Flexible

Then show the map.

## Map experience

The map should occupy most of the screen.

Show the starting city and travel radius visually on the map.

For example:

Brno
200 km radius

Show all matching stays as map markers.

Each marker may show:

4 990 Kč
6 500 Kč
etc.

Marker clustering should be supported when there are many places.

Clicking a marker opens a small preview card containing:

- image
- place name
- location
- distance from starting point
- approximate driving time
- price
- rating
- tags
- available dates
- quick summary

Example:

Forest Cube Beskydy

🌲 Tiny house
🐕 Dogs welcome
🔥 Private hot tub
⭐ 4.9

182 km from Brno
2h 12 min by car

From 5 490 Kč / weekend

Buttons:

View stay
Directions
Save

Do not force the user to leave the map just to compare places.

## Explore the destination

One important differentiator:

When a user selects a place, also show what is around it.

Add optional map layers or nearby categories:

🌲 Nature
🥾 Hiking
🍴 Restaurants
☕ Cafés
🏰 Attractions
🏊 Swimming
🚲 Cycling
👨‍👩‍👧 Activities for children
🐕 Dog-friendly places
🛒 Shops

For example, around a cabin show:

- hiking trails
- viewpoints
- castles
- lakes
- restaurants
- cafés
- children's attractions

The goal is to let the customer understand:

“What would our weekend there actually look like?”

## Stay detail page

Each place should have a clean detail page.

Include:

Photo gallery

Name

Location

Map

Description

Why this place is special

Tags

Examples:

Private hot tub
Forest
Dogs allowed
Children welcome
Fireplace
Sauna
Breakfast
EV charging
Wi-Fi
No neighbours nearby

Show:

Distance from user's starting location

Approximate driving time

Check-in/check-out

Guest capacity

Number of beds

Children policy

Pet policy

Parking

Food options

Cancellation conditions

Availability calendar

Pricing

Reviews

Nearby attractions

Nearby restaurants

Suggested activities

Directions

## Experience packages

Borrow an important concept from TravelKing.

Do not only sell accommodation.

Allow places to create packages.

Example:

ROMANTIC WEEKEND

2 nights
private hot tub
breakfast basket
bottle of prosecco
late checkout

6 990 Kč / couple

Another:

FAMILY WEEKEND

2 nights
breakfast
family entrance to nearby zoo
children under 6 free
late checkout

7 490 Kč

Another:

DOG WEEKEND

2 nights
dog included
fenced garden
welcome dog package
nearby forest trails

5 990 Kč

Packages should be first-class objects in the data model, not just text descriptions.

## Search filters

Provide useful travel filters, but keep them simple.

Guests:
Adults
Children
Children ages
Pets

Accommodation:
Cabin
Tiny house
Glamping
Cottage
Hotel
Apartment
Farm stay
Castle
Other unusual stay

Features:
Private hot tub
Sauna
Pool
Fireplace
Breakfast
Restaurant
Kitchen
Fenced garden
EV charging
Wi-Fi
Air conditioning

Environment:
Forest
Mountains
Lake
River
Wine region
Countryside
City

Trip type:
Romantic
Family
Dog friendly
Wellness
Adventure
Food & wine
Relax
Work retreat

Price:
Maximum total price
Maximum price per night

Travel:
Maximum driving distance
Maximum driving time

Dates:
Exact dates
This weekend
Next weekend
Flexible

## Smart discovery

Also create a natural-language search box.

Example:

“Find me a cabin for two people with a private hot tub, maximum 2 hours from Brno, available next weekend and under 7,000 Kč.”

The MVP does not need a real LLM integration if that makes development complicated.

It can initially translate predefined keywords into filters.

But structure the code so an AI search layer can easily be added later.

## Booking flow

Create a simple booking flow.

User selects:

Place
Package or room
Dates
Number of guests
Children
Pets

Show:

Accommodation
Extras
Taxes
Total price
Cancellation conditions

Then:

Contact details
Payment

For the MVP:

Use test/sandbox payment if available.

If no payment provider credentials are available, implement a realistic mock checkout.

The architecture should allow a future connection to Stripe, Comgate or another European payment provider.

After booking show:

Booking number

Place

Dates

Total price

Payment status

Contact information

Directions

## Availability

Design the data model properly from the beginning.

Each accommodation should support:

units / rooms
availability
minimum stay
blocked dates
different prices by date
packages
capacity
pet rules
child rules

For the MVP, availability can be managed manually from the admin interface.

Later it must be possible to connect channel managers, PMS systems or APIs.

Do NOT build those integrations now.

Just prepare clean API interfaces for them.

## Customer account

Create a simple account area.

Sections:

My trips
Saved places
Previous trips
Profile

Allow users to ❤️ save places.

Saved places should also be visible together on the map.

## Admin / partner system

Create a simple internal admin interface.

This is important.

An administrator should be able to create and manage accommodation partners.

Partner fields should include:

Business name

Property name

Contact person

Phone

Email

Address

GPS coordinates

Partner status

Assigned account manager

Internal notes

Commission model

Commission percentage

Net price model

Contract status

Payment details

Internal tags

Communication history

Tasks / follow-ups

Partner should have statuses such as:

Lead
Contacted
Negotiating
Onboarding
Active
Paused
Closed

## Accommodation management

Admin should be able to create/edit:

Accommodation

Rooms/units

Capacity

Photos

Amenities

Pet policy

Child policy

Check-in/out

Cancellation policy

Availability

Prices

Packages

Nearby attractions

Internal notes

Published/unpublished status

## Important: internal notes

Create a simple CRM-like partner history.

Example:

Hotel:
Forest Cube

Account manager:
Anna

Notes:

12 Sep
Owner interested in joining.

18 Sep
Agreed 15% commission.

21 Sep
Photos received.

23 Sep
Waiting for contract.

25 Sep
Property published.

Allow internal team members to add notes and tasks.

## Booking administration

Admin should be able to see:

Booking ID

Customer

Accommodation

Package

Dates

Guests

Price

Commission

Amount owed to partner

Payment status

Partner payment status

Booking status

Cancellation status

Internal notes

Booking statuses:

Pending
Paid
Confirmed
Completed
Cancelled
Refunded

## Basic financial model

Each booking should store:

Customer price

Partner net price

Commission

Payment processing fee

Refund amount

Amount owed to partner

Platform revenue

Example:

Customer pays:
6 000 Kč

Partner receives:
5 000 Kč

Platform revenue:
1 000 Kč

Payment fee:
100 Kč

Platform gross margin:
900 Kč

No real accounting integration is necessary for MVP.

## Reviews

After a completed stay, allow the customer to leave:

Overall rating

Cleanliness

Location

Value

Experience

Short text review

Optionally:

Romantic score
Family score
Dog-friendly score

This can later become very useful for recommendation algorithms.

## Design

The product should feel:

modern
warm
premium
adventurous
simple
European

Avoid a corporate Booking.com appearance.

Use large photography.

Use rounded cards.

Use clear typography.

Lots of whitespace.

The map should visually dominate search results.

Mobile UX is very important.

On mobile:

map full screen

filters accessible from bottom sheet

place card slides up after tapping a marker

## Demo data

Create realistic demo data for at least 20 stays around:

Czech Republic
Slovakia
Austria
Poland

Focus especially around Brno within approximately 300 km.

Include examples such as:

South Moravia wine cabin

Beskydy tiny house

Jeseníky mountain cottage

Slovak tree house

Austrian Alpine cabin

Polish glamping dome

Use fictional property names if necessary.

Each demo location needs:

coordinates
price
photos/placeholders
features
availability
description
package
nearby points of interest

## Map technology

Use an interactive map.

Prefer an implementation that works without expensive API requirements for the MVP.

For example:

OpenStreetMap + Leaflet

or another equivalent solution.

Keep the map provider abstracted so Mapbox or Google Maps could later replace it.

## Suggested MVP architecture

Prefer a simple modern architecture.

For example:

Frontend:
Next.js / React

Backend:
Next.js API or lightweight backend

Database:
PostgreSQL

ORM:
Prisma or equivalent

Authentication:
simple email login

Maps:
Leaflet + OpenStreetMap

Deployment:
Docker-ready

Do NOT use unnecessary microservices or Kubernetes.

Build this as a simple maintainable MVP.

## Data model

At minimum create entities for:

User
Partner
Property
Unit
Package
Availability
Price
Booking
Payment
Review
Amenity
NearbyPlace
Favourite
InternalNote
Task

Design relationships cleanly.

## Important MVP constraint

Do NOT spend time building enterprise functionality.

We are testing whether customers like:

1. selecting the type of trip
2. setting where they start
3. selecting a travel radius
4. seeing interesting stays on a map
5. exploring what is around them
6. selecting a stay
7. making a booking

These seven things must work really well.

Everything else is secondary.

## Most important differentiator

The website should NOT answer:

“Which hotel do you want?”

It should answer:

“What kind of weekend do you want?”

Then:

“Here are interesting places you can reach.”

The emotional discovery flow is more important than a huge inventory.

A customer should be able to say:

“We have two children and a dog. We live in Brno. We want to leave this Friday, drive no more than two hours, stay somewhere in nature and ideally have a hot tub.”

The product should immediately turn this request into a visual map of relevant places.

## Deliverable

Create a working responsive MVP.

Include:

customer homepage
search/filter flow
interactive map
map markers
property previews
property detail
nearby places
availability
booking flow
saved places
customer account
admin dashboard
partner management
property management
availability management
booking management
internal partner notes
basic booking economics
realistic demo data

Prioritize a polished working experience over feature count.

If some integrations require external credentials, mock them cleanly rather than blocking development.

Build the MVP so it can later evolve into a real multi-country travel marketplace.

## Implementation direction for the AI

When rebuilding, also include the following. These are design targets, not a claim that every item is complete in this repository:

1. **Central brand config** (e.g. `src/lib/brand.ts`) for the display name, copy, colours and origin; audit other identifiers for a full rename.
2. **Keyword NL search** structured so an LLM can replace the parser later (`parseNaturalQuery` / `smartSearch`).
3. **Mock payment + channel-manager interfaces** with a clear swap path to Stripe/Comgate/PMS.
4. **Map provider config** abstracted from Leaflet/OSM tiles.
5. **At least 20 seeded stays** within ~300 km of Brno across CZ/SK/AT/PL.
6. **Admin CRM notes/tasks** on partners and booking economics (commission, fees, partner owed, platform margin).
7. **Tests** for geo helpers, NL search parsing, booking economics, and integration mocks.
8. **Docker-ready** deploy story; SQLite is acceptable for local MVP if PostgreSQL is documented as the production target.
9. Visual direction: warm/premium European (forest + sand + clay), not purple SaaS / Booking.com corporate.

### Target acceptance smoke checklist

Use this checklist to assess a new implementation alongside the detailed gaps in [Product and MVP scope](PRODUCT.md).

- [ ] Homepage → select vibes → Brno → 200 km → This weekend → map
- [ ] Map shows price markers + radius; marker opens preview without leaving map
- [ ] Nearby layers appear for a selected stay
- [ ] Property detail shows packages as first-class objects
- [ ] Booking completes via mock payment and shows confirmation
- [ ] Customer can save places; admin can manage partners/notes/bookings
- [ ] `npm test` (or equivalent) passes
