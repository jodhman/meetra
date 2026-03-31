import { Image } from 'expo-image';
import { useRouter, type Href } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/use-profile-query';
import {
  ageFromDateOfBirth,
  primaryTalkHook,
  shouldPromptGeneralOnboarding,
  type ProfileLayer,
} from '@/lib/firestore/profiles';
import { profileForLayer } from '@/lib/profile-layers';
import { SOCIAL_ENERGY_OPTIONS } from '@/constants/onboarding';
import { promptTextById } from '@/constants/profile-prompts';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading, isError, refetch } = useProfile(user?.uid);
  const [activeLayer, setActiveLayer] = useState<ProfileLayer>('social');

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

  const needsOnboarding = shouldPromptGeneralOnboarding(profile);

  const age = profile ? ageFromDateOfBirth(profile.dateOfBirth) : null;

  const layerProfile = useMemo(() => {
    if (!profile) return null;
    return profileForLayer(profile, activeLayer);
  }, [profile, activeLayer]);

  const headerName = useMemo(() => {
    const raw = (profile?.displayName ?? '').trim();
    if (!raw) return 'No name';
    if (activeLayer === 'full') return raw;
    const first = raw.split(/\s+/)[0];
    return first || raw;
  }, [profile?.displayName, activeLayer]);

  /** Actionable opener for someone else — never the same block as “Standout line” (which uses aiStandoutHook). */
  const icebreaker = useMemo(() => {
    if (!layerProfile || !profile || activeLayer !== 'social') return null;

    const standout = layerProfile.aiStandoutHook.trim();
    const pick = (line: string | null | undefined): string | null => {
      const t = line?.trim();
      if (!t) return null;
      if (standout && t === standout) return null;
      return t;
    };

    const suggested = layerProfile.aiSuggestedAskMe.trim();
    if (suggested) {
      const formatted = /^ask me about/i.test(suggested)
        ? `Try this opener: ${suggested}`
        : `Try this opener: Ask me about ${suggested}`;
      const hit = pick(formatted);
      if (hit) return hit;
    }

    const talk = primaryTalkHook(profile).trim();
    if (talk) {
      const cleaned = talk.replace(/^ask me about\s+/i, '').replace(/^ask me\s+/i, '');
      const hit = pick(`Try this opener: Ask me about ${cleaned}`);
      if (hit) return hit;
    }

    const firstPrompt = layerProfile.prompts[0];
    if (firstPrompt) {
      const prefix = promptTextById(firstPrompt.promptId) ?? 'Prompt';
      const hit = pick(`Try this opener: ${prefix}${firstPrompt.answer}`);
      if (hit) return hit;
    }

    const firstInterest = layerProfile.interests[0];
    if (firstInterest) {
      return pick(`Try this opener: What’s your favorite ${firstInterest.toLowerCase()}?`);
    }

    return null;
  }, [activeLayer, layerProfile, profile]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
        <Text className="text-2xl font-semibold text-foreground">Profile</Text>
        <Text className="mt-1 text-muted-foreground">{user?.email ?? 'No email'}</Text>

        {needsOnboarding ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Set up your profile</CardTitle>
              <CardDescription>
                A quick, friendly flow — built for real conversations at events.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-3">
              <Button onPress={() => router.push('/(app)/profile/onboarding' as Href)}>
                <Text>Start profile setup</Text>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        {!needsOnboarding && profile ? (
          <Card className="mt-6">
            <CardHeader>
              {layerProfile?.photos.length ? (
                <View className="mb-3 flex-row gap-2">
                  {layerProfile.photos.slice(0, activeLayer === 'full' ? 6 : 3).map((p) => (
                    <Image
                      key={p.id}
                      source={{ uri: p.url }}
                      className="h-20 w-20 rounded-lg bg-muted"
                      contentFit="cover"
                    />
                  ))}
                </View>
              ) : null}
              <CardTitle>{headerName}</CardTitle>
              <CardDescription>
                {age != null ? `${age}` : ''}
                {activeLayer === 'full' && profile.gender ? ` · ${profile.gender}` : ''}
                {activeLayer === 'full' && profile.lookingFor ? ` · ${profile.lookingFor}` : ''}
                {layerProfile?.eventIntention ? ` · ${layerProfile.eventIntention}` : ''}
              </CardDescription>

              {activeLayer === 'lite' && layerProfile?.aiVibeSummary ? (
                <Text className="mt-2 text-sm italic text-muted-foreground">{layerProfile.aiVibeSummary}</Text>
              ) : null}

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

              {activeLayer === 'social' && profile.socialEnergy ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Social energy</Text>
                  <Text className="mt-1 text-foreground">
                    {SOCIAL_ENERGY_OPTIONS.find((o) => o.id === profile.socialEnergy)?.label ??
                      profile.socialEnergy}
                  </Text>
                </View>
              ) : null}

              {activeLayer === 'social' && primaryTalkHook(profile) ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Talk hook</Text>
                  <Text className="mt-1 text-foreground">{primaryTalkHook(profile)}</Text>
                </View>
              ) : null}

              {activeLayer === 'social' && layerProfile?.aiStandoutHook ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Standout line</Text>
                  <Text className="mt-1 text-foreground">{layerProfile.aiStandoutHook}</Text>
                </View>
              ) : null}

              {activeLayer === 'social' && icebreaker ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Instant icebreaker</Text>
                  <Text className="mt-1 text-foreground">{icebreaker}</Text>
                </View>
              ) : null}

              {activeLayer === 'social' ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Interaction status</Text>
                  <Text className="mt-1 text-muted-foreground">
                    Appears after QR scan / event activity (coming soon).
                  </Text>
                </View>
              ) : null}

              {layerProfile?.prompts.length ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">
                    {activeLayer === 'full' ? 'Conversation prompts' : 'More hooks'}
                  </Text>
                  <View className="mt-3 gap-3">
                    {(activeLayer === 'social' ? layerProfile.prompts.slice(0, 2) : layerProfile.prompts).map(
                      (p) => (
                        <View key={`${p.promptId}`} className="gap-2 rounded-md border-border/50 bg-muted/20 p-3">
                          <Text className="text-sm font-medium text-foreground">
                            {promptTextById(p.promptId) ?? 'Prompt'}
                          </Text>
                          <Text className="text-sm text-foreground">{p.answer}</Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              ) : null}

              {activeLayer === 'full' && profile.bio.trim() ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Bio</Text>
                  <Text className="mt-1 text-foreground">{profile.bio}</Text>
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

              {activeLayer === 'full' ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">After the event</Text>
                  <Text className="mt-1 text-muted-foreground">
                    Full gallery, recap, and likes unlock after events end (coming soon).
                  </Text>
                </View>
              ) : null}

              <Button variant="outline" onPress={() => router.push('/(app)/profile/edit')}>
                <Text>Edit profile</Text>
              </Button>
              <Button variant="ghost" onPress={() => router.push('/(app)/profile/onboarding' as Href)}>
                <Text>Re-run profile builder</Text>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <Button variant="destructive" className="mt-8" onPress={handleSignOut}>
          <Text>Sign out</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
