import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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
import { useAuth } from '@/contexts/auth-context';
import {
    useProfile,
    useSetProfileMutation,
    useUploadProfilePhotoMutation,
} from '@/hooks/use-profile-query';
import {
  EVENT_INTENTION_OPTIONS,
  MAX_PROFILE_PROMPTS,
  MAX_VIBE_TAGS,
  PROFILE_PROMPT_CATEGORIES,
  VIBE_TAG_GROUPS,
  type ProfilePrompt,
  type ProfilePromptCategory,
  promptTextById,
} from '@/constants/profile-prompts';
import { DEFAULT_PROFILE, type DatingProfile } from '@/lib/firestore/profiles';

const GENDER_OPTIONS = ['', 'Male', 'Female', 'Non-binary', 'Other'];
const LOOKING_FOR_OPTIONS = ['', 'Dating', 'Friends', 'Something casual', 'Long-term'];
const INTEREST_OPTIONS = [
  'Music',
  'Travel',
  'Food',
  'Sports',
  'Movies',
  'Reading',
  'Art',
  'Gaming',
  'Fitness',
  'Photography',
];

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const router = useRouter();
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
      });
    }
  }, [profile]);

  const [promptBuilder, setPromptBuilder] = useState<{
    slotIndex: number | null;
    categoryId: string;
    promptId: string;
    answer: string;
  } | null>(null);

  function findPromptCategoryAndPrompt(promptId: string): { category: ProfilePromptCategory; prompt: ProfilePrompt } | null {
    for (const category of PROFILE_PROMPT_CATEGORIES) {
      const prompt = category.prompts.find((p) => p.id === promptId);
      if (prompt) return { category, prompt };
    }
    return null;
  }

  async function pickImage() {
    if (!user?.uid) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow access to your photos to add profile pictures.');
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
      try {
        await setProfileMutation.mutateAsync({ photos: nextPhotos });
      } catch (persistErr) {
        setForm((prev) => ({ ...prev, photos: previousPhotos }));
        setError(persistErr instanceof Error ? persistErr.message : 'Photo uploaded but could not save profile.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload photo.');
    }
  }

  function removePhoto(photoId: string) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== photoId),
    }));
  }

  function toggleInterest(interest: string) {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  function movePhoto(fromIndex: number, toIndex: number) {
    setForm((prev) => {
      if (toIndex < 0 || toIndex >= prev.photos.length) return prev;
      const photos = [...prev.photos];
      const [item] = photos.splice(fromIndex, 1);
      photos.splice(toIndex, 0, item);
      return { ...prev, photos };
    });
  }

  function toggleVibeTag(tag: string) {
    setForm((prev) => {
      if (prev.vibeTags.includes(tag)) {
        return { ...prev, vibeTags: prev.vibeTags.filter((t) => t !== tag) };
      }
      if (prev.vibeTags.length >= MAX_VIBE_TAGS) return prev;
      return { ...prev, vibeTags: [...prev.vibeTags, tag] };
    });
  }

  function startPromptBuilder(slotIndex: number | null) {
    if (slotIndex == null && form.prompts.length >= MAX_PROFILE_PROMPTS) return;
    const defaultCategory = PROFILE_PROMPT_CATEGORIES[0];
    setPromptBuilder({
      slotIndex,
      categoryId: defaultCategory.id,
      promptId: defaultCategory.prompts[0]?.id ?? '',
      answer: slotIndex != null ? form.prompts[slotIndex]?.answer ?? '' : '',
    });
  }

  function replacePromptForSlot(slotIndex: number) {
    const existing = form.prompts[slotIndex];
    const resolved = existing ? findPromptCategoryAndPrompt(existing.promptId) : null;
    const category = resolved?.category ?? PROFILE_PROMPT_CATEGORIES[0];
    const prompt = resolved?.prompt ?? category.prompts[0];
    setPromptBuilder({
      slotIndex,
      categoryId: category.id,
      promptId: prompt?.id ?? '',
      answer: existing?.answer ?? '',
    });
  }

  function savePromptBuilder() {
    if (!promptBuilder) return;
    if (!promptBuilder.promptId) return;
    const answer = promptBuilder.answer.trim();
    if (!answer) {
      setError('Please add an answer for your prompt.');
      return;
    }
    setError(null);

    if (promptBuilder.slotIndex == null) {
      setForm((prev) => ({
        ...prev,
        prompts: [...prev.prompts, { promptId: promptBuilder.promptId, answer }],
      }));
    } else {
      setForm((prev) => {
        const prompts = [...prev.prompts];
        prompts[promptBuilder.slotIndex!] = { promptId: promptBuilder.promptId, answer };
        return { ...prev, prompts };
      });
    }
    setPromptBuilder(null);
  }

  async function handleSave() {
    if (!user?.uid) return;
    setError(null);
    try {
      await setProfileMutation.mutateAsync(form);
      router.back();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save profile.');
    }
  }

  if (!user) {
    return null;
  }

  const saving = setProfileMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled">
          <Text className="text-2xl font-semibold text-foreground">Edit profile</Text>

          {error ? (
            <View className="mt-4 rounded-md bg-destructive/15 p-3">
              <Text className="text-sm text-destructive">{error}</Text>
            </View>
          ) : null}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Add at least one photo.</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="flex-row flex-wrap gap-2">
                {form.photos.map((p, idx) => (
                  <View key={p.id} className="relative">
                    <Image
                      source={{ uri: p.url }}
                      className="h-20 w-20 rounded-lg bg-muted"
                      contentFit="cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                      onPress={() => removePhoto(p.id)}>
                      <Text className="text-xs">×</Text>
                    </Button>
                    {idx > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -left-2 -top-2 h-6 w-6 rounded-full px-0"
                        onPress={() => movePhoto(idx, idx - 1)}>
                        <Text className="text-[10px]">^</Text>
                      </Button>
                    ) : null}
                    {idx < form.photos.length - 1 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -left-2 -bottom-2 h-6 w-6 rounded-full px-0"
                        onPress={() => movePhoto(idx, idx + 1)}>
                        <Text className="text-[10px]">v</Text>
                      </Button>
                    ) : null}
                  </View>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-20 w-20 rounded-lg"
                  onPress={pickImage}
                  disabled={uploadPhotoMutation.isPending}>
                  <Text className="text-2xl text-muted-foreground">+</Text>
                </Button>
              </View>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Basics</CardTitle>
              <CardDescription>Display name and bio.</CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              <View className="gap-2">
                <Label nativeID="displayName">Display name</Label>
                <Input
                  placeholder="Your name"
                  value={form.displayName}
                  onChangeText={(t) => setForm((p) => ({ ...p, displayName: t }))}
                  aria-labelledby="displayName"
                />
              </View>
              <View className="gap-2">
                <Label nativeID="bio">Bio</Label>
                <Input
                  placeholder="A short bio about you"
                  value={form.bio}
                  onChangeText={(t) => setForm((p) => ({ ...p, bio: t }))}
                  multiline
                  numberOfLines={3}
                  aria-labelledby="bio"
                />
              </View>
              <View className="gap-2">
                <Label nativeID="dateOfBirth">Date of birth (YYYY-MM-DD)</Label>
                <Input
                  placeholder="2000-01-15"
                  value={form.dateOfBirth ?? ''}
                  onChangeText={(t) =>
                    setForm((p) => ({ ...p, dateOfBirth: t.trim() || null }))
                  }
                  aria-labelledby="dateOfBirth"
                />
              </View>
              <View className="gap-2">
                <Label nativeID="gender">Gender</Label>
                <View className="flex-row flex-wrap gap-2">
                  {GENDER_OPTIONS.filter(Boolean).map((opt) => (
                    <Button
                      key={opt}
                      variant={form.gender === opt ? 'default' : 'outline'}
                      size="sm"
                      onPress={() => setForm((p) => ({ ...p, gender: opt }))}>
                      <Text>{opt}</Text>
                    </Button>
                  ))}
                </View>
              </View>
              <View className="gap-2">
                <Label nativeID="lookingFor">Looking for</Label>
                <View className="flex-row flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.filter(Boolean).map((opt) => (
                    <Button
                      key={opt}
                      variant={form.lookingFor === opt ? 'default' : 'outline'}
                      size="sm"
                      onPress={() => setForm((p) => ({ ...p, lookingFor: opt }))}>
                      <Text>{opt}</Text>
                    </Button>
                  ))}
                </View>
              </View>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Interests</CardTitle>
              <CardDescription>Select what you're into.</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex-row flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    variant={form.interests.includes(opt) ? 'default' : 'outline'}
                    size="sm"
                    onPress={() => toggleInterest(opt)}>
                    <Text>{opt}</Text>
                  </Button>
                ))}
              </View>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Event intention</CardTitle>
              <CardDescription>What are you here for?</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex-row flex-wrap gap-2">
                {EVENT_INTENTION_OPTIONS.map((opt) => (
                  <Button
                    key={opt}
                    variant={form.eventIntention === opt ? 'default' : 'outline'}
                    size="sm"
                    onPress={() => setForm((p) => ({ ...p, eventIntention: opt }))}>
                    <Text>{opt}</Text>
                  </Button>
                ))}
              </View>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Vibe tags</CardTitle>
              <CardDescription>Select up to {MAX_VIBE_TAGS}.</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="flex-row flex-wrap gap-2">
                {VIBE_TAG_GROUPS.flatMap((g) => g.tags).map((tag) => (
                  <Button
                    key={tag}
                    variant={form.vibeTags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onPress={() => toggleVibeTag(tag)}>
                    <Text>{tag}</Text>
                  </Button>
                ))}
              </View>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Prompts</CardTitle>
              <CardDescription>
                Add up to {MAX_PROFILE_PROMPTS}. Choose a question and answer it honestly.
              </CardDescription>
            </CardHeader>
            <CardContent className="gap-4">
              {form.prompts.length === 0 ? (
                <View>
                  <Text className="text-sm text-muted-foreground">No prompts yet.</Text>
                </View>
              ) : null}

              {form.prompts.map((p, idx) => (
                <View key={`${p.promptId}-${idx}`} className="gap-2 rounded-md border-border/50 bg-muted/20 p-3">
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="text-sm font-medium text-foreground">
                      {promptTextById(p.promptId) ?? 'Prompt'}
                    </Text>
                    <Button variant="destructive" size="sm" onPress={() => setForm((prev) => ({ ...prev, prompts: prev.prompts.filter((_, i) => i !== idx) }))}>
                      <Text>Remove</Text>
                    </Button>
                  </View>
                  <Text className="text-sm text-muted-foreground">{p.answer}</Text>
                  <Button variant="outline" size="sm" onPress={() => replacePromptForSlot(idx)}>
                    <Text>Replace</Text>
                  </Button>
                </View>
              ))}

              {form.prompts.length < MAX_PROFILE_PROMPTS ? (
                <Button variant="outline" onPress={() => startPromptBuilder(null)}>
                  <Text>Add prompt</Text>
                </Button>
              ) : null}

              {promptBuilder ? (
                <View className="gap-3 rounded-md border-border/50 bg-background p-3">
                  <View className="flex-row flex-wrap gap-2">
                    {PROFILE_PROMPT_CATEGORIES.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={promptBuilder.categoryId === cat.id ? 'default' : 'outline'}
                        size="sm"
                        onPress={() => {
                          const firstPrompt = cat.prompts[0];
                          setPromptBuilder((prev) => {
                            if (!prev) return prev;
                            return { ...prev, categoryId: cat.id, promptId: firstPrompt?.id ?? '' };
                          });
                        }}>
                        <Text>{cat.label}</Text>
                      </Button>
                    ))}
                  </View>

                  <View className="flex-row flex-wrap gap-2">
                    {(PROFILE_PROMPT_CATEGORIES.find((c) => c.id === promptBuilder.categoryId)?.prompts ?? []).map((pr) => (
                      <Button
                        key={pr.id}
                        variant={promptBuilder.promptId === pr.id ? 'default' : 'outline'}
                        size="sm"
                        onPress={() => setPromptBuilder((prev) => (prev ? { ...prev, promptId: pr.id } : prev))}>
                        <Text>{pr.text}</Text>
                      </Button>
                    ))}
                  </View>

                  <View className="gap-2">
                    <Label nativeID="promptAnswer">Your answer</Label>
                    <Input
                      nativeID="promptAnswerInput"
                      placeholder="Write a short, specific answer…"
                      value={promptBuilder.answer}
                      onChangeText={(t) => setPromptBuilder((prev) => (prev ? { ...prev, answer: t.slice(0, 250) } : prev))}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View className="flex-row gap-2">
                    <Button variant="default" className="flex-1" onPress={savePromptBuilder}>
                      <Text>Save prompt</Text>
                    </Button>
                    <Button variant="outline" className="flex-1" onPress={() => setPromptBuilder(null)}>
                      <Text>Cancel</Text>
                    </Button>
                  </View>
                </View>
              ) : null}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Talk to me about</CardTitle>
              <CardDescription>Use this as your easy conversation starter.</CardDescription>
            </CardHeader>
            <CardContent className="gap-2">
              <Input
                placeholder="Ask me about travel, music, or something we could both geek out on…"
                value={form.talkAbout}
                onChangeText={(t) => setForm((p) => ({ ...p, talkAbout: t }))}
                multiline
                numberOfLines={3}
              />
            </CardContent>
          </Card>

          <Button
            className="mt-8"
            onPress={handleSave}
            disabled={saving || isLoading}>
            <Text>{saving ? 'Saving…' : 'Save profile'}</Text>
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
