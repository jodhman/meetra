# TanStack Query (React Query)

## Overview

All server/API-style requests (Firestore reads/writes, Storage uploads that affect UI state) go through TanStack Query: **queries** for reads, **mutations** for writes. This gives caching, loading/error state, and consistent invalidation.

## Setup

- **Provider**: `QueryClientProvider` in `src/app/_layout.tsx`; client from `src/lib/query-client.ts`.
- **Query keys**: Centralized in `src/lib/query-keys.ts`. Use these for queries and for invalidation in mutations.

## Conventions

- **New read (e.g. new collection)**: Add a key in `queryKeys` in `src/lib/query-keys.ts`, then a `useX` hook in `src/hooks/` that uses `useQuery` and that key.
- **New write**: Add a `useXMutation` hook using `useMutation`; in `onSuccess`, invalidate the relevant query keys so UI stays in sync.
- **Firebase**: Keep Firestore/Storage calls in `src/lib/` (e.g. `profiles.ts`, `profile-photos.ts`). Hooks in `src/hooks/` call those and wrap with `useQuery`/`useMutation`.

## Current usage

- **Profile**: `useProfile(uid)`, `useSetProfileMutation(uid)`, `useUploadProfilePhotoMutation(uid)` in `src/hooks/use-profile-query.ts`. Keys: `queryKeys.profile(uid)`.

## Adding a new API surface

1. Add functions in `src/lib/` (Firestore/Storage or other client).
2. Add query keys in `src/lib/query-keys.ts`.
3. Add `useX` and/or `useXMutation` in `src/hooks/` (or a new hook file).
4. Use the hooks in screens; avoid ad-hoc `getDoc`/`setDoc` in components.
