# Auth system

## Overview

- **Firebase Auth** (JS SDK) for email/password sign up and sign in.
- **Auth state** is exposed via `AuthProvider` and `useAuth()` in `src/contexts/auth-context.tsx`.
- **Auth helpers** (signUp, signIn, signOut, subscribeToAuthStateChanged, getAuthErrorMessage) live in `src/lib/auth.ts`; config in `src/lib/firebase/config.ts`.

## Flow

1. App root wraps with `AuthProvider`, which subscribes to `onAuthStateChanged` and sets `user` and `loading`.
2. Root layout uses `Stack.Protected guard={!user}` for `(auth)` and `guard={!!user}` for `(app)`.
3. `src/app/index.tsx` redirects: no user → `/(auth)/login`, user → `/(app)`.
4. Login/signup screens call `signIn`/`signUp` from `useAuth()`; on success they `router.replace('/(app)')`.
5. Sign out calls `signOut()` then `router.replace('/(auth)/login')`.

## Key files

- `src/contexts/auth-context.tsx` – AuthProvider, useAuth
- `src/lib/auth.ts` – signUp, signIn, signOut, getAuthErrorMessage
- `src/lib/firebase/config.ts` – auth instance
- `src/app/(auth)/login.tsx`, `src/app/(auth)/signup.tsx`

## Adding flows

- New auth methods (e.g. Google): add in `src/lib/auth.ts`, expose via context if needed.
- Password reset: add in `auth.ts` and a screen under `(auth)`.
