# Event flow (MVP)

## Overview

Meetra now supports a first MVP event system focused on **one active event per user**.

- Hosts can create events and share an **invite code**.
- Users can join via invite code.
- Users check in on arrival with an **event check-in code** (QR-backed flow can map to this).
- Hosts can control event flow by setting an active **mode** (rotations, icebreakers, quiz, challenges).

## Data model

### `events/{eventId}`

- `title`, `shortBlurb`, `venueHint`
- `hostId`
- `inviteCode` (join)
- `checkInCode` (arrival/presence signal)
- `status` (`draft` | `live` | `ended`)
- `activeMode` (`rotations` | `icebreakers` | `quiz` | `challenges` | `null`)
- `createdAt`, `updatedAt`

### `eventMemberships/{uid}`

Single active membership doc per user (MVP):

- `eventId`
- `role` (`host` | `participant`)
- `status` (`joined` | `checked_in`)
- `joinedAt`, `checkedInAt`

## UX behavior (MVP)

- No membership: event hub shows **Create event** and **Join by code**.
- Joined but not checked in: minimal event details + check-in card.
- Checked in: richer event details unlocked.
- Host: full event details + mode controls.
- No in-app chat during event; chat remains post-event + mutual match only (policy, not messaging UI in MVP).

## Key files

- `src/lib/firestore/events.ts` — event + membership CRUD and host controls
- `src/hooks/use-event-query.ts` — TanStack Query hooks
- `src/app/(app)/event/index.tsx` — Event hub UI (host + user dashboard)
- `src/app/(app)/_layout.tsx` — Event tab
- `firestore.rules` — events and memberships permissions
