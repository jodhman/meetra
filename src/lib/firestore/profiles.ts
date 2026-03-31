import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';

import { DEFAULT_ALLOWED_CLUE_TYPES, type ClueClassId } from '@/constants/onboarding';

import { db } from '@/lib/firebase/config';

export interface ProfilePhoto {
  id: string;
  url: string;
}

export interface ProfilePromptAnswer {
  promptId: string;
  answer: string;
}

export type ProfileLayer = 'lite' | 'social' | 'full';

/** Structured conversation engine fields (general onboarding). */
export interface ConversationHooks {
  askMeAbout: string;
  talkForeverAbout: string;
  friendsWouldSay: string;
  excitedWhen: string;
}

/** Durable defaults; event onboarding can override for tonight only (see event-onboarding). */
export interface ParticipationDefaults {
  openToPlayfulModes: boolean;
  openToDiscoverable: boolean;
  allowedClueTypes: ClueClassId[];
  excludedClueTypes: ClueClassId[];
}

export const DEFAULT_CONVERSATION_HOOKS: ConversationHooks = {
  askMeAbout: '',
  talkForeverAbout: '',
  friendsWouldSay: '',
  excitedWhen: '',
};

export const DEFAULT_PARTICIPATION_DEFAULTS: ParticipationDefaults = {
  openToPlayfulModes: true,
  openToDiscoverable: true,
  allowedClueTypes: [...DEFAULT_ALLOWED_CLUE_TYPES],
  excludedClueTypes: [],
};

export interface DatingProfile {
  displayName: string;
  bio: string;
  dateOfBirth: string | null;
  gender: string;
  lookingFor: string;
  photos: ProfilePhoto[];
  interests: string[];
  vibeTags: string[];
  eventIntention: string;
  prompts: ProfilePromptAnswer[];
  /** Optional line synced from conversationHooks.askMeAbout on save; primaryTalkHook prefers hooks. */
  talkAbout: string;
  conversationHooks: ConversationHooks;
  /** From Step 2 — single primary energy label id or custom short label */
  socialEnergy: string;
  /** Structured style ids from chips (e.g. deep_over_smalltalk, playful). */
  interactionStyle: string[];
  lifestyleSignals: string[];
  /** User-editable AI-assisted lines (optional API; see vibe-synthesis). */
  aiVibeSummary: string;
  aiStandoutHook: string;
  aiSuggestedAskMe: string;
  participationDefaults: ParticipationDefaults;
  /** ISO timestamp when the 5-step general onboarding was completed. */
  generalOnboardingCompletedAt: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export const DEFAULT_PROFILE: Omit<DatingProfile, 'createdAt' | 'updatedAt'> = {
  displayName: '',
  bio: '',
  dateOfBirth: null,
  gender: '',
  lookingFor: '',
  photos: [],
  interests: [],
  vibeTags: [],
  eventIntention: '',
  prompts: [],
  talkAbout: '',
  conversationHooks: { ...DEFAULT_CONVERSATION_HOOKS },
  socialEnergy: '',
  interactionStyle: [],
  lifestyleSignals: [],
  aiVibeSummary: '',
  aiStandoutHook: '',
  aiSuggestedAskMe: '',
  participationDefaults: { ...DEFAULT_PARTICIPATION_DEFAULTS, allowedClueTypes: [...DEFAULT_ALLOWED_CLUE_TYPES] },
  generalOnboardingCompletedAt: null,
};

export function profileDocRef(uid: string) {
  return doc(db, 'profiles', uid);
}

function parseConversationHooks(raw: unknown): ConversationHooks {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CONVERSATION_HOOKS };
  const o = raw as Record<string, unknown>;
  return {
    askMeAbout: typeof o.askMeAbout === 'string' ? o.askMeAbout : '',
    talkForeverAbout: typeof o.talkForeverAbout === 'string' ? o.talkForeverAbout : '',
    friendsWouldSay: typeof o.friendsWouldSay === 'string' ? o.friendsWouldSay : '',
    excitedWhen: typeof o.excitedWhen === 'string' ? o.excitedWhen : '',
  };
}

function parseAllowedClueTypes(raw: unknown): ClueClassId[] {
  if (!Array.isArray(raw)) return [...DEFAULT_ALLOWED_CLUE_TYPES];
  const out: ClueClassId[] = [];
  const allowed = new Set(DEFAULT_ALLOWED_CLUE_TYPES);
  for (const x of raw) {
    if (typeof x === 'string' && allowed.has(x as ClueClassId)) out.push(x as ClueClassId);
  }
  return out.length ? out : [...DEFAULT_ALLOWED_CLUE_TYPES];
}

function parseExcludedClueTypes(raw: unknown): ClueClassId[] {
  if (!Array.isArray(raw)) return [];
  const out: ClueClassId[] = [];
  const allowed = new Set(DEFAULT_ALLOWED_CLUE_TYPES);
  for (const x of raw) {
    if (typeof x === 'string' && allowed.has(x as ClueClassId)) out.push(x as ClueClassId);
  }
  return out;
}

function parseParticipationDefaults(raw: unknown): ParticipationDefaults {
  if (!raw || typeof raw !== 'object') {
    return {
      ...DEFAULT_PARTICIPATION_DEFAULTS,
      allowedClueTypes: [...DEFAULT_ALLOWED_CLUE_TYPES],
    };
  }
  const o = raw as Record<string, unknown>;
  return {
    openToPlayfulModes: typeof o.openToPlayfulModes === 'boolean' ? o.openToPlayfulModes : true,
    openToDiscoverable: typeof o.openToDiscoverable === 'boolean' ? o.openToDiscoverable : true,
    allowedClueTypes: parseAllowedClueTypes(o.allowedClueTypes),
    excludedClueTypes: parseExcludedClueTypes(o.excludedClueTypes),
  };
}

export async function getProfile(uid: string): Promise<DatingProfile | null> {
  const ref = profileDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();

  const photosRaw: unknown[] | null = Array.isArray(data.photos) ? (data.photos as unknown[]) : null;

  const photos: ProfilePhoto[] = photosRaw
    ? photosRaw
        .map((p) => {
          if (!p || typeof p !== 'object') return null;
          const record = p as Record<string, unknown>;
          const id = typeof record.id === 'string' ? record.id : '';
          const url = typeof record.url === 'string' ? record.url : '';
          if (!id || !url) return null;
          return { id, url };
        })
        .filter((p): p is ProfilePhoto => !!p)
    : [];

  const vibeTags = Array.isArray(data.vibeTags)
    ? (data.vibeTags as unknown[]).filter((t): t is string => typeof t === 'string')
    : [];

  const interests = Array.isArray(data.interests)
    ? (data.interests as unknown[]).filter((i): i is string => typeof i === 'string')
    : [];

  const prompts: ProfilePromptAnswer[] = Array.isArray(data.prompts)
    ? (data.prompts as unknown[])
        .map((p) => {
          if (!p || typeof p !== 'object') return null;
          const record = p as Record<string, unknown>;
          const promptId = typeof record.promptId === 'string' ? record.promptId : '';
          const answer = typeof record.answer === 'string' ? record.answer : '';
          if (!promptId || !answer) return null;
          return { promptId, answer };
        })
        .filter((p): p is ProfilePromptAnswer => !!p)
    : [];

  const conversationHooks = parseConversationHooks(data.conversationHooks);
  const talkAbout = typeof data.talkAbout === 'string' ? data.talkAbout : '';

  const interactionStyle = Array.isArray(data.interactionStyle)
    ? (data.interactionStyle as unknown[]).filter((s): s is string => typeof s === 'string')
    : [];

  const lifestyleSignals = Array.isArray(data.lifestyleSignals)
    ? (data.lifestyleSignals as unknown[]).filter((s): s is string => typeof s === 'string')
    : [];

  return {
    displayName: data.displayName ?? '',
    bio: data.bio ?? '',
    dateOfBirth: data.dateOfBirth ?? null,
    gender: data.gender ?? '',
    lookingFor: data.lookingFor ?? '',
    photos,
    interests,
    vibeTags,
    eventIntention: typeof data.eventIntention === 'string' ? data.eventIntention : '',
    prompts,
    talkAbout,
    conversationHooks,
    socialEnergy: typeof data.socialEnergy === 'string' ? data.socialEnergy : '',
    interactionStyle,
    lifestyleSignals,
    aiVibeSummary: typeof data.aiVibeSummary === 'string' ? data.aiVibeSummary : '',
    aiStandoutHook: typeof data.aiStandoutHook === 'string' ? data.aiStandoutHook : '',
    aiSuggestedAskMe: typeof data.aiSuggestedAskMe === 'string' ? data.aiSuggestedAskMe : '',
    participationDefaults: parseParticipationDefaults(data.participationDefaults),
    generalOnboardingCompletedAt:
      typeof data.generalOnboardingCompletedAt === 'string' ? data.generalOnboardingCompletedAt : null,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export async function setProfile(
  uid: string,
  data: Partial<Omit<DatingProfile, 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const ref = profileDocRef(uid);
  const snap = await getDoc(ref);
  const payload = {
    ...data,
    updatedAt: serverTimestamp(),
  };
  if (!snap.exists()) {
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
  } else {
    await updateDoc(ref, payload);
  }
}

export function ageFromDateOfBirth(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

/** Primary talk hook for Lite/Social (conversation engine). */
export function primaryTalkHook(profile: DatingProfile): string {
  const ask = profile.conversationHooks.askMeAbout.trim();
  if (ask) return profile.conversationHooks.askMeAbout;
  return profile.talkAbout.trim();
}

/** True until `generalOnboardingCompletedAt` is set (required for everyone). */
export function shouldPromptGeneralOnboarding(profile: DatingProfile | null): boolean {
  if (!profile) return true;
  return !profile.generalOnboardingCompletedAt;
}

/** Sync talkAbout when saving hooks (call from forms). */
export function withSyncedTalkAbout<T extends Pick<DatingProfile, 'talkAbout' | 'conversationHooks'>>(
  partial: T
): T {
  const ask = partial.conversationHooks?.askMeAbout?.trim() ?? '';
  if (ask && !partial.talkAbout?.trim()) {
    return { ...partial, talkAbout: partial.conversationHooks!.askMeAbout };
  }
  return partial;
}

/** Normalize before Firestore write (talkAbout + hooks). Only merges hooks when provided. */
export function normalizeProfilePayload(
  data: Partial<Omit<DatingProfile, 'createdAt' | 'updatedAt'>>
): Partial<Omit<DatingProfile, 'createdAt' | 'updatedAt'>> {
  const next: Partial<Omit<DatingProfile, 'createdAt' | 'updatedAt'>> = { ...data };
  if (data.conversationHooks) {
    next.conversationHooks = { ...DEFAULT_CONVERSATION_HOOKS, ...data.conversationHooks };
  }
  const hooks = next.conversationHooks ?? { ...DEFAULT_CONVERSATION_HOOKS };
  const synced = withSyncedTalkAbout({
    talkAbout: next.talkAbout ?? '',
    conversationHooks: hooks,
  });
  return { ...next, ...synced };
}

