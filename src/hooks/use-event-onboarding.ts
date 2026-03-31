import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mergeEventMemberOnboarding, type EventOnboardingState } from '@/lib/firestore/event-onboarding';
import { queryKeys } from '@/lib/query-keys';

/**
 * Writes tonight / mode-specific onboarding to the event member row.
 * Future: Mystery Match host actions + attendee exit hatch will call the same merge helper.
 */
export function useMergeEventOnboardingMutation(uid: string | undefined, eventId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<Omit<EventOnboardingState, 'updatedAt'>>) => {
      if (!uid || !eventId) throw new Error('Missing user or event.');
      return mergeEventMemberOnboarding(uid, eventId, patch);
    },
    onSuccess: () => {
      if (uid) queryClient.invalidateQueries({ queryKey: queryKeys.activeEventMembership(uid) });
    },
  });
}
