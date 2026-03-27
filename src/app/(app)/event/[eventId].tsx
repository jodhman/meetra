import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HostGuestRow } from '@/components/event/host-guest-row';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useEvent, useEventRosterForHost } from '@/hooks/use-event-query';
import { useProfilesForUids } from '@/hooks/use-profile-query';

export default function HostEventDetailScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();

  const eventQuery = useEvent(eventId);
  const rosterQuery = useEventRosterForHost(uid, eventId);

  const roster = rosterQuery.data ?? [];
  const rosterUids = useMemo(
    () => [...new Set(roster.map((r) => r.uid))].sort(),
    [rosterQuery.data]
  );
  const { profileByUid } = useProfilesForUids(rosterUids);

  const event = eventQuery.data;
  const isHost = !!event && !!uid && event.hostId === uid;

  if (!eventId || !uid) {
    return null;
  }

  if (eventQuery.isLoading || rosterQuery.isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['bottom']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-background px-6 pt-6" edges={['bottom']}>
        <Text className="text-destructive">Event not found.</Text>
        <Button className="mt-4" variant="outline" onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  if (!isHost) {
    return (
      <SafeAreaView className="flex-1 bg-background px-6 pt-6" edges={['bottom']}>
        <Text className="text-muted-foreground">Only the host can open this roster view.</Text>
        <Button className="mt-4" variant="outline" onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  if (rosterQuery.isError) {
    return (
      <SafeAreaView className="flex-1 bg-background px-6 pt-6" edges={['bottom']}>
        <Text className="text-destructive">Could not load roster.</Text>
        <Button className="mt-4" variant="outline" onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const sorted = [...roster].sort((a, b) => {
    const ra = a.removedAt?.toMillis?.() ?? 0;
    const rb = b.removedAt?.toMillis?.() ?? 0;
    return rb - ra;
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}>
        <Text className="text-2xl font-semibold text-foreground">{event.title}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Status: {event.status}
          {event.status === 'ended' ? ' · Full roster including removed guests (history).' : ''}
        </Text>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Roster</CardTitle>
            <CardDescription>
              Removed participants stay visible here for your records after the event ends.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-3">
            {sorted.length === 0 ? (
              <Text className="text-muted-foreground">No members recorded.</Text>
            ) : (
              sorted.map((row) => {
                const roleLabel = row.role === 'host' ? 'Host' : 'Guest';
                const subtitle = [
                  `${roleLabel} · ${row.memberStatus}`,
                  row.checkedInAt ? 'Checked in' : null,
                  row.removedAt ? 'Removed' : null,
                ]
                  .filter(Boolean)
                  .join(' · ');
                return (
                  <HostGuestRow
                    key={row.uid}
                    uid={row.uid}
                    profile={profileByUid.get(row.uid)}
                    subtitle={subtitle}
                  />
                );
              })
            )}
          </CardContent>
        </Card>

        <Button className="mt-6" variant="outline" onPress={() => router.back()}>
          <Text>Back</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
