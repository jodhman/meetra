# Meetra – App overview

Event-based dating platform: users **Meet → Interact → Then Match** at singles events rather than swiping. Meetra targets both **dedicated singles/dating-event organisers** and **regular event organisers** who want to augment their event with a **dating layer**. The app offers **modes** for different event types. **V1:** three example event types (TBD) covering both categories as first modes. Full product concept is in [.cursor/rules/core-product-concept.mdc](../.cursor/rules/core-product-concept.mdc). Detailed vision (QR, leaderboards, rewards, soft matchmaking) is in [BLUEPRINT.md](BLUEPRINT.md). **Progressive profile** (Lite / Social / Full by event phase): [skills/progressive-profile.md](skills/progressive-profile.md).

**Stack:** Expo (React Native), TypeScript, Firebase (Auth, Firestore, Storage), TanStack Query.

## What it does (current implementation)

- **Auth**: Email/password sign up and sign in via Firebase Auth. Unauthenticated users see login/signup; authenticated users see a tabbed app (Dashboard, Explore, Profile).
- **Profile**: Users have a dating profile (display name, bio, date of birth, gender, looking for, interests, photos). Profile data is in Firestore (`profiles/{uid}`); photos are in Firebase Storage (`profiles/{uid}/photos/`).
- **Dashboard**: Simple welcome screen for signed-in users with a link to profile.
- **Explore**: Placeholder / example content (can become discovery later).

## Product phases (vision)

- **Pre-event:** Profile, join event (invite code/link), onboarding → *partially implemented (auth, profile).*
- **During event:** Host-run activities, timers, pairings, no in-app chat → *not yet implemented.*
- **Post-event:** View attendees, like/match, unlock chat → *not yet implemented.*

## Main flows (current)

1. **Auth flow**: Root redirects by auth state → `(auth)/login` or `(auth)/signup` vs `(app)` tabs. Login/signup use `AuthContext`; on success, router replaces to `(app)`.
2. **Profile flow**: Profile tab shows current user’s profile (or “Complete your profile”). Edit screen loads profile via `useProfile`, saves via `useSetProfileMutation`, uploads photos via `useUploadProfilePhotoMutation` (TanStack Query). Data is read/written through `src/lib/firestore/profiles.ts` and `src/lib/storage/profile-photos.ts`.

## Where key logic lives

| Area | Location |
|------|----------|
| Auth state, signIn, signUp, signOut | `src/contexts/auth-context.tsx`, `src/lib/auth.ts` |
| Firebase config | `src/lib/firebase/config.ts` |
| Firestore profile CRUD | `src/lib/firestore/profiles.ts` |
| Profile photo upload | `src/lib/storage/profile-photos.ts` |
| TanStack Query client & keys | `src/lib/query-client.ts`, `src/lib/query-keys.ts` |
| Profile queries/mutations | `src/hooks/use-profile-query.ts` |
| Routes & layouts | `src/app/_layout.tsx`, `src/app/(auth)/`, `src/app/(app)/` |
| Firestore rules | `firestore.rules` |
| Storage rules | `storage.rules` |

## Stack

- **Expo 55**, **expo-router**, **React 19**, **TypeScript**
- **NativeWind** (Tailwind) + **React Native Reusables** (shadcn-style) for UI
- **Firebase JS SDK**: Auth, Firestore, Storage (Expo Go compatible)
- **TanStack Query**: Server state (profile fetch/update, photo upload); all API-style requests should go through query hooks and `queryKeys`
