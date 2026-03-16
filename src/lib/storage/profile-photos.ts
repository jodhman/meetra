import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { storage } from '@/lib/firebase/config';

export async function uploadProfilePhoto(
  uid: string,
  photoId: string,
  blob: Blob
): Promise<string> {
  const storageRef = ref(storage, `profiles/${uid}/photos/${photoId}`);
  await uploadBytes(storageRef, blob);
  return getDownloadURL(storageRef);
}
