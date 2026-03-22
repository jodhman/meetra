import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  checkInToActiveEvent,
  createEventWithHost,
  eventDetailsForLayer,
  getActiveMembership,
  getEvent,
  joinEventByInviteCode,
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
    },
  });
}

export function useCheckInMutation(uid: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (checkInCode: string) => checkInToActiveEvent(uid!, checkInCode),
    onSuccess: () => {
      if (uid) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
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

export { eventDetailsForLayer };
