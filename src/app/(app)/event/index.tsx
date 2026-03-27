import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HostGuestRow } from '@/components/event/host-guest-row';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';
import { useProfilesForUids } from '@/hooks/use-profile-query';
import {
  eventDetailsForLayer,
  useActiveEventMembership,
  useCheckInMutation,
  useCreateEventMutation,
  useEndEventMutation,
  useEvent,
  useEventRosterForHost,
  useHostEndedEvents,
  useJoinEventByCodeMutation,
  useRemoveParticipantMutation,
  useSetEventModeMutation,
} from '@/hooks/use-event-query';
import { buildCheckInUrl, buildInviteJoinUrl } from '@/lib/linking/meetra-urls';
import type { EventMode } from '@/lib/firestore/events';

const MODE_OPTIONS: Array<{ id: EventMode; label: string }> = [
  { id: 'rotations', label: '1-on-1 Rotations' },
  { id: 'icebreakers', label: 'Icebreakers' },
  { id: 'quiz', label: 'Compatibility Quiz' },
  { id: 'challenges', label: 'Social Challenges' },
];

export default function EventHubScreen() {
  const { user } = useAuth();
  const uid = user?.uid;
  const router = useRouter();

  const [createTitle, setCreateTitle] = useState('');
  const [createBlurb, setCreateBlurb] = useState('');
  const [createVenue, setCreateVenue] = useState('');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [checkInCodeInput, setCheckInCodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const membershipQuery = useActiveEventMembership(uid);
  const membership = membershipQuery.data;
  const eventQuery = useEvent(membership?.eventId);
  const event = eventQuery.data;

  const rosterQuery = useEventRosterForHost(uid, membership?.role === 'host' ? membership.eventId : undefined);
  const endedEventsQuery = useHostEndedEvents(uid);

  const liveGuestUids = useMemo(
    () =>
      (rosterQuery.data ?? [])
        .filter((r) => r.role === 'participant' && r.memberStatus !== 'removed')
        .map((r) => r.uid),
    [rosterQuery.data]
  );
  const { profileByUid } = useProfilesForUids(liveGuestUids);

  useFocusEffect(
    useCallback(() => {
      if (membership?.role === 'host' && event?.status === 'live') {
        void rosterQuery.refetch();
      }
    }, [membership?.role, event?.status, rosterQuery.refetch])
  );

  const createEventMutation = useCreateEventMutation(uid);
  const joinByCodeMutation = useJoinEventByCodeMutation(uid);
  const checkInMutation = useCheckInMutation(uid, membership?.eventId);
  const setModeMutation = useSetEventModeMutation(uid, membership?.eventId);
  const endEventMutation = useEndEventMutation(uid, membership?.eventId);
  const removeParticipantMutation = useRemoveParticipantMutation(uid, membership?.eventId);

  const loading = membershipQuery.isLoading || (membership?.eventId ? eventQuery.isLoading : false);

  const detailLayer = useMemo(() => {
    if (!membership) return 'invite' as const;
    if (membership.role === 'host') return 'host' as const;
    return membership.status === 'checked_in' ? ('checked_in' as const) : ('invite' as const);
  }, [membership]);

  const layeredEvent = useMemo(() => {
    if (!event) return null;
    return eventDetailsForLayer(event, detailLayer);
  }, [event, detailLayer]);

  const hostMetrics = useMemo(() => {
    const roster = rosterQuery.data ?? [];
    const participants = roster.filter((r) => r.role === 'participant');
    const active = participants.filter((r) => r.memberStatus !== 'removed');
    const checkedIn = active.filter((r) => r.memberStatus === 'checked_in');
    return {
      joinedActive: active.length,
      checkedIn: checkedIn.length,
      totalRecorded: participants.length,
    };
  }, [rosterQuery.data]);

  async function onCreateEvent() {
    if (!uid) return;
    if (!createTitle.trim()) {
      setError('Event title is required.');
      return;
    }
    setError(null);
    try {
      await createEventMutation.mutateAsync({
        title: createTitle,
        shortBlurb: createBlurb,
        venueHint: createVenue,
      });
      setCreateTitle('');
      setCreateBlurb('');
      setCreateVenue('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create event.');
    }
  }

  async function onJoinByCode() {
    if (!uid) return;
    setError(null);
    try {
      await joinByCodeMutation.mutateAsync(inviteCodeInput);
      setInviteCodeInput('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to join event.');
    }
  }

  async function onCheckIn() {
    if (!uid) return;
    setError(null);
    try {
      await checkInMutation.mutateAsync(checkInCodeInput);
      setCheckInCodeInput('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Check-in failed.');
    }
  }

  async function onSetMode(mode: EventMode | null) {
    setError(null);
    try {
      await setModeMutation.mutateAsync(mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update mode.');
    }
  }

  async function onShareInvite() {
    if (!event) return;
    const url = buildInviteJoinUrl(event.inviteCode);
    try {
      await Share.share({
        message: `Join ${event.title} on Meetra\n${url}`,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Share failed.');
    }
  }

  function onConfirmEndEvent() {
    Alert.alert(
      'End event',
      'Guests will see this event as ended. You can still open past roster from Past events.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End event',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              setError(null);
              try {
                await endEventMutation.mutateAsync();
              } catch (e) {
                setError(e instanceof Error ? e.message : 'Could not end event.');
              }
            })();
          },
        },
      ]
    );
  }

  function onRemoveParticipant(participantUid: string) {
    Alert.alert('Remove guest', 'They will lose access while the event is live. They remain in your past roster.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          void (async () => {
            setError(null);
            try {
              await removeParticipantMutation.mutateAsync(participantUid);
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Could not remove guest.');
            }
          })();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background" edges={['bottom']}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  const checkInQrValue = event ? buildCheckInUrl(event.checkInCode) : '';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}>
        <Text className="text-2xl font-semibold text-foreground">Event hub</Text>
        <Text className="mt-1 text-muted-foreground">
          Single-event MVP: join or host one active event at a time.
        </Text>

        <Button className="mt-4" variant="outline" onPress={() => router.push('/(app)/scan')}>
          <Text>Open QR scanner</Text>
        </Button>

        {error ? (
          <View className="mt-4 rounded-md bg-destructive/15 p-3">
            <Text className="text-sm text-destructive">{error}</Text>
          </View>
        ) : null}

        {!membership ? (
          <>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Create an event (host)</CardTitle>
                <CardDescription>
                  Start fast: create an event, then share the invite code or invite URL.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                <Input placeholder="Event title" value={createTitle} onChangeText={setCreateTitle} />
                <Input
                  placeholder="Short blurb (intrigue first)"
                  value={createBlurb}
                  onChangeText={setCreateBlurb}
                />
                <Input placeholder="Venue hint (optional)" value={createVenue} onChangeText={setCreateVenue} />
                <Button onPress={onCreateEvent} disabled={createEventMutation.isPending}>
                  <Text>{createEventMutation.isPending ? 'Creating…' : 'Create event'}</Text>
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Join with event code</CardTitle>
                <CardDescription>
                  Enter the host’s invite code or open an invite link / QR.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                <Input
                  autoCapitalize="characters"
                  placeholder="e.g. AB12CD"
                  value={inviteCodeInput}
                  onChangeText={setInviteCodeInput}
                />
                <Button onPress={onJoinByCode} disabled={joinByCodeMutation.isPending}>
                  <Text>{joinByCodeMutation.isPending ? 'Joining…' : 'Join event'}</Text>
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{layeredEvent?.title ?? 'Event'}</CardTitle>
                <CardDescription>
                  {membership.role === 'host' ? 'Host dashboard' : 'Participant dashboard'} ·{' '}
                  {membership.status === 'checked_in' ? 'Checked in' : 'Not checked in yet'}
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                {layeredEvent?.blurb ? <Text className="text-foreground">{layeredEvent.blurb}</Text> : null}
                <Text className="text-sm text-muted-foreground">Invite code: {layeredEvent?.inviteCode ?? '—'}</Text>
                {layeredEvent?.venueHint ? (
                  <Text className="text-sm text-muted-foreground">Venue hint: {layeredEvent.venueHint}</Text>
                ) : (
                  <Text className="text-sm text-muted-foreground">
                    Check in at the event QR/code to unlock more details.
                  </Text>
                )}
                {layeredEvent?.activeMode ? (
                  <Text className="text-sm text-muted-foreground">
                    Current mode: {MODE_OPTIONS.find((m) => m.id === layeredEvent.activeMode)?.label}
                  </Text>
                ) : null}
                <Text className="text-sm text-muted-foreground">
                  In-app chat is disabled during the event and unlocks only after post-event mutual match.
                </Text>
              </CardContent>
            </Card>

            {event?.status === 'ended' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Event ended</CardTitle>
                  <CardDescription>
                    {membership.role === 'host'
                      ? 'Review the full guest list (including removed) in history.'
                      : 'This event is no longer live.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="gap-3">
                  {membership.role === 'host' && event ? (
                    <Button
                      variant="outline"
                      onPress={() =>
                        router.push({ pathname: '/event/[eventId]', params: { eventId: event.id } })
                      }>
                      <Text>Open roster history</Text>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {membership.role === 'host' && event?.status === 'live' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Host · Share & check-in</CardTitle>
                  <CardDescription>Invite URL for guests; QR uses the global scanner tab.</CardDescription>
                </CardHeader>
                <CardContent className="gap-4">
                  <Button variant="outline" onPress={() => void onShareInvite()}>
                    <Text>Share invite link</Text>
                  </Button>
                  <Text className="text-xs text-muted-foreground">{buildInviteJoinUrl(event.inviteCode)}</Text>
                  <View className="items-center">
                    <Text className="mb-2 text-sm text-muted-foreground">Check-in QR (venue)</Text>
                    <View className="rounded-xl bg-white p-3">
                      <QRCode value={checkInQrValue} size={160} />
                    </View>
                    <Text className="mt-2 text-center text-xs text-muted-foreground">{checkInQrValue}</Text>
                  </View>
                </CardContent>
              </Card>
            ) : null}

            {membership.role === 'host' && event?.status === 'live' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Host · Live metrics</CardTitle>
                  <CardDescription>Active guests (not removed) vs checked in.</CardDescription>
                </CardHeader>
                <CardContent className="gap-2">
                  <Text className="text-foreground">
                    Joined (active): {hostMetrics.joinedActive} · Checked in: {hostMetrics.checkedIn}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Total guest rows (incl. removed): {hostMetrics.totalRecorded}
                  </Text>
                </CardContent>
              </Card>
            ) : null}

            {membership.role === 'host' && event?.status === 'live' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Host · Guest list</CardTitle>
                  <CardDescription>Remove someone from the live event if needed (history kept).</CardDescription>
                </CardHeader>
                <CardContent className="gap-3">
                  {rosterQuery.isLoading ? (
                    <ActivityIndicator />
                  ) : rosterQuery.isError ? (
                    <Text className="text-destructive">Could not load roster.</Text>
                  ) : (
                    (rosterQuery.data ?? [])
                      .filter((r) => r.role === 'participant' && r.memberStatus !== 'removed')
                      .map((row) => (
                        <HostGuestRow
                          key={row.uid}
                          uid={row.uid}
                          profile={profileByUid.get(row.uid)}
                          subtitle={
                            row.memberStatus === 'checked_in' ? 'Checked in' : 'Joined only'
                          }
                          rightSlot={
                            <Button size="sm" variant="destructive" onPress={() => onRemoveParticipant(row.uid)}>
                              <Text>Remove</Text>
                            </Button>
                          }
                        />
                      ))
                  )}
                  {!rosterQuery.isLoading &&
                  !rosterQuery.isError &&
                  (rosterQuery.data ?? []).filter((r) => r.role === 'participant' && r.memberStatus !== 'removed')
                    .length === 0 ? (
                    <Text className="text-muted-foreground">No guests yet.</Text>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {membership.role === 'host' && event?.status === 'live' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Host · End event</CardTitle>
                  <CardDescription>Marks the event ended and clears active mode.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onPress={onConfirmEndEvent} disabled={endEventMutation.isPending}>
                    <Text>{endEventMutation.isPending ? 'Ending…' : 'End event'}</Text>
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {membership.role === 'host' && (endedEventsQuery.data?.length ?? 0) > 0 ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Past events</CardTitle>
                  <CardDescription>Open roster history (including removed guests).</CardDescription>
                </CardHeader>
                <CardContent className="gap-2">
                  {(endedEventsQuery.data ?? []).map((ev) => (
                    <Pressable
                      key={ev.id}
                      onPress={() =>
                        router.push({ pathname: '/event/[eventId]', params: { eventId: ev.id } })
                      }
                      className="rounded-md border border-border p-3 active:opacity-80">
                      <Text className="font-medium text-foreground">{ev.title}</Text>
                      <Text className="text-sm text-muted-foreground">Ended · tap for roster</Text>
                    </Pressable>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {membership.status !== 'checked_in' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Check in (arrival)</CardTitle>
                  <CardDescription>Scan the venue QR in the Scan tab or type the check-in code.</CardDescription>
                </CardHeader>
                <CardContent className="gap-3">
                  <Input
                    autoCapitalize="characters"
                    placeholder="Check-in code from event QR"
                    value={checkInCodeInput}
                    onChangeText={setCheckInCodeInput}
                  />
                  <Button onPress={onCheckIn} disabled={checkInMutation.isPending}>
                    <Text>{checkInMutation.isPending ? 'Checking in…' : 'Check in'}</Text>
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            {membership.role === 'host' && event?.status === 'live' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Host controls</CardTitle>
                  <CardDescription>Control flow and launch game modes.</CardDescription>
                </CardHeader>
                <CardContent className="gap-3">
                  <View className="flex-row flex-wrap gap-2">
                    {MODE_OPTIONS.map((mode) => (
                      <Button
                        key={mode.id}
                        size="sm"
                        variant={event?.activeMode === mode.id ? 'default' : 'outline'}
                        onPress={() => onSetMode(mode.id)}>
                        <Text>{mode.label}</Text>
                      </Button>
                    ))}
                    <Button size="sm" variant="outline" onPress={() => onSetMode(null)}>
                      <Text>Stop mode</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
