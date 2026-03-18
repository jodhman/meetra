# Profile flow

**Product vision:** Meetra will move toward a **layered, phase-based profile** (Lite → Social → Full). See [progressive-profile.md](./progressive-profile.md). Today the app uses a **single static profile** for all contexts.

## Overview

Users have one dating profile per account. Profile is stored in Firestore (`profiles/{uid}`); photos in Storage (`profiles/{uid}/photos/`). UI: view (profile tab) and edit screen.

## Data

- **Type**: `DatingProfile` in `src/lib/firestore/profiles.ts` (displayName, bio, dateOfBirth, gender, lookingFor, photos, vibeTags, eventIntention, prompts, talkAbout, interests, createdAt, updatedAt).
- **Read/write**: `getProfile(uid)`, `setProfile(uid, data)` in `src/lib/firestore/profiles.ts`.
- **Photos (ordered)**: `uploadProfilePhoto(uid, photoId, blob)` in `src/lib/storage/profile-photos.ts`; the profile doc stores an ordered `photos: { id, url }[]` array (index 0 = main/hero photo). Legacy `photoURLs` is read for existing users and mapped into `photos`.

## TanStack Query

- **Query**: `useProfile(uid)` – fetches profile; used on profile view and edit.
- **Mutations**: `useSetProfileMutation(uid)` (save profile), `useUploadProfilePhotoMutation(uid)` (upload one photo). Both invalidate the profile query on success.
- **Keys**: `queryKeys.profile(uid)` in `src/lib/query-keys.ts`.

## Screens

- **Profile tab** (`src/app/(app)/profile/index.tsx`): Uses `useProfile(user?.uid)`. Shows “Complete your profile” if empty, else renders a layered Lite/Social/Full preview with ordered photos, `vibeTags`, prompt cards, and phase-specific visibility.
- **Edit** (`src/app/(app)/profile/edit.tsx`): Uses `useProfile` for initial data, `useSetProfileMutation` for save. Edit supports ordered photo reordering, `eventIntention`, fixed `vibeTags` (max 3), prompt slots (max 5), and `talkAbout`.

## Adding fields

1. Add to `DatingProfile` and `DEFAULT_PROFILE` in `src/lib/firestore/profiles.ts`.
2. Add to edit form and view in profile index.
3. No Firestore rule change needed for new fields on `profiles/{uid}`.
