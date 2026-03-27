# Event flow (MVP)

## Overview

Meetra supports a first MVP event system focused on **one active event per user**.

- Hosts create events and share an **invite code** and **invite URL** (`meetra://join?code=…` / Expo dev equivalents).
- Users can join via invite code, invite link, or **Scan** tab (QR).
- Users check in on arrival with a **check-in code** (typed, deep link `meetra://checkin?code=…`, or **Scan** tab).
- **One global scanner** lives in bottom navigation (**Scan**); all Meetra-generated QR codes are routed through `parseMeetraPayload` (see `src/lib/qr/parse-meetra-payload.ts`).
- Hosts control flow with **active mode** (rotations, icebreakers, quiz, challenges), **end event**, and **remove guest** (soft-remove; history kept).
- Hosts see **live metrics**, **guest list**, **check-in QR** for printing/venue, and **past event roster** (ended events, includes removed guests).

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

### `events/{eventId}/members/{uid}` (roster + history)

- `role` (`host` | `participant`)
- `memberStatus` (`joined` | `checked_in` | `removed`)
- `joinedAt`, `checkedInAt`, `removedAt`, `removedByHostId` (soft-remove for host audit)

Removing a guest deletes their `eventMemberships/{uid}` doc if it pointed at this event, but **keeps** the roster row with `memberStatus: removed` so hosts still see them on **past event** roster.

## QR / deep-link contract (v1)

Implemented in `parseMeetraPayload`:

- `meetra://join?code=…` (hostname `join`)
- `meetra://checkin?code=…` (hostname `checkin` or path `/…/checkin`)
- `CHECKIN:CODE` / `INVITE:CODE`
- Plain 6-character alphanumeric: **ambiguous** — if the user is already in an event and the code matches that event’s `checkInCode`, **Scan** treats it as check-in; otherwise invite.

URL builders: `src/lib/linking/meetra-urls.ts` (`buildInviteJoinUrl`, `buildCheckInUrl`).

## UX behavior (MVP)

- No membership: event hub shows **Create event** and **Join by code**; **Scan** tab for QR.
- Joined but not checked in: minimal event details + check-in card + Scan shortcut.
- Checked in: richer event details unlocked.
- Host (live): full details, share invite link, check-in QR, metrics, guest list (remove), modes, end event.
- Host (ended): “Event ended” + **Past events** list → **Event detail** roster (includes removed).
- No in-app chat during event; chat remains post-event + mutual match only (policy).

## Key files

- `src/lib/firestore/events.ts` — event, membership, roster, host actions
- `src/lib/qr/parse-meetra-payload.ts` — versioned QR / link parsing
- `src/lib/linking/meetra-urls.ts` — invite/check-in URL helpers
- `src/hooks/use-event-query.ts` — TanStack Query hooks
- `src/app/(app)/event/index.tsx` — Event hub UI
- `src/app/(app)/event/[eventId].tsx` — Host past event roster / history
- `src/app/(app)/join.tsx`, `src/app/(app)/checkin.tsx` — deep-link entry points
- `src/app/(app)/scan.tsx` — global scanner + manual fallback
- `src/app/(app)/_layout.tsx` — tabs (includes Scan; join/checkin hidden from tab bar)
- `firestore.rules` — events, memberships, roster permissions
