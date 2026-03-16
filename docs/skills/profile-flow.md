# Profile flow

## Overview

Users have one dating profile per account. Profile is stored in Firestore (`profiles/{uid}`); photos in Storage (`profiles/{uid}/photos/`). UI: view (profile tab) and edit screen.

## Data

- **Type**: `DatingProfile` in `src/lib/firestore/profiles.ts` (displayName, bio, dateOfBirth, gender, lookingFor, photoURLs, interests, createdAt, updatedAt).
- **Read/write**: `getProfile(uid)`, `setProfile(uid, data)` in `src/lib/firestore/profiles.ts`.
- **Photos**: `uploadProfilePhoto(uid, photoId, blob)` in `src/lib/storage/profile-photos.ts`; URLs are stored in the profile doc’s `photoURLs` array.

## TanStack Query

- **Query**: `useProfile(uid)` – fetches profile; used on profile view and edit.
- **Mutations**: `useSetProfileMutation(uid)` (save profile), `useUploadProfilePhotoMutation(uid)` (upload one photo). Both invalidate the profile query on success.
- **Keys**: `queryKeys.profile(uid)` in `src/lib/query-keys.ts`.

## Screens

- **Profile tab** (`src/app/(app)/profile/index.tsx`): Uses `useProfile(user?.uid)`. Shows “Complete your profile” if empty, else card with photos, bio, interests and “Edit profile”.
- **Edit** (`src/app/(app)/profile/edit.tsx`): Uses `useProfile` for initial data, `useSetProfileMutation` for save, `useUploadProfilePhotoMutation` for adding photos. Form state is local; on save, mutation runs and invalidates profile query, then router.back().

## Adding fields

1. Add to `DatingProfile` and `DEFAULT_PROFILE` in `src/lib/firestore/profiles.ts`.
2. Add to edit form and view in profile index.
3. No Firestore rule change needed for new fields on `profiles/{uid}`.
