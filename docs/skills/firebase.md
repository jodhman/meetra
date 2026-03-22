# Firebase (Firestore + Storage)

## Overview

- **Firebase JS SDK** only (Expo Go compatible). Config from `process.env.EXPO_PUBLIC_*` in `src/lib/firebase/config.ts`.
- **Firestore**: profiles in `profiles/{uid}`; one doc per user. See `src/lib/firestore/profiles.ts` for types and CRUD.
- **Firestore events (MVP)**: `events/{eventId}` and single active membership in `eventMemberships/{uid}`. See `src/lib/firestore/events.ts`.
- **Storage**: profile photos at `profiles/{uid}/photos/{photoId}`. See `src/lib/storage/profile-photos.ts`.

## Firestore

- **Collection**: `profiles`
- **Document ID**: Firebase Auth UID.
- **Fields**: displayName, bio, dateOfBirth, gender, lookingFor, photos (`{ id: string; url: string }[]` ordered), vibeTags (string[], max 3), eventIntention (string), prompts (`{ promptId: string; answer: string }[]`), talkAbout (string), interests (string[]), createdAt, updatedAt.
- **Rules** (`firestore.rules`): Authenticated read any profile; create/update/delete only own doc (`request.auth.uid == userId`).

- **Collection**: `events`
- **Document ID**: auto ID.
- **Fields**: title, shortBlurb, venueHint, hostId, inviteCode, checkInCode, status, activeMode, createdAt, updatedAt.
- **Rules**: Authenticated users can read; only host can create/update/delete (`hostId == request.auth.uid`).

- **Collection**: `eventMemberships`
- **Document ID**: Firebase Auth UID.
- **Fields**: eventId, role, status, joinedAt, checkedInAt.
- **Rules**: User can read/write only own membership doc (`request.auth.uid == userId`).

## Storage

- **Path pattern**: `profiles/{userId}/photos/{photoId}`.
- **Rules** (`storage.rules`): Authenticated read any; write only when `request.auth.uid == userId`.

## When changing

- New collections or paths → update `firestore.rules` or `storage.rules` and deploy (`firebase deploy --only firestore:rules` or `--only storage`).
- New profile fields → update `DatingProfile` in `src/lib/firestore/profiles.ts` and any forms; rules stay the same unless you add new collections.
