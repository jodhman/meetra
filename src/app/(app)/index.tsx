import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const displayName = user?.email ?? user?.displayName ?? 'there';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 px-6 py-8">
        <Text className="text-2xl font-semibold text-foreground">Hello, {displayName}</Text>
        <Text className="mt-2 text-muted-foreground">Welcome to your dashboard.</Text>
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
