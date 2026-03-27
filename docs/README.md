# Meetra documentation (standalone library)

This folder is the **canonical, self-contained** description of the product and major systems. You should be able to understand Meetra’s vision, flows, and architecture from `docs/` alone without reading `.cursor/rules/` or the codebase.

## Where to start

| Doc | Purpose |
|-----|---------|
| [APP.md](APP.md) | What the app does today, main flows, where code lives |
| [PRODUCT-CONCEPT.md](PRODUCT-CONCEPT.md) | Full product narrative: Meet → Interact → Match, terminology, monetization, who we serve |
| [BLUEPRINT.md](BLUEPRINT.md) | Deeper vision: QR, modes, Mystery Match, progressive profile, build priorities |

## Skills (`skills/`)

Focused write-ups for specific systems (auth, Firebase, onboarding model, progressive profile, Mystery Match, TanStack Query, event flow, profile flow). Add or update a skill when that system changes.

## Relationship to Cursor rules

`.cursor/rules/` adds **agent/editor** constraints (stack, TypeScript, styling, process). Product truth lives **here** first.
