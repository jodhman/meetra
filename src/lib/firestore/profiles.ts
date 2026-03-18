import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
    type Timestamp,
} from 'firebase/firestore';

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

export interface DatingProfile {
  displayName: string;
  bio: string;
  dateOfBirth: string | null;
  gender: string;
  lookingFor: string;
  // Ordered photos for display (photos[0] is the main/hero photo).
  photos: ProfilePhoto[];
  interests: string[];
  // Vibe tags (Lite): max 3, fixed options.
  vibeTags: string[];
  // Event intention badge shown across layers.
  eventIntention: string;
  // Hinge-style prompt answers.
  prompts: ProfilePromptAnswer[];
  // "Talk to me about…" (Social+).
  talkAbout: string;
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
};

export function profileDocRef(uid: string) {
  return doc(db, 'profiles', uid);
}

export async function getProfile(uid: string): Promise<DatingProfile | null> {
  const ref = profileDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();

  const photoUrlsLegacy: unknown[] | null = Array.isArray(data.photoURLs) ? (data.photoURLs as unknown[]) : null;
  const photosFromNewShape: unknown[] | null = Array.isArray(data.photos) ? (data.photos as unknown[]) : null;

  const photos: ProfilePhoto[] = photosFromNewShape
    ? photosFromNewShape
        .map((p) => {
          if (!p || typeof p !== 'object') return null;
          const record = p as Record<string, unknown>;
          const id = typeof record.id === 'string' ? record.id : '';
          const url = typeof record.url === 'string' ? record.url : '';
          if (!id || !url) return null;
          return { id, url };
        })
        .filter((p): p is ProfilePhoto => !!p)
    : photoUrlsLegacy
      ? photoUrlsLegacy
          .filter((u): u is string => typeof u === 'string')
          .map((url, idx) => {
            const fromUrl = extractPhotoIdFromDownloadUrl(url, uid);
            if (fromUrl) return { id: fromUrl, url };
            return { id: `legacy_${stableHash(url)}_${idx}`, url };
          })
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
    talkAbout: typeof data.talkAbout === 'string' ? data.talkAbout : '',
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

function stableHash(input: string): string {
  // Deterministic, non-crypto hash for stable legacy photo IDs.
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function extractPhotoIdFromDownloadUrl(downloadUrl: string, uid: string): string | null {
  try {
    const decoded = decodeURIComponent(downloadUrl);
    const marker = `profiles/${uid}/photos/`;
    const idx = decoded.indexOf(marker);
    if (idx === -1) return null;
    const rest = decoded.slice(idx + marker.length);
    const match = rest.match(/^([^/?#]+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}
