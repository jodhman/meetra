# Profile flow

**Product vision:** Meetra uses a **layered, phase-based profile** (Lite → Social → Full). During an event the UI behaves as a **conversation engine** (talk hooks, vibe, icebreakers), not a static résumé. **Social handle first. Profile later. Interaction always.** — V1 minimum persistent identity is **one photo, first name, one expressive line**; deeper fields are progressive and must not gate first-time event participation ([PRODUCT-CONCEPT.md](../PRODUCT-CONCEPT.md), [progressive-profile.md](./progressive-profile.md)). This sits on top of the two-level onboarding model ([onboarding-model.md](./onboarding-model.md)) and supports mode behavior such as [Spark Prompts](./spark-prompts.md) (first validation, prompt-driven) and [Mystery Match](./mystery-match.md) (flagship differentiated, **guided narrowing** in the **active Meetra layer**).

## Overview

Users have one dating profile per account. Profile is stored in Firestore (`profiles/{uid}`); photos in Storage (`profiles/{uid}/photos/`). UI: profile tab with layer preview, **general onboarding** (`profile/onboarding`), and edit screen.

## Data

- **Type**: `DatingProfile` in `src/lib/firestore/profiles.ts` — identity (displayName, dateOfBirth, photos, gender, lookingFor), bio, interests, vibeTags, eventIntention, hinge-style `prompts`, optional `talkAbout` (kept in sync with hooks on save), structured **`conversationHooks`**, `socialEnergy`, `interactionStyle`, `lifestyleSignals`, **AI-assisted** `aiVibeSummary`, `aiStandoutHook`, `aiSuggestedAskMe` (user-editable), **`participationDefaults`**, **`generalOnboardingCompletedAt`** (required today — everyone completes the full compressed flow; **product direction** is to align gating with the social-handle minimum over time), timestamps.
- **Read/write**: `getProfile(uid)`, `setProfile(uid, data)`; `normalizeProfilePayload` syncs `talkAbout` with `conversationHooks.askMeAbout` when appropriate.
- **Photos (ordered)**: `uploadProfilePhoto` in `src/lib/storage/profile-photos.ts`; Firestore stores `photos: { id, url }[]` only (no alternate legacy fields).

## TanStack Query

- **Query**: `useProfile(uid)` — profile tab, onboarding, edit.
- **Mutations**: `useSetProfileMutation`, `useUploadProfilePhotoMutation`, **`useGenerateVibeMutation`** (calls `synthesizeVibe` in `src/lib/profile/vibe-synthesis.ts`, then saves AI lines).
- **Keys**: `queryKeys.profile(uid)`.

## General onboarding

- **Route**: `src/app/(app)/profile/onboarding.tsx` — five compressed steps (identity → vibe → conversation hooks → interests/lifestyle → participation defaults). Step 1 asks only **general** connection intent (`lookingFor`); optional **event intention** / tonight framing stays on **edit profile** or future **event onboarding** so it does not duplicate “looking for.” *Product note:* the **social handle** floor is photo + first name + one expressive line; the codebase may still require all five steps before `generalOnboardingCompletedAt` until product and implementation converge.
- **Completion**: Sets `generalOnboardingCompletedAt` and runs vibe synthesis (OpenAI when `EXPO_PUBLIC_OPENAI_API_KEY` is set; otherwise local copy from user facts only).
- **Constants**: `src/constants/onboarding.ts` (chips, clue classes, social energy options).

## Layered UI

- **`profileForLayer`** in `src/lib/profile-layers.ts` maps `DatingProfile` → `ProfileLayerView` for `lite` | `social` | `full`.
- **Profile tab** (`src/app/(app)/profile/index.tsx`): toggles Before / During / After; Social emphasizes hooks, standout line, icebreaker; Full adds bio and post-event placeholder copy.

## Event onboarding (scaffolding)

- **Types + merge**: `src/lib/firestore/event-onboarding.ts` — optional `eventOnboarding` on `events/{eventId}/members/{uid}` for tonight-only context (intention, energy, clue overrides, Mystery Match participation state). **Does not** replace persistent profile fields.
- **Hook**: `useMergeEventOnboardingMutation` in `src/hooks/use-event-onboarding.ts` — invalidates active event membership query on success.

## Adding fields

1. Add to `DatingProfile` and `DEFAULT_PROFILE` in `src/lib/firestore/profiles.ts` with safe parsing in `getProfile`.
2. Add to onboarding and/or edit and profile view as needed.
3. Firestore rules unchanged for new fields on `profiles/{uid}`.
