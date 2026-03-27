import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useJoinEventByCodeMutation } from '@/hooks/use-event-query';

/**
 * Invite deep link: `meetra://join?code=XXXXXX` (and Expo dev URLs with the same query).
 */
export default function JoinFromLinkScreen() {
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();
  const { code: paramCode } = useLocalSearchParams<{ code?: string }>();
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const autoStartedRef = useRef(false);

  const joinMutation = useJoinEventByCodeMutation(uid);

  useEffect(() => {
    if (paramCode) setManualCode(String(paramCode));
  }, [paramCode]);

  useEffect(() => {
    if (!uid || !paramCode || autoStartedRef.current) return;
    autoStartedRef.current = true;
    void (async () => {
      setError(null);
      try {
        await joinMutation.mutateAsync(String(paramCode));
        router.replace('/(app)/event');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not join this event.');
        autoStartedRef.current = false;
      }
    })();
  }, [uid, paramCode, joinMutation, router]);

  async function onJoinManual() {
    if (!uid) return;
    setError(null);
    try {
      await joinMutation.mutateAsync(manualCode);
      router.replace('/(app)/event');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not join this event.');
    }
  }

  if (!uid) {
    return null;
  }

  const showSpinner = !!paramCode && joinMutation.isPending && !error;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-semibold text-foreground">Join event</Text>
        <Text className="mt-2 text-muted-foreground">
          {paramCode
            ? 'Joining from your invite link…'
            : 'Enter the invite code from the host or scan the invite QR in the Scan tab.'}
        </Text>

        {error ? (
          <View className="mt-4 rounded-md bg-destructive/15 p-3">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : null}

        {showSpinner ? (
          <View className="mt-8 items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : null}

        <View className="mt-8 gap-3">
          <Input
            autoCapitalize="characters"
            placeholder="Invite code"
            value={manualCode}
            onChangeText={setManualCode}
          />
          <Button onPress={onJoinManual} disabled={joinMutation.isPending}>
            <Text>{joinMutation.isPending ? 'Joining…' : 'Join event'}</Text>
          </Button>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>Back</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
