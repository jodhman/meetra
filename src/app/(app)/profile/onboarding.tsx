import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, type Href } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import {
  CLUE_CLASS_OPTIONS,
  LIFESTYLE_SIGNAL_OPTIONS,
  ONBOARDING_INTEREST_OPTIONS,
  ONBOARDING_STEPS,
  SOCIAL_ENERGY_OPTIONS,
  VIBE_INTERACTION_CHIPS,
} from '@/constants/onboarding';
import { MAX_VIBE_TAGS } from '@/constants/profile-prompts';
import { useAuth } from '@/contexts/auth-context';
import {
  useProfile,
  useSetProfileMutation,
  useUploadProfilePhotoMutation,
} from '@/hooks/use-profile-query';
import {
  DEFAULT_PROFILE,
  normalizeProfilePayload,
  type DatingProfile,
} from '@/lib/firestore/profiles';
import { synthesizeVibe } from '@/lib/profile/vibe-synthesis';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];
const LOOKING_FOR_OPTIONS = ['Dating', 'Friends', 'Something casual', 'Long-term'];

export default function GeneralOnboardingScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<DatingProfile, 'createdAt' | 'updatedAt'>>(DEFAULT_PROFILE);

  const { data: profile, isLoading } = useProfile(user?.uid);
  const setProfileMutation = useSetProfileMutation(user?.uid);
  const uploadPhotoMutation = useUploadProfilePhotoMutation(user?.uid);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName,
        bio: profile.bio,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        lookingFor: profile.lookingFor,
        photos: profile.photos,
        interests: profile.interests,
        vibeTags: profile.vibeTags,
        eventIntention: profile.eventIntention,
        prompts: profile.prompts,
        talkAbout: profile.talkAbout,
        conversationHooks: { ...profile.conversationHooks },
        socialEnergy: profile.socialEnergy,
        interactionStyle: [...profile.interactionStyle],
        lifestyleSignals: [...profile.lifestyleSignals],
        aiVibeSummary: profile.aiVibeSummary,
        aiStandoutHook: profile.aiStandoutHook,
        aiSuggestedAskMe: profile.aiSuggestedAskMe,
        participationDefaults: {
          ...profile.participationDefaults,
          allowedClueTypes: [...profile.participationDefaults.allowedClueTypes],
          excludedClueTypes: [...profile.participationDefaults.excludedClueTypes],
        },
        generalOnboardingCompletedAt: profile.generalOnboardingCompletedAt,
      });
    }
  }, [profile]);

  async function persist(partial: Partial<Omit<DatingProfile, 'createdAt' | 'updatedAt'>>) {
    if (!user?.uid) return;
    const next = { ...form, ...partial };
    setForm(next);
    await setProfileMutation.mutateAsync(normalizeProfilePayload(next));
  }

  function toggleVibeChip(chipId: string) {
    const def = VIBE_INTERACTION_CHIPS.find((c) => c.id === chipId);
    if (!def) return;
    setForm((prev) => {
      const styleId = def.mapsTo.interactionStyle;
      const hasStyle = prev.interactionStyle.includes(styleId);
      let vibeTags = [...prev.vibeTags];
      const tag = def.mapsTo.vibeTag;
      if (vibeTags.includes(tag)) {
        vibeTags = vibeTags.filter((t) => t !== tag);
      } else if (vibeTags.length < MAX_VIBE_TAGS) {
        vibeTags = [...vibeTags, tag];
      }
      let interactionStyle = [...prev.interactionStyle];
      if (hasStyle) {
        interactionStyle = interactionStyle.filter((s) => s !== styleId);
      } else {
        interactionStyle = [...interactionStyle, styleId];
      }
      return { ...prev, vibeTags, interactionStyle };
    });
  }

  function chipActive(chipId: string): boolean {
    const def = VIBE_INTERACTION_CHIPS.find((c) => c.id === chipId);
    if (!def) return false;
    return form.interactionStyle.includes(def.mapsTo.interactionStyle);
  }

  async function pickImage() {
    if (!user?.uid) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to add a picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return;
    setError(null);
    const previousPhotos = form.photos;
    try {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const photoId = `${Date.now()}`;
      const url = await uploadPhotoMutation.mutateAsync({ photoId, blob });
      const nextPhotos = [...previousPhotos, { id: photoId, url }];
      setForm((prev) => ({ ...prev, photos: nextPhotos }));
      await setProfileMutation.mutateAsync(normalizeProfilePayload({ ...form, photos: nextPhotos }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Photo upload failed.');
    }
  }

  function validate(s: number): string | null {
    if (s === 1) {
      if (!form.displayName.trim()) return 'Add a display name.';
      if (!form.dateOfBirth?.trim()) return 'Add your date of birth (YYYY-MM-DD).';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth.trim())) return 'Use date format YYYY-MM-DD.';
      if (form.photos.length < 1) return 'Add at least one photo.';
      if (!form.gender.trim()) return 'Select a gender option.';
      if (!form.lookingFor.trim()) return 'Select what you are looking for.';
    }
    if (s === 2) {
      if (!form.socialEnergy.trim()) return 'Pick how you show up socially.';
      if (form.interactionStyle.length < 1 && form.vibeTags.length < 1) {
        return 'Choose at least one vibe signal.';
      }
    }
    if (s === 3) {
      const h = form.conversationHooks;
      const any =
        h.askMeAbout.trim() ||
        h.talkForeverAbout.trim() ||
        h.friendsWouldSay.trim() ||
        h.excitedWhen.trim();
      if (!any) return 'Add at least one short answer — conversation starters help at events.';
    }
    if (s === 4) {
      if (form.interests.length < 1) return 'Pick at least one interest.';
    }
    return null;
  }

  async function goNext() {
    const v = validate(step);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    try {
      await setProfileMutation.mutateAsync(normalizeProfilePayload(form));
      if (step < ONBOARDING_STEPS) setStep(step + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.');
    }
  }

  async function finish() {
    const v = validate(5);
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    if (!user?.uid) return;
    try {
      const merged = normalizeProfilePayload({
        ...form,
        generalOnboardingCompletedAt: new Date().toISOString(),
      });
      const synth = await synthesizeVibe(merged as DatingProfile);
      await setProfileMutation.mutateAsync(
        normalizeProfilePayload({
          ...merged,
          aiVibeSummary: synth.aiVibeSummary,
          aiStandoutHook: synth.aiStandoutHook,
          aiSuggestedAskMe: synth.aiSuggestedAskMe,
          talkAbout: merged.talkAbout || merged.conversationHooks?.askMeAbout || '',
        })
      );
      router.replace('/(app)/profile' as Href);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not finish setup.');
    }
  }

  function toggleInterest(i: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(i)
        ? prev.interests.filter((x) => x !== i)
        : [...prev.interests, i],
    }));
  }

  function toggleLifestyle(s: string) {
    setForm((prev) => ({
      ...prev,
      lifestyleSignals: prev.lifestyleSignals.includes(s)
        ? prev.lifestyleSignals.filter((x) => x !== s)
        : [...prev.lifestyleSignals, s],
    }));
  }

  function toggleExcludedClue(id: (typeof CLUE_CLASS_OPTIONS)[number]['id']) {
    setForm((prev) => {
      const ex = [...prev.participationDefaults.excludedClueTypes];
      const idx = ex.indexOf(id);
      if (idx >= 0) ex.splice(idx, 1);
      else ex.push(id);
      const allIds = CLUE_CLASS_OPTIONS.map((c) => c.id);
      const allowed = allIds.filter((c) => !ex.includes(c));
      return {
        ...prev,
        participationDefaults: {
          ...prev.participationDefaults,
          excludedClueTypes: ex,
          allowedClueTypes: allowed.length ? allowed : allIds,
        },
      };
    });
  }

  if (!user) return null;

  if (isLoading || profile === undefined) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Loading…</Text>
      </SafeAreaView>
    );
  }

  const progress = step / ONBOARDING_STEPS;
  const previewHook =
    form.conversationHooks.askMeAbout.trim() ||
    form.conversationHooks.talkForeverAbout.trim() ||
    form.talkAbout.trim();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled">
          <Text className="text-2xl font-semibold text-foreground">Meet your profile</Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            Fast, warm, and built for real conversations — not a résumé.
          </Text>

          <View className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <View className="h-2 rounded-full bg-primary" style={{ width: `${progress * 100}%` }} />
          </View>
          <Text className="mt-2 text-xs text-muted-foreground">
            Step {step} of {ONBOARDING_STEPS}
          </Text>

          {error ? (
            <View className="mt-4 rounded-md bg-destructive/15 p-3">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          ) : null}

          {step === 1 ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Core identity</CardTitle>
                <CardDescription>Photos and basics — the start of trust.</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="flex-row flex-wrap gap-2">
                  {form.photos.map((p) => (
                    <Image
                      key={p.id}
                      source={{ uri: p.url }}
                      className="h-20 w-20 rounded-lg bg-muted"
                      contentFit="cover"
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="h-20 w-20 rounded-lg"
                    onPress={pickImage}
                    disabled={uploadPhotoMutation.isPending}>
                    <Text className="text-2xl">+</Text>
                  </Button>
                </View>
                <View className="gap-2">
                  <Label>Display name</Label>
                  <Input
                    placeholder="How should people greet you?"
                    value={form.displayName}
                    onChangeText={(t) => setForm((p) => ({ ...p, displayName: t }))}
                  />
                </View>
                <View className="gap-2">
                  <Label>Date of birth</Label>
                  <Input
                    placeholder="YYYY-MM-DD"
                    value={form.dateOfBirth ?? ''}
                    onChangeText={(t) => setForm((p) => ({ ...p, dateOfBirth: t.trim() || null }))}
                  />
                </View>
                <View className="gap-2">
                  <Label>Gender</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {GENDER_OPTIONS.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={form.gender === opt ? 'default' : 'outline'}
                        onPress={() => setForm((p) => ({ ...p, gender: opt }))}>
                        <Text>{opt}</Text>
                      </Button>
                    ))}
                  </View>
                </View>
                <View className="gap-2">
                  <Label>Looking to connect as…</Label>
                  <Text className="text-xs text-muted-foreground">
                    General dating intent — not tied to one night. When you join an event, you can add how you want to show up then.
                  </Text>
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {LOOKING_FOR_OPTIONS.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={form.lookingFor === opt ? 'default' : 'outline'}
                        onPress={() => setForm((p) => ({ ...p, lookingFor: opt }))}>
                        <Text>{opt}</Text>
                      </Button>
                    ))}
                  </View>
                </View>
              </CardContent>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Social energy</CardTitle>
                <CardDescription>Tap what fits — we will map this to vibe tags and clues.</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label>How do you usually show up?</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {SOCIAL_ENERGY_OPTIONS.map((opt) => (
                      <Button
                        key={opt.id}
                        size="sm"
                        variant={form.socialEnergy === opt.id ? 'default' : 'outline'}
                        onPress={() => setForm((p) => ({ ...p, socialEnergy: opt.id }))}>
                        <Text className="text-xs">{opt.label}</Text>
                      </Button>
                    ))}
                  </View>
                </View>
                <View className="gap-2">
                  <Label>Vibe & interaction (tap several)</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {VIBE_INTERACTION_CHIPS.map((c) => (
                      <Button
                        key={c.id}
                        size="sm"
                        variant={chipActive(c.id) ? 'default' : 'outline'}
                        onPress={() => toggleVibeChip(c.id)}>
                        <Text className="text-xs">{c.label}</Text>
                      </Button>
                    ))}
                  </View>
                  <Text className="text-xs text-muted-foreground">
                    Selected tags: {form.vibeTags.slice(0, MAX_VIBE_TAGS).join(', ') || '—'}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Conversation engine</CardTitle>
                <CardDescription>Short answers beat long bios at events. Be specific.</CardDescription>
              </CardHeader>
              <CardContent className="gap-3">
                {(
                  [
                    ['askMeAbout', 'Ask me about…', form.conversationHooks.askMeAbout],
                    ['talkForeverAbout', 'I can talk forever about…', form.conversationHooks.talkForeverAbout],
                    ['friendsWouldSay', 'Friends would say I…', form.conversationHooks.friendsWouldSay],
                    ['excitedWhen', 'I get excited when someone brings up…', form.conversationHooks.excitedWhen],
                  ] as const
                ).map(([key, label, val]) => (
                  <View key={key} className="gap-1">
                    <Label>{label}</Label>
                    <Input
                      placeholder="One short line"
                      value={val}
                      onChangeText={(t) =>
                        setForm((p) => ({
                          ...p,
                          conversationHooks: { ...p.conversationHooks, [key]: t.slice(0, 140) },
                        }))
                      }
                      multiline
                    />
                  </View>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {step === 4 ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Interests & texture</CardTitle>
                <CardDescription>Chips first — quick signal for conversations and games.</CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="gap-2">
                  <Label>Interests</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {ONBOARDING_INTEREST_OPTIONS.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={form.interests.includes(opt) ? 'default' : 'outline'}
                        onPress={() => toggleInterest(opt)}>
                        <Text className="text-xs">{opt}</Text>
                      </Button>
                    ))}
                  </View>
                </View>
                <View className="gap-2">
                  <Label>Lifestyle & rhythm</Label>
                  <View className="flex-row flex-wrap gap-2">
                    {LIFESTYLE_SIGNAL_OPTIONS.map((opt) => (
                      <Button
                        key={opt}
                        size="sm"
                        variant={form.lifestyleSignals.includes(opt) ? 'default' : 'outline'}
                        onPress={() => toggleLifestyle(opt)}>
                        <Text className="text-xs">{opt}</Text>
                      </Button>
                    ))}
                  </View>
                </View>
              </CardContent>
            </Card>
          ) : null}

          {step === 5 ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Participation defaults</CardTitle>
                <CardDescription>
                  Durable settings for playful modes — event night can still tune these.
                </CardDescription>
              </CardHeader>
              <CardContent className="gap-4">
                <View className="flex-row items-center justify-between gap-4">
                  <Text className="flex-1 text-sm">Open to playful modes by default</Text>
                  <Button
                    size="sm"
                    variant={form.participationDefaults.openToPlayfulModes ? 'default' : 'outline'}
                    onPress={() =>
                      setForm((p) => ({
                        ...p,
                        participationDefaults: {
                          ...p.participationDefaults,
                          openToPlayfulModes: !p.participationDefaults.openToPlayfulModes,
                        },
                      }))
                    }>
                    <Text>{form.participationDefaults.openToPlayfulModes ? 'Yes' : 'No'}</Text>
                  </Button>
                </View>
                <View className="flex-row items-center justify-between gap-4">
                  <Text className="flex-1 text-sm">Okay being discoverable at events</Text>
                  <Button
                    size="sm"
                    variant={form.participationDefaults.openToDiscoverable ? 'default' : 'outline'}
                    onPress={() =>
                      setForm((p) => ({
                        ...p,
                        participationDefaults: {
                          ...p.participationDefaults,
                          openToDiscoverable: !p.participationDefaults.openToDiscoverable,
                        },
                      }))
                    }>
                    <Text>{form.participationDefaults.openToDiscoverable ? 'Yes' : 'No'}</Text>
                  </Button>
                </View>
                <View className="gap-2">
                  <Label>Clue types to skip (Mystery Match & games)</Label>
                  <Text className="text-xs text-muted-foreground">
                    We never use sensitive or physical-ID clues — this only tunes playful hint categories.
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {CLUE_CLASS_OPTIONS.map((c) => {
                      const excluded = form.participationDefaults.excludedClueTypes.includes(c.id);
                      return (
                        <Button
                          key={c.id}
                          size="sm"
                          variant={excluded ? 'destructive' : 'outline'}
                          onPress={() => toggleExcludedClue(c.id)}>
                          <Text className="text-xs">{excluded ? `Skip: ${c.label}` : c.label}</Text>
                        </Button>
                      );
                    })}
                  </View>
                </View>

                <Card className="border-dashed bg-muted/20">
                  <CardHeader>
                    <CardTitle className="text-base">Preview</CardTitle>
                    <CardDescription>How you might show up before an event (Lite).</CardDescription>
                  </CardHeader>
                  <CardContent className="gap-2">
                    {form.photos[0] ? (
                      <Image
                        source={{ uri: form.photos[0].url }}
                        className="h-24 w-24 rounded-xl bg-muted"
                        contentFit="cover"
                      />
                    ) : null}
                    <Text className="font-medium text-foreground">
                      {form.displayName.trim() || 'Your name'}
                    </Text>
                    {previewHook ? (
                      <Text className="text-foreground">&ldquo;{previewHook}&rdquo;</Text>
                    ) : (
                      <Text className="text-muted-foreground">Add a hook in step 3 to preview.</Text>
                    )}
                    {form.vibeTags.length ? (
                      <View className="mt-2 flex-row flex-wrap gap-2">
                        {form.vibeTags.slice(0, 3).map((t) => (
                          <View key={t} className="rounded-full bg-muted px-3 py-1">
                            <Text className="text-xs">{t}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : null}

          <View className="mt-8 flex-row gap-3">
            {step > 1 ? (
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => {
                  setError(null);
                  setStep((s) => Math.max(1, s - 1));
                }}>
                <Text>Back</Text>
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" onPress={() => router.back()}>
                <Text>Cancel</Text>
              </Button>
            )}
            {step < ONBOARDING_STEPS ? (
              <Button className="flex-1" onPress={goNext} disabled={setProfileMutation.isPending}>
                <Text>Next</Text>
              </Button>
            ) : (
              <Button className="flex-1" onPress={finish} disabled={setProfileMutation.isPending}>
                <Text>Finish & generate my intro</Text>
              </Button>
            )}
          </View>

          <Text className="mt-6 text-center text-xs text-muted-foreground">
            We will draft a short vibe line you can edit anytime — no fate talk, just your words reshaped.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
