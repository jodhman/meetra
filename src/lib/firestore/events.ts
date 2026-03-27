import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/config';

export type EventMode = 'rotations' | 'icebreakers' | 'quiz' | 'challenges';
export type EventStatus = 'draft' | 'live' | 'ended';
export type EventMembershipRole = 'host' | 'participant';
export type EventMembershipStatus = 'joined' | 'checked_in';
export type EventDetailLayer = 'invite' | 'checked_in' | 'host';

/** Roster row in `events/{eventId}/members/{uid}` — survives soft-remove for host history */
export type EventMemberStatus = 'joined' | 'checked_in' | 'removed';

export interface Event {
  title: string;
  shortBlurb: string;
  venueHint: string;
  hostId: string;
  inviteCode: string;
  checkInCode: string;
  status: EventStatus;
  activeMode: EventMode | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface EventMembership {
  eventId: string;
  role: EventMembershipRole;
  status: EventMembershipStatus;
  joinedAt: Timestamp | null;
  checkedInAt: Timestamp | null;
}

export interface EventMemberRow {
  uid: string;
  role: EventMembershipRole;
  memberStatus: EventMemberStatus;
  joinedAt: Timestamp | null;
  checkedInAt: Timestamp | null;
  removedAt: Timestamp | null;
  removedByHostId: string | null;
}

export interface CreateEventInput {
  title: string;
  shortBlurb?: string;
  venueHint?: string;
}

export type EventLayerView = {
  title: string;
  blurb: string;
  venueHint: string;
  inviteCode: string;
  status: EventStatus;
  activeMode: EventMode | null;
};

const INVITE_CODE_LENGTH = 6;
const CHECKIN_CODE_LENGTH = 6;
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function eventsCollectionRef() {
  return collection(db, 'events');
}

export function eventDocRef(eventId: string) {
  return doc(db, 'events', eventId);
}

export function membershipDocRef(uid: string) {
  return doc(db, 'eventMemberships', uid);
}

export function eventMembersCollectionRef(eventId: string) {
  return collection(db, 'events', eventId, 'members');
}

export function eventMemberDocRef(eventId: string, uid: string) {
  return doc(db, 'events', eventId, 'members', uid);
}

export function normalizeCode(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

function randomCode(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

async function generateUniqueInviteCode(): Promise<string> {
  for (let tries = 0; tries < 12; tries++) {
    const code = randomCode(INVITE_CODE_LENGTH);
    const exists = await getDocs(query(eventsCollectionRef(), where('inviteCode', '==', code)));
    if (exists.empty) return code;
  }
  throw new Error('Failed to generate a unique invite code. Please try again.');
}

export async function createEventWithHost(hostUid: string, input: CreateEventInput): Promise<string> {
  const inviteCode = await generateUniqueInviteCode();
  const checkInCode = randomCode(CHECKIN_CODE_LENGTH);
  const eventRef = doc(eventsCollectionRef());
  const memberRef = membershipDocRef(hostUid);
  const hostRosterRef = eventMemberDocRef(eventRef.id, hostUid);

  await runTransaction(db, async (tx) => {
    const existingMembership = await tx.get(memberRef);
    if (existingMembership.exists()) {
      throw new Error('You already have an active event. Leave it before creating a new one.');
    }

    tx.set(eventRef, {
      title: input.title.trim(),
      shortBlurb: input.shortBlurb?.trim() ?? '',
      venueHint: input.venueHint?.trim() ?? '',
      hostId: hostUid,
      inviteCode,
      checkInCode,
      status: 'live' satisfies EventStatus,
      activeMode: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    tx.set(memberRef, {
      eventId: eventRef.id,
      role: 'host' satisfies EventMembershipRole,
      status: 'joined' satisfies EventMembershipStatus,
      joinedAt: serverTimestamp(),
      checkedInAt: null,
    });

    tx.set(hostRosterRef, {
      role: 'host' satisfies EventMembershipRole,
      memberStatus: 'joined' satisfies EventMemberStatus,
      joinedAt: serverTimestamp(),
      checkedInAt: null,
      removedAt: null,
      removedByHostId: null,
    });
  });

  return eventRef.id;
}

export async function joinEventByInviteCode(uid: string, inputCode: string): Promise<string> {
  const inviteCode = normalizeCode(inputCode);
  if (!inviteCode) throw new Error('Enter a valid event code.');

  const found = await getDocs(query(eventsCollectionRef(), where('inviteCode', '==', inviteCode)));
  if (found.empty) throw new Error('Event code not found.');

  const eventRef = found.docs[0].ref;
  const eventId = eventRef.id;
  const memberRef = membershipDocRef(uid);
  const rosterRef = eventMemberDocRef(eventId, uid);

  await runTransaction(db, async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error('This event no longer exists.');
    const event = eventSnap.data() as Partial<Event>;
    if (event.status === 'ended') throw new Error('This event has ended.');

    const existingMembership = await tx.get(memberRef);
    if (existingMembership.exists()) {
      const currentEventId = existingMembership.data().eventId as string;
      if (currentEventId !== eventId) {
        throw new Error('You already joined another event. Multiple events come later.');
      }
      return;
    }

    tx.set(memberRef, {
      eventId,
      role: 'participant' satisfies EventMembershipRole,
      status: 'joined' satisfies EventMembershipStatus,
      joinedAt: serverTimestamp(),
      checkedInAt: null,
    });

    tx.set(rosterRef, {
      role: 'participant' satisfies EventMembershipRole,
      memberStatus: 'joined' satisfies EventMemberStatus,
      joinedAt: serverTimestamp(),
      checkedInAt: null,
      removedAt: null,
      removedByHostId: null,
    });
  });

  return eventId;
}

export async function getActiveMembership(uid: string): Promise<EventMembership | null> {
  const snap = await getDoc(membershipDocRef(uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    eventId: data.eventId ?? '',
    role: data.role ?? 'participant',
    status: data.status ?? 'joined',
    joinedAt: data.joinedAt ?? null,
    checkedInAt: data.checkedInAt ?? null,
  };
}

export async function getEvent(eventId: string): Promise<(Event & { id: string }) | null> {
  const snap = await getDoc(eventDocRef(eventId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    title: data.title ?? '',
    shortBlurb: data.shortBlurb ?? '',
    venueHint: data.venueHint ?? '',
    hostId: data.hostId ?? '',
    inviteCode: data.inviteCode ?? '',
    checkInCode: data.checkInCode ?? '',
    status: data.status ?? 'draft',
    activeMode: data.activeMode ?? null,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

export async function checkInToActiveEvent(uid: string, inputCode: string): Promise<void> {
  const checkInCode = normalizeCode(inputCode);
  if (!checkInCode) throw new Error('Enter the check-in code from the event QR.');

  const memberRef = membershipDocRef(uid);

  await runTransaction(db, async (tx) => {
    const membershipSnap = await tx.get(memberRef);
    if (!membershipSnap.exists()) throw new Error('Join an event first.');
    const membership = membershipSnap.data();
    const eventId = membership.eventId as string;
    const roster = eventMemberDocRef(eventId, uid);
    const eventRef = eventDocRef(eventId);
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error('Event not found.');
    const event = eventSnap.data() as Partial<Event>;
    if (event.checkInCode !== checkInCode) throw new Error('Incorrect check-in code.');
    tx.update(memberRef, {
      status: 'checked_in' satisfies EventMembershipStatus,
      checkedInAt: serverTimestamp(),
    });
    tx.update(roster, {
      memberStatus: 'checked_in' satisfies EventMemberStatus,
      checkedInAt: serverTimestamp(),
    });
  });
}

export async function setActiveEventMode(hostUid: string, eventId: string, mode: EventMode | null): Promise<void> {
  const eventRef = eventDocRef(eventId);
  const snap = await getDoc(eventRef);
  if (!snap.exists()) throw new Error('Event not found.');
  const event = snap.data() as Partial<Event>;
  if (event.hostId !== hostUid) throw new Error('Only the host can control event modes.');
  await updateDoc(eventRef, {
    activeMode: mode,
    updatedAt: serverTimestamp(),
  });
}

export async function endEvent(hostUid: string, eventId: string): Promise<void> {
  const eventRef = eventDocRef(eventId);
  const snap = await getDoc(eventRef);
  if (!snap.exists()) throw new Error('Event not found.');
  const event = snap.data() as Partial<Event>;
  if (event.hostId !== hostUid) throw new Error('Only the host can end the event.');
  await updateDoc(eventRef, {
    status: 'ended' satisfies EventStatus,
    activeMode: null,
    updatedAt: serverTimestamp(),
  });
}

export async function removeParticipantFromEvent(
  hostUid: string,
  eventId: string,
  participantUid: string
): Promise<void> {
  if (hostUid === participantUid) throw new Error('You cannot remove yourself.');
  const eventRef = eventDocRef(eventId);
  const rosterRef = eventMemberDocRef(eventId, participantUid);
  const participantMembershipRef = membershipDocRef(participantUid);

  await runTransaction(db, async (tx) => {
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists()) throw new Error('Event not found.');
    const ev = eventSnap.data() as Partial<Event>;
    if (ev.hostId !== hostUid) throw new Error('Only the host can remove participants.');
    if (ev.status === 'ended') throw new Error('This event has ended.');

    const rosterSnap = await tx.get(rosterRef);
    if (!rosterSnap.exists()) throw new Error('Participant not found in roster.');
    const roster = rosterSnap.data() as { role?: string };
    if (roster.role === 'host') throw new Error('Cannot remove the host.');

    tx.update(rosterRef, {
      memberStatus: 'removed' satisfies EventMemberStatus,
      removedAt: serverTimestamp(),
      removedByHostId: hostUid,
    });

    const memSnap = await tx.get(participantMembershipRef);
    if (memSnap.exists() && memSnap.data().eventId === eventId) {
      tx.delete(participantMembershipRef);
    }
  });
}

export async function listEventMembersForHost(hostUid: string, eventId: string): Promise<EventMemberRow[]> {
  const event = await getEvent(eventId);
  if (!event) throw new Error('Event not found.');
  if (event.hostId !== hostUid) throw new Error('Only the host can view the roster.');

  const snap = await getDocs(eventMembersCollectionRef(eventId));
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      uid: d.id,
      role: (data.role as EventMembershipRole) ?? 'participant',
      memberStatus: (data.memberStatus as EventMemberStatus) ?? 'joined',
      joinedAt: data.joinedAt ?? null,
      checkedInAt: data.checkedInAt ?? null,
      removedAt: data.removedAt ?? null,
      removedByHostId: data.removedByHostId ?? null,
    };
  });
}

export async function listHostEndedEvents(hostUid: string): Promise<Array<Event & { id: string }>> {
  const snap = await getDocs(query(eventsCollectionRef(), where('hostId', '==', hostUid)));
  const out: Array<Event & { id: string }> = [];
  snap.docs.forEach((d) => {
    const data = d.data();
    const status = data.status as EventStatus;
    if (status !== 'ended') return;
    out.push({
      id: d.id,
      title: data.title ?? '',
      shortBlurb: data.shortBlurb ?? '',
      venueHint: data.venueHint ?? '',
      hostId: data.hostId ?? '',
      inviteCode: data.inviteCode ?? '',
      checkInCode: data.checkInCode ?? '',
      status,
      activeMode: data.activeMode ?? null,
      createdAt: data.createdAt ?? null,
      updatedAt: data.updatedAt ?? null,
    });
  });
  out.sort((a, b) => {
    const ta = a.updatedAt?.toMillis?.() ?? 0;
    const tb = b.updatedAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return out;
}

export async function leaveActiveEvent(uid: string): Promise<void> {
  await deleteDoc(membershipDocRef(uid));
}

export function eventDetailsForLayer(event: Event, layer: EventDetailLayer): EventLayerView {
  if (layer === 'invite') {
    return {
      title: event.title,
      blurb: event.shortBlurb || 'Join in and check in on arrival to unlock event details.',
      venueHint: '',
      inviteCode: event.inviteCode,
      status: event.status,
      activeMode: null,
    };
  }

  if (layer === 'checked_in') {
    return {
      title: event.title,
      blurb: event.shortBlurb,
      venueHint: event.venueHint,
      inviteCode: event.inviteCode,
      status: event.status,
      activeMode: event.activeMode,
    };
  }

  return {
    title: event.title,
    blurb: event.shortBlurb,
    venueHint: event.venueHint,
    inviteCode: event.inviteCode,
    status: event.status,
    activeMode: event.activeMode,
  };
}
