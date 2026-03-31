import { useRouter, type Href } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useProfile } from '@/hooks/use-profile-query';
import { shouldPromptGeneralOnboarding } from '@/lib/firestore/profiles';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const displayName = user?.email ?? user?.displayName ?? 'there';
  const { data: profile, isLoading: profileLoading } = useProfile(user?.uid);
  const needsOnboarding =
    !profileLoading && profile !== undefined && shouldPromptGeneralOnboarding(profile);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-semibold text-foreground">Hello, {displayName}</Text>
        <Text className="mt-2 text-muted-foreground">Welcome to your dashboard.</Text>

        {needsOnboarding ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Complete your profile</CardTitle>
              <CardDescription>
                General onboarding is required before you use Meetra at events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onPress={() => router.push('/(app)/profile/onboarding' as Href)}>
                <Text>Start profile setup</Text>
              </Button>
            </CardContent>
          </Card>
        ) : null}

        <View className="mt-8 gap-4">
          <Button onPress={() => router.push('/(app)/event')}>
            <Text>Open event hub</Text>
          </Button>
          <Button onPress={() => router.push('/(app)/profile')}>
            <Text>View your profile</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
