import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/use-profile-query';
import { ageFromDateOfBirth } from '@/lib/firestore/profiles';
import { profileForLayer } from '@/lib/profile-layers';
import { promptTextById } from '@/constants/profile-prompts';
import type { ProfileLayer } from '@/lib/firestore/profiles';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading, isError, refetch } = useProfile(user?.uid);
  const [activeLayer, setActiveLayer] = useState<ProfileLayer>('full');

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  if (isLoading || profile === undefined) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['bottom']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-6" edges={['bottom']}>
        <Text className="text-center text-destructive">Failed to load profile.</Text>
        <Button className="mt-4" onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const hasProfile =
    profile &&
    (profile.displayName.trim() ||
      profile.bio.trim() ||
      profile.photos.length > 0 ||
      profile.vibeTags.length > 0 ||
      profile.interests.length > 0 ||
      profile.prompts.some((p) => p.answer.trim()));
  const age = profile ? ageFromDateOfBirth(profile.dateOfBirth) : null;

  const layerProfile = useMemo(() => {
    if (!profile) return null;
    return profileForLayer(profile, activeLayer);
  }, [profile, activeLayer]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text className="text-2xl font-semibold text-foreground">Profile</Text>
        <Text className="mt-1 text-muted-foreground">{user?.email ?? 'No email'}</Text>

        {!hasProfile ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Complete your profile</CardTitle>
              <CardDescription>
                Add your details and photos so others can get to know you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onPress={() => router.push('/(app)/profile/edit')}>
                <Text>Set up profile</Text>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              {layerProfile?.photos.length ? (
                <View className="mb-3 flex-row gap-2">
                  {layerProfile.photos.slice(0, 3).map((p) => (
                    <Image
                      key={p.id}
                      source={{ uri: p.url }}
                      className="h-20 w-20 rounded-lg bg-muted"
                      contentFit="cover"
                    />
                  ))}
                </View>
              ) : null}
              <CardTitle>{profile.displayName || 'No name'}</CardTitle>
              <CardDescription>
                {age != null ? `${age} years` : ''}
                {profile.gender ? ` · ${profile.gender}` : ''}
                {profile.lookingFor ? ` · Looking for ${profile.lookingFor}` : ''}
                {layerProfile?.eventIntention ? ` · ${layerProfile.eventIntention}` : ''}
              </CardDescription>

              {layerProfile?.vibeTags.length ? (
                <View className="mt-3 flex-row flex-wrap gap-2">
                  {layerProfile.vibeTags.slice(0, 3).map((tag) => (
                    <View key={tag} className="rounded-full bg-muted px-3 py-1">
                      <Text className="text-sm text-foreground">{tag}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </CardHeader>

            <CardContent className="gap-4">
              <View className="flex-row flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={activeLayer === 'lite' ? 'default' : 'outline'}
                  onPress={() => setActiveLayer('lite')}>
                  <Text>Before (Lite)</Text>
                </Button>
                <Button
                  size="sm"
                  variant={activeLayer === 'social' ? 'default' : 'outline'}
                  onPress={() => setActiveLayer('social')}>
                  <Text>During (Social)</Text>
                </Button>
                <Button
                  size="sm"
                  variant={activeLayer === 'full' ? 'default' : 'outline'}
                  onPress={() => setActiveLayer('full')}>
                  <Text>After (Full)</Text>
                </Button>
              </View>

              {layerProfile?.prompts.length ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Conversation prompts</Text>
                  <View className="mt-3 gap-3">
                    {layerProfile.prompts.map((p) => (
                      <View key={`${p.promptId}`} className="gap-2 rounded-md border-border/50 bg-muted/20 p-3">
                        <Text className="text-sm font-medium text-foreground">{promptTextById(p.promptId) ?? 'Prompt'}</Text>
                        <Text className="text-sm text-foreground">{p.answer}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {layerProfile?.talkAbout ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Talk to me about</Text>
                  <Text className="mt-1 text-foreground">{layerProfile.talkAbout}</Text>
                </View>
              ) : null}

              {layerProfile?.interests.length ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Interests</Text>
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {layerProfile.interests.map((i) => (
                      <View key={i} className="rounded-full bg-muted px-3 py-1">
                        <Text className="text-sm text-foreground">{i}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}

              {layerProfile?.bio ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Bio</Text>
                  <Text className="mt-1 text-foreground">{layerProfile.bio}</Text>
                </View>
              ) : null}

              <Button variant="outline" onPress={() => router.push('/(app)/profile/edit')}>
                <Text>Edit profile</Text>
              </Button>
            </CardContent>
          </Card>
        )}

        <Button variant="destructive" className="mt-8" onPress={handleSignOut}>
          <Text>Sign out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
