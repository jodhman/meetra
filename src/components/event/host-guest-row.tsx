import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { DatingProfile } from '@/lib/firestore/profiles';
import { formatCompressedUid } from '@/lib/format/uid';

type Props = {
  uid: string;
  /** `undefined` while the profile query is still loading. */
  profile: DatingProfile | null | undefined;
  subtitle: string;
  rightSlot?: React.ReactNode;
};

function displayNameOrUid(profile: DatingProfile | null | undefined, uid: string): string {
  const trimmed = profile?.displayName?.trim();
  if (trimmed) return trimmed;
  return formatCompressedUid(uid);
}

function avatarInitial(profile: DatingProfile | null | undefined, uid: string): string {
  const name = profile?.displayName?.trim();
  if (name?.length) return name.slice(0, 1).toUpperCase();
  return '?';
}

function avatarPhotoUrl(profile: DatingProfile | null | undefined): string | null {
  const url = profile?.photos?.[0]?.url;
  return typeof url === 'string' && url.length > 0 ? url : null;
}

export function HostGuestRow({ uid, profile, subtitle, rightSlot }: Props) {
  const title = displayNameOrUid(profile, uid);
  const photoUrl = avatarPhotoUrl(profile);

  return (
    <View className="flex-row items-center justify-between gap-2 rounded-md border border-border p-3">
      <View className="flex-1 flex-row items-center gap-3">
        {photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            className="h-10 w-10 rounded-full bg-muted"
            contentFit="cover"
            accessibilityLabel={`${title} profile photo`}
          />
        ) : (
          <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Text className="text-sm font-semibold text-muted-foreground">{avatarInitial(profile, uid)}</Text>
          </View>
        )}
        <View className="min-w-0 flex-1">
          <Text className="font-medium text-foreground" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-sm text-muted-foreground" numberOfLines={2}>
            {subtitle}
          </Text>
        </View>
      </View>
      {rightSlot ? <View className="shrink-0">{rightSlot}</View> : null}
    </View>
  );
}
