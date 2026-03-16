# Singles Night – App overview

Dating-style app built with Expo (React Native), TypeScript, Firebase (Auth, Firestore, Storage), and TanStack Query.

## What it does

- **Auth**: Email/password sign up and sign in via Firebase Auth. Unauthenticated users see login/signup; authenticated users see a tabbed app (Dashboard, Explore, Profile).
- **Profile**: Users have a dating profile (display name, bio, date of birth, gender, looking for, interests, photos). Profile data is in Firestore (`profiles/{uid}`); photos are in Firebase Storage (`profiles/{uid}/photos/`).
- **Dashboard**: Simple welcome screen for signed-in users with a link to profile.
- **Explore**: Placeholder / example content (can become discovery later).

## Main flows

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
