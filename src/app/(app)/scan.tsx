import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import {
  useActiveEventMembership,
  useCheckInMutation,
  useEvent,
  useJoinEventByCodeMutation,
} from '@/hooks/use-event-query';
import { parseMeetraPayload } from '@/lib/qr/parse-meetra-payload';

/**
 * Global QR entry: all Meetra-generated codes route through here (invite, check-in, future types).
 */
export default function GlobalScanScreen() {
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [manual, setManual] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const busyGuardRef = useRef(false);
  const lastDataRef = useRef<string | null>(null);

  const membershipQuery = useActiveEventMembership(uid);
  const eventId = membershipQuery.data?.eventId;
  const eventQuery = useEvent(eventId);
  const event = eventQuery.data;

  const joinMutation = useJoinEventByCodeMutation(uid);
  const checkInMutation = useCheckInMutation(uid, eventId);

  const handleRaw = useCallback(
    async (raw: string) => {
      if (!uid || busyGuardRef.current) return;
      busyGuardRef.current = true;
      setBusy(true);
      setError(null);
      setStatusMessage('Processing…');
      try {
        const payload = parseMeetraPayload(raw);

        if (payload.type === 'unknown') {
          throw new Error('Not a Meetra QR. Try the invite or check-in code manually below.');
        }

        if (payload.type === 'checkin') {
          await checkInMutation.mutateAsync(payload.code);
          setStatusMessage('Checked in! Opening Event hub…');
          router.replace('/(app)/event');
          return;
        }

        if (payload.type === 'invite') {
          const isAmbiguous = !!payload.ambiguous;
          const matchesCheckIn =
            !!event?.checkInCode && payload.code === event.checkInCode && !!membershipQuery.data;

          if (isAmbiguous && matchesCheckIn) {
            await checkInMutation.mutateAsync(payload.code);
            setStatusMessage('Checked in! Opening Event hub…');
            router.replace('/(app)/event');
            return;
          }

          await joinMutation.mutateAsync(payload.code);
          setStatusMessage('Joined! Opening Event hub…');
          router.replace('/(app)/event');
          return;
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
        setStatusMessage(null);
      } finally {
        busyGuardRef.current = false;
        setBusy(false);
      }
    },
    [uid, checkInMutation, joinMutation, router, event?.checkInCode, membershipQuery.data]
  );

  const onBarcodeScanned = useCallback(
    (scan: { data: string }) => {
      const data = scan.data;
      if (!data || data === lastDataRef.current) return;
      lastDataRef.current = data;
      void handleRaw(data);
      setTimeout(() => {
        lastDataRef.current = null;
      }, 2500);
    },
    [handleRaw]
  );

  async function onSubmitManual() {
    if (!manual.trim()) {
      setError('Enter a code or paste QR text.');
      return;
    }
    await handleRaw(manual.trim());
  }

  if (!uid) {
    return null;
  }

  const web = Platform.OS === 'web';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <View className="flex-1 px-6 pt-4">
        <Text className="text-2xl font-semibold text-foreground">Scan</Text>
        <Text className="mt-1 text-muted-foreground">
          Point at a Meetra QR (invite or check-in). You can also paste or type a code below.
        </Text>

        {error ? (
          <View className="mt-4 rounded-md bg-destructive/15 p-3">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : null}

        {statusMessage ? (
          <View className="mt-4 flex-row items-center gap-2">
            <ActivityIndicator />
            <Text className="text-sm text-foreground">{statusMessage}</Text>
          </View>
        ) : null}

        {!web && !permission?.granted ? (
          <View className="mt-6 gap-3">
            <Text className="text-sm text-muted-foreground">Camera access is needed to scan QR codes.</Text>
            <Button onPress={() => void requestPermission()}>
              <Text>Allow camera</Text>
            </Button>
          </View>
        ) : null}

        {!web && permission?.granted ? (
          <View className="mt-4 overflow-hidden rounded-xl bg-black" style={{ height: 280 }}>
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={onBarcodeScanned}
            />
          </View>
        ) : null}

        {web ? (
          <View className="mt-4 rounded-md bg-muted p-3">
            <Text className="text-sm text-foreground">
              QR scanning uses the device camera. On web, enter the code manually below.
            </Text>
          </View>
        ) : null}

        <View className="mt-6 gap-3">
          <Input
            autoCapitalize="characters"
            placeholder="Paste scanned text or type a code"
            value={manual}
            onChangeText={setManual}
          />
          <Button
            onPress={() => void onSubmitManual()}
            disabled={busy || joinMutation.isPending || checkInMutation.isPending}>
            <Text>Use code</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
