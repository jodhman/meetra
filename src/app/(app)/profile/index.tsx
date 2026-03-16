import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/use-profile-query';
import { ageFromDateOfBirth } from '@/lib/firestore/profiles';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading, isError, refetch } = useProfile(user?.uid);

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
      profile.photoURLs.length > 0 ||
      profile.interests.length > 0);
  const age = profile ? ageFromDateOfBirth(profile.dateOfBirth) : null;

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
              {profile.photoURLs.length > 0 ? (
                <View className="mb-3 flex-row gap-2">
                  {profile.photoURLs.slice(0, 3).map((url) => (
                    <Image
                      key={url}
                      source={{ uri: url }}
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
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              {profile.bio ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Bio</Text>
                  <Text className="mt-1 text-foreground">{profile.bio}</Text>
                </View>
              ) : null}
              {profile.interests.length > 0 ? (
                <View>
                  <Text className="text-sm font-medium text-muted-foreground">Interests</Text>
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <View
                        key={i}
                        className="rounded-full bg-muted px-3 py-1">
                        <Text className="text-sm text-foreground">{i}</Text>
                      </View>
                    ))}
                  </View>
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
