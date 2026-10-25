# Documentation

New contributors should start with the [root README](../README.md), then read the product overview and setup guide.

| Document | What it explains |
| --- | --- |
| [Product](PRODUCT.md) | Map-first travel marketplace, example journey, current scope and limitations |
| [Setup](SETUP.md) | Local install, environment variables, database lifecycle, troubleshooting and hosting |
| [Architecture](ARCHITECTURE.md) | Frontend/backend boundaries, search flow, route map, mock integrations |
| [Data model](DATA_MODEL.md) | Prisma entities, relationships, constraints, booking states and economics |
| [Contributing](../CONTRIBUTING.md) | Development workflow, checks, smoke verification and pull requests |
| [MVP roadmap](ROADMAP.md) | Milestones in implementation order with acceptance criteria |
| [Product specification](PRODUCT_SPEC.md) | Original English design brief and standalone prompt for another AI model |

The product specification describes the intended product, including features still to build. The product overview and architecture describe the checked-in implementation. The Prisma schema and application source remain the authority for runtime behavior.

## Reusing the product specification

Copy the prompt below the horizontal rule in `PRODUCT_SPEC.md` into a new coding session. Also supply the current architecture and roadmap if extending this repository. Review generated code, run the project's checks, and verify the user journeys; do not assume that every requested feature was implemented.

All maintained documentation should be written in English. External references may be in Czech or another local language; explain their purpose in English. Preserve geographic names and source URLs rather than translating identifiers.
