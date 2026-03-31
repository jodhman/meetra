# Meetra – App overview

Event-based dating platform: users **Meet → Interact → Then Match** at singles events rather than swiping. Product direction: **do not** aim to look or behave like a generic dating app (see [PRODUCT-CONCEPT.md](PRODUCT-CONCEPT.md), [progressive-profile.md](skills/progressive-profile.md)). **V1 identity bar:** **Social handle first. Profile later. Interaction always.** — minimum persistent identity is **one photo, first name, one expressive line**; enough to join, be discoverable, and join live modes; deeper profile is progressive and not required for first-time participation (see [PRODUCT-CONCEPT.md](PRODUCT-CONCEPT.md)). Meetra targets both **dedicated singles/dating-event organisers** and **regular event organisers** who want to augment their event with a **dating layer**. The app offers **modes** for different event types. **V1 direction:** **interaction foundation first** — **Spark Prompts** (working name) as the **first validation mode** ([skills/spark-prompts.md](skills/spark-prompts.md)); **Mystery Match** as **flagship differentiated** mode ([skills/mystery-match.md](skills/mystery-match.md)). **QR** remains **long-term infrastructure** in vision, not MVP-defining for first validation ([BLUEPRINT.md](BLUEPRINT.md)). Monetization is **organiser-first**. Full product concept: [PRODUCT-CONCEPT.md](PRODUCT-CONCEPT.md). **Progressive profile:** [skills/progressive-profile.md](skills/progressive-profile.md). **Onboarding model:** [skills/onboarding-model.md](skills/onboarding-model.md).

**Stack:** Expo (React Native), TypeScript, Firebase (Auth, Firestore, Storage), TanStack Query.

## What it does (current implementation)

- **Auth**: Email/password sign up and sign in via Firebase Auth. Unauthenticated users see login/signup; authenticated users see a tabbed app (Dashboard, Explore, Profile).
- **Profile**: Dating profile in Firestore (`profiles/{uid}`) with layered visibility (Lite / Social / Full) and a **compressed general onboarding** flow (`profile/onboarding`) plus edit screen. Structured **conversation hooks**, vibe/social energy, lifestyle signals, **participation defaults** (incl. clue-type prefs for Mystery Match), and optional **AI-assisted intro lines** (user-editable; OpenAI optional via env, else local synthesis). Photos in Firebase Storage (`profiles/{uid}/photos/`). Optional **event onboarding** (tonight-only) is scaffolded on `events/{eventId}/members/{uid}` — see `src/lib/firestore/event-onboarding.ts`.
- **Events (MVP)**: Single active event per user. Hosts create events and share **invite codes + invite URLs**; users join by code, link, or **Scan** tab; arrival check-in via check-in code, link, or **Scan**; **global QR scanner** in bottom tabs; host can switch active event mode, **end event**, **remove guests** (soft-remove with history), and open **past event roster** (includes removed guests).
- **Dashboard**: Simple welcome screen for signed-in users with a link to profile.
- **Explore**: Placeholder / example content (can become discovery later).

## Product phases (vision)

- **Pre-event:** Profile, join event (invite code/link), **general onboarding** (persistent) + optional **event onboarding** (contextual/mode-based) → *general onboarding + layered profile UI implemented; event onboarding merge helper implemented, mode UIs still to come.*
- **During event:** Host-run activities, timers, pairings, no in-app chat; **UI and navigation stay stripped down** to what supports that phase (not a full generic app shell). **Product direction:** **Spark Prompts** first (prompt-driven interaction foundation); **Mystery Match** as flagship differentiated mode (**guided narrowing**, **active participant layer**); **QR-heavy** game infrastructure later in the roadmap — *mode UIs (Spark Prompts, Mystery Match) not yet implemented.*
- **Post-event:** View attendees, like/match, unlock chat → *not yet implemented.*

## Product direction clarifications

- **V1 mode sequencing:** **Spark Prompts** validates whether Meetra improves **live conversations** with **low friction**; **Mystery Match** is the **flagship differentiated** mode (same strategic importance, sequenced **after** the interaction foundation is validated). **QR** stays central to the **long-term** blueprint; it is **not** required to validate the core interaction thesis first ([PRODUCT-CONCEPT.md](PRODUCT-CONCEPT.md), [BLUEPRINT.md](BLUEPRINT.md)).
- **Mystery Match is a during-event layer, not final matching:** It assigns one **promising connection** within the **active Meetra participant layer** (**guided narrowing**, not a room-wide scavenger hunt); checkpoints (e.g. scan) apply where **QR infrastructure** is in play. Final **match** remains mutual-like after the event ([mystery-match.md](skills/mystery-match.md)).
- **Spark Prompts:** **Prompt-driven** foundation mode — **not** implemented in app yet; spec [spark-prompts.md](skills/spark-prompts.md).
- **Soft matchmaking language:** Keep wording suggestive (`promising connection`, `likely fit`, `strong conversation fit`), not deterministic (`perfect match`, `soulmate`).
- **Onboarding model:** Data generally true across events belongs in **general onboarding**; tonight/mode-specific context belongs in optional **event onboarding**.
- **Exit hatch requirement:** Mystery Match includes a private, low-friction opt-out path before or after reveal (`skip/stop/leave/pause discoverability`) so users can disengage without social penalty.
- **Social-handle floor vs app today:** Product direction locks **photo + first name + one expressive line** as the minimum to participate; the current **general onboarding** flow may still collect additional steps before `generalOnboardingCompletedAt` — align implementation with this bar over time ([onboarding-model.md](skills/onboarding-model.md), [profile-flow.md](skills/profile-flow.md)).

## Main flows (current)

1. **Auth flow**: Root redirects by auth state → `(auth)/login` or `(auth)/signup` vs `(app)` tabs. Login/signup use `AuthContext`; on success, router replaces to `(app)`.
2. **Profile flow**: **General onboarding** is required for everyone (`generalOnboardingCompletedAt` on `profiles/{uid}`). Profile tab and dashboard link to `profile/onboarding` until complete; then layer preview (Before / During / After), `profile/edit`, and `useGenerateVibeMutation`. Data: `src/lib/firestore/profiles.ts`, `src/lib/profile/vibe-synthesis.ts`, `src/lib/profile-layers.ts`, `src/constants/onboarding.ts`; photos via `src/lib/storage/profile-photos.ts` (ordered `photos` array only — no legacy shapes).
3. **Event flow (MVP)**: Event tab loads `useActiveEventMembership`. No membership → create/join cards. With membership → event dashboard from `useEvent(eventId)`, check-in, **Scan** tab for all Meetra QRs, host controls (modes, metrics, roster, share invite + check-in QR, end event). Deep links `/(app)/join` and `/(app)/checkin` handle `?code=`. Past host events → `/(app)/event/[eventId]` roster history.

## Where key logic lives

| Area | Location |
|------|----------|
| Auth state, signIn, signUp, signOut | `src/contexts/auth-context.tsx`, `src/lib/auth.ts` |
| Firebase config | `src/lib/firebase/config.ts` |
| Firestore profile CRUD | `src/lib/firestore/profiles.ts` |
| Firestore event + membership CRUD | `src/lib/firestore/events.ts` |
| Profile photo upload | `src/lib/storage/profile-photos.ts` |
| TanStack Query client & keys | `src/lib/query-client.ts`, `src/lib/query-keys.ts` |
| Profile queries/mutations | `src/hooks/use-profile-query.ts` |
| Event onboarding merge (member row) | `src/lib/firestore/event-onboarding.ts`, `src/hooks/use-event-onboarding.ts` |
| Vibe synthesis (optional OpenAI) | `src/lib/profile/vibe-synthesis.ts` |
| Event queries/mutations | `src/hooks/use-event-query.ts` |
| QR payload parsing | `src/lib/qr/parse-meetra-payload.ts` |
| Meetra invite/check-in URLs | `src/lib/linking/meetra-urls.ts` |
| Global QR scanner | `src/app/(app)/scan.tsx` |
| Routes & layouts | `src/app/_layout.tsx`, `src/app/(auth)/`, `src/app/(app)/` |
| Firestore rules | `firestore.rules` |
| Storage rules | `storage.rules` |

## Stack

- **Expo 55**, **expo-router**, **React 19**, **TypeScript**
- **NativeWind** (Tailwind) + **React Native Reusables** (shadcn-style) for UI
- **Firebase JS SDK**: Auth, Firestore, Storage (Expo Go compatible)
- **TanStack Query**: Server state (profile fetch/update, photo upload); all API-style requests should go through query hooks and `queryKeys`
