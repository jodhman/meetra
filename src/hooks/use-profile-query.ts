import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';
import {
  getProfile,
  setProfile,
  type DatingProfile,
} from '@/lib/firestore/profiles';
import { uploadProfilePhoto } from '@/lib/storage/profile-photos';

export function useProfile(uid: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profile(uid ?? ''),
    queryFn: () => getProfile(uid!),
    enabled: !!uid,
  });
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

export function useUploadProfilePhotoMutation(uid: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ photoId, blob }: { photoId: string; blob: Blob }) =>
      uploadProfilePhoto(uid!, photoId, blob),
    onSuccess: () => {
      if (uid) queryClient.invalidateQueries({ queryKey: queryKeys.profile(uid) });
    },
  });
}
