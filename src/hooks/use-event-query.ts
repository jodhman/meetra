import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  checkInToActiveEvent,
  createEventWithHost,
  endEvent,
  eventDetailsForLayer,
  getActiveMembership,
  getEvent,
  joinEventByInviteCode,
  listEventMembersForHost,
  listHostEndedEvents,
  removeParticipantFromEvent,
  setActiveEventMode,
  type CreateEventInput,
  type EventMode,
} from '@/lib/firestore/events';
import { queryKeys } from '@/lib/query-keys';

export function useActiveEventMembership(uid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.activeEventMembership(uid ?? ''),
    queryFn: () => getActiveMembership(uid!),
    enabled: !!uid,
  });
}

export function useEvent(eventId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.event(eventId ?? ''),
    queryFn: () => getEvent(eventId!),
    enabled: !!eventId,
  });
}

export function useCreateEventMutation(uid: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) => createEventWithHost(uid!, input),
    onSuccess: (eventId) => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) });
    },
  });
}

export function useJoinEventByCodeMutation(uid: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteCode: string) => joinEventByInviteCode(uid!, inviteCode),
    onSuccess: (eventId) => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.eventRoster(eventId) });
    },
  });
}

export function useCheckInMutation(uid: string | undefined, eventId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checkInCode: string) => checkInToActiveEvent(uid!, checkInCode),
    onSuccess: () => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
      }
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.eventRoster(eventId) });
      }
    },
  });
}

export function useSetEventModeMutation(uid: string | undefined, eventId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mode: EventMode | null) => setActiveEventMode(uid!, eventId!, mode),
    onSuccess: () => {
      if (eventId) queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) });
    },
  });
}

export function useEventRosterForHost(hostUid: string | undefined, eventId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.eventRoster(eventId ?? ''),
    queryFn: () => listEventMembersForHost(hostUid!, eventId!),
    enabled: !!hostUid && !!eventId,
  });
}

export function useHostEndedEvents(hostUid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.hostEndedEvents(hostUid ?? ''),
    queryFn: () => listHostEndedEvents(hostUid!),
    enabled: !!hostUid,
  });
}

export function useEndEventMutation(uid: string | undefined, eventId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => endEvent(uid!, eventId!),
    onSuccess: () => {
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.event(eventId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.eventRoster(eventId) });
      }
      if (uid) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
        queryClient.invalidateQueries({ queryKey: queryKeys.hostEndedEvents(uid) });
      }
    },
  });
}

export function useRemoveParticipantMutation(uid: string | undefined, eventId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (participantUid: string) => removeParticipantFromEvent(uid!, eventId!, participantUid),
    onSuccess: () => {
      if (eventId) queryClient.invalidateQueries({ queryKey: queryKeys.eventRoster(eventId) });
      if (uid) queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
    },
  });
}

export { eventDetailsForLayer };
