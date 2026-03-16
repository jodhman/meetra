import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/config';

export interface DatingProfile {
  displayName: string;
  bio: string;
  dateOfBirth: string | null;
  gender: string;
  lookingFor: string;
  photoURLs: string[];
  interests: string[];
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export const DEFAULT_PROFILE: Omit<DatingProfile, 'createdAt' | 'updatedAt'> = {
  displayName: '',
  bio: '',
  dateOfBirth: null,
  gender: '',
  lookingFor: '',
  photoURLs: [],
  interests: [],
};

export function profileDocRef(uid: string) {
  return doc(db, 'profiles', uid);
}

export async function getProfile(uid: string): Promise<DatingProfile | null> {
  const ref = profileDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    displayName: data.displayName ?? '',
    bio: data.bio ?? '',
    dateOfBirth: data.dateOfBirth ?? null,
    gender: data.gender ?? '',
    lookingFor: data.lookingFor ?? '',
    photoURLs: Array.isArray(data.photoURLs) ? data.photoURLs : [],
    interests: Array.isArray(data.interests) ? data.interests : [],
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
