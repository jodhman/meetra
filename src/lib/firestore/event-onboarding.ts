/**
 * Optional event onboarding: tonight-only / mode-specific context.
 * Stored on `events/{eventId}/members/{memberUid}` under `eventOnboarding` — does not replace
 * persistent profile data. Mystery Match + host modes read this alongside profile participation defaults.
 */

import { getDoc, serverTimestamp, updateDoc, type Timestamp } from 'firebase/firestore';

import type { ClueClassId } from '@/constants/onboarding';

import { eventMemberDocRef } from '@/lib/firestore/events';

/** Participation state for Mystery Match — maps to exit-hatch / discoverability UX. */
export type MysteryMatchParticipationState =
  | 'active'
  | 'paused_discoverability'
  | 'skipped_assignment'
  | 'left_mode'
  | 'hidden_for_event';

export interface EventOnboardingState {
  participateTonight: boolean | null;
  discoverableTonight: boolean | null;
  tonightIntention: string;
  tonightEnergy: string;
  meetingTonightPreference: string;
  /** When set, overrides profile.participationDefaults for this event only. */
  allowedClueTypesOverride: ClueClassId[] | null;
  excludedClueTypesOverride: ClueClassId[] | null;
  mysteryMatchParticipation: MysteryMatchParticipationState | null;
  updatedAt: Timestamp | null;
}

export const DEFAULT_EVENT_ONBOARDING: Omit<EventOnboardingState, 'updatedAt'> = {
  participateTonight: null,
  discoverableTonight: null,
  tonightIntention: '',
  tonightEnergy: '',
  meetingTonightPreference: '',
  allowedClueTypesOverride: null,
  excludedClueTypesOverride: null,
  mysteryMatchParticipation: null,
};

/**
 * Merge event onboarding for the signed-in member row.
 * Future: host-driven prompts / mode start hooks can also write here.
 */
export async function mergeEventMemberOnboarding(
  uid: string,
  eventId: string,
  patch: Partial<Omit<EventOnboardingState, 'updatedAt'>>
): Promise<void> {
  const ref = eventMemberDocRef(eventId, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error('You are not on this event roster.');

  const data = snap.data();
  const prevRaw = data.eventOnboarding;
  const prev =
    prevRaw && typeof prevRaw === 'object'
      ? (prevRaw as Record<string, unknown>)
      : {};

  const next: Record<string, unknown> = {
    ...DEFAULT_EVENT_ONBOARDING,
    ...Object.fromEntries(
      Object.entries(prev).filter(
        ([k]) => k !== 'updatedAt'
      )
    ),
    ...patch,
    updatedAt: serverTimestamp(),
  };

  await updateDoc(ref, { eventOnboarding: next });
}

export function parseEventOnboarding(raw: unknown): EventOnboardingState {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_EVENT_ONBOARDING, updatedAt: null };
  }
  const o = raw as Record<string, unknown>;
  return {
    participateTonight: typeof o.participateTonight === 'boolean' ? o.participateTonight : null,
    discoverableTonight: typeof o.discoverableTonight === 'boolean' ? o.discoverableTonight : null,
    tonightIntention: typeof o.tonightIntention === 'string' ? o.tonightIntention : '',
    tonightEnergy: typeof o.tonightEnergy === 'string' ? o.tonightEnergy : '',
    meetingTonightPreference:
      typeof o.meetingTonightPreference === 'string' ? o.meetingTonightPreference : '',
    allowedClueTypesOverride: Array.isArray(o.allowedClueTypesOverride)
      ? (o.allowedClueTypesOverride as string[]).filter((x): x is ClueClassId => typeof x === 'string')
      : null,
    excludedClueTypesOverride: Array.isArray(o.excludedClueTypesOverride)
      ? (o.excludedClueTypesOverride as string[]).filter((x): x is ClueClassId => typeof x === 'string')
      : null,
    mysteryMatchParticipation:
      typeof o.mysteryMatchParticipation === 'string'
        ? (o.mysteryMatchParticipation as MysteryMatchParticipationState)
        : null,
    updatedAt: o.updatedAt && typeof o.updatedAt === 'object' && 'toMillis' in o.updatedAt
      ? (o.updatedAt as Timestamp)
      : null,
  };
}
