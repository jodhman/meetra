import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useActiveEventMembership, useCheckInMutation } from '@/hooks/use-event-query';

/**
 * Check-in deep link: `meetra://checkin?code=XXXXXX`
 */
export default function CheckInFromLinkScreen() {
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();
  const { code: paramCode } = useLocalSearchParams<{ code?: string }>();
  const membershipQuery = useActiveEventMembership(uid);
  const eventId = membershipQuery.data?.eventId;
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const autoStartedRef = useRef(false);

  const checkInMutation = useCheckInMutation(uid, eventId);

  useEffect(() => {
    if (paramCode) setManualCode(String(paramCode));
  }, [paramCode]);

  useEffect(() => {
    if (!uid || !paramCode || !eventId || autoStartedRef.current) return;
    autoStartedRef.current = true;
    void (async () => {
      setError(null);
      try {
        await checkInMutation.mutateAsync(String(paramCode));
        router.replace('/(app)/event');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Check-in failed.');
        autoStartedRef.current = false;
      }
    })();
  }, [uid, paramCode, eventId, checkInMutation, router]);

  async function onCheckInManual() {
    if (!uid) return;
    setError(null);
    try {
      await checkInMutation.mutateAsync(manualCode);
      router.replace('/(app)/event');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Check-in failed.');
    }
  }

  if (!uid) {
    return null;
  }

  const showSpinner = !!paramCode && checkInMutation.isPending && !error;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-semibold text-foreground">Check in</Text>
        <Text className="mt-2 text-muted-foreground">
          {paramCode
            ? 'Checking you in from your link…'
            : 'Enter the check-in code or scan the event QR in the Scan tab.'}
        </Text>

        {!eventId ? (
          <View className="mt-4 rounded-md bg-muted p-3">
            <Text className="text-sm text-foreground">
              Join the event first (invite code), then check in with the venue code.
            </Text>
          </View>
        ) : null}

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
            placeholder="Check-in code"
            value={manualCode}
            onChangeText={setManualCode}
          />
          <Button onPress={onCheckInManual} disabled={checkInMutation.isPending || !eventId}>
            <Text>{checkInMutation.isPending ? 'Checking in…' : 'Check in'}</Text>
          </Button>
          <Button variant="outline" onPress={() => router.back()}>
            <Text>Back</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
