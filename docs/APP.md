# Meetra – App overview

Event-based dating platform: users **Meet → Interact → Then Match** at singles events rather than swiping. Meetra targets both **dedicated singles/dating-event organisers** and **regular event organisers** who want to augment their event with a **dating layer**. The app offers **modes** for different event types. **V1:** three example event types (TBD) covering both categories as first modes. Monetization is **organiser-first**, aligning incentives with real event outcomes (not user churn) — we position Meetra as the “angels coming to save the dating world” via incentives. Full product concept is in [.cursor/rules/core-product-concept.mdc](../.cursor/rules/core-product-concept.mdc). Detailed vision (QR, leaderboards, rewards, soft matchmaking) is in [BLUEPRINT.md](BLUEPRINT.md). **Progressive profile** (Lite / Social / Full; during-event = **conversation engine**): [skills/progressive-profile.md](skills/progressive-profile.md).

**Stack:** Expo (React Native), TypeScript, Firebase (Auth, Firestore, Storage), TanStack Query.

## What it does (current implementation)

- **Auth**: Email/password sign up and sign in via Firebase Auth. Unauthenticated users see login/signup; authenticated users see a tabbed app (Dashboard, Explore, Profile).
- **Profile**: Users have a dating profile (display name, bio, date of birth, gender, looking for, interests, photos). Profile data is in Firestore (`profiles/{uid}`); photos are in Firebase Storage (`profiles/{uid}/photos/`).
- **Events (MVP)**: Single active event per user. Hosts create events and share **invite codes + invite URLs**; users join by code, link, or **Scan** tab; arrival check-in via check-in code, link, or **Scan**; **global QR scanner** in bottom tabs; host can switch active event mode, **end event**, **remove guests** (soft-remove with history), and open **past event roster** (includes removed guests).
- **Dashboard**: Simple welcome screen for signed-in users with a link to profile.
- **Explore**: Placeholder / example content (can become discovery later).

## Product phases (vision)

- **Pre-event:** Profile, join event (invite code/link), onboarding → *partially implemented (auth, profile).*
- **During event:** Host-run activities, timers, pairings, no in-app chat; **UI and navigation stay stripped down** to what supports that phase (not a full generic app shell) → *not yet implemented.*
- **Post-event:** View attendees, like/match, unlock chat → *not yet implemented.*

## Main flows (current)

1. **Auth flow**: Root redirects by auth state → `(auth)/login` or `(auth)/signup` vs `(app)` tabs. Login/signup use `AuthContext`; on success, router replaces to `(app)`.
2. **Profile flow**: Profile tab shows current user’s profile (or “Complete your profile”). Edit screen loads profile via `useProfile`, saves via `useSetProfileMutation`, uploads photos via `useUploadProfilePhotoMutation` (TanStack Query). Data is read/written through `src/lib/firestore/profiles.ts` and `src/lib/storage/profile-photos.ts`.
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
