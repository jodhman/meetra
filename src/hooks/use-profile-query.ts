import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { queryKeys } from '@/lib/query-keys';
import {
  getProfile,
  normalizeProfilePayload,
  setProfile,
  type DatingProfile,
} from '@/lib/firestore/profiles';
import { synthesizeVibe } from '@/lib/profile/vibe-synthesis';
import { uploadProfilePhoto } from '@/lib/storage/profile-photos';

export function useProfile(uid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile(uid ?? ''),
    queryFn: () => getProfile(uid!),
    enabled: !!uid,
  });
}

/** Fetch multiple profiles (e.g. host roster). Keys are unique UIDs; values are undefined while loading. */
export function useProfilesForUids(uids: string[]) {
  const stableUids = useMemo(() => [...new Set(uids.filter(Boolean))].sort(), [uids.join('\x1e')]);

  const queries = useQueries({
    queries: stableUids.map((uid) => ({
      queryKey: queryKeys.profile(uid),
      queryFn: () => getProfile(uid),
      enabled: !!uid,
    })),
  });

  const profileByUid = useMemo(() => {
    const map = new Map<string, DatingProfile | null | undefined>();
    stableUids.forEach((uid, i) => {
      map.set(uid, queries[i]?.data);
    });
    return map;
  }, [stableUids, queries]);

  return { profileByUid };
}

export function useSetProfileMutation(uid: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Omit<DatingProfile, 'createdAt' | 'updatedAt'>>) =>
      setProfile(uid!, data),
    onSuccess: () => {
      if (uid) queryClient.invalidateQueries({ queryKey: queryKeys.profile(uid) });
    },
  });
}

/** Upload only — does not invalidate profile. Persist new `photos` via `setProfile` so Firestore matches Storage. */
export function useUploadProfilePhotoMutation(uid: string | undefined) {
  return useMutation({
    mutationFn: async ({ photoId, blob }: { photoId: string; blob: Blob }) =>
      uploadProfilePhoto(uid!, photoId, blob),
  });
}

/** Generates vibe summary + standout hook from current profile facts; user can edit after. */
export function useGenerateVibeMutation(uid: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: DatingProfile) => {
      const out = await synthesizeVibe(profile);
      await setProfile(
        uid!,
        normalizeProfilePayload({
          aiVibeSummary: out.aiVibeSummary,
          aiStandoutHook: out.aiStandoutHook,
          aiSuggestedAskMe: out.aiSuggestedAskMe,
        })
      );
      return out;
    },
    onSuccess: () => {
      if (uid) queryClient.invalidateQueries({ queryKey: queryKeys.profile(uid) });
    },
  });
}
