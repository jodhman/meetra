import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
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
        photoURLs: profile.photoURLs,
        interests: profile.interests,
      });
    }
  }, [profile]);

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
    try {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const photoId = `${Date.now()}`;
      const url = await uploadPhotoMutation.mutateAsync({ photoId, blob });
      setForm((prev) => ({ ...prev, photoURLs: [...prev.photoURLs, url] }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload photo.');
    }
  }

  function removePhoto(url: string) {
    setForm((prev) => ({
      ...prev,
      photoURLs: prev.photoURLs.filter((u) => u !== url),
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
                {form.photoURLs.map((url) => (
                  <View key={url} className="relative">
                    <Image
                      source={{ uri: url }}
                      className="h-20 w-20 rounded-lg bg-muted"
                      contentFit="cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                      onPress={() => removePhoto(url)}>
                      <Text className="text-xs">×</Text>
                    </Button>
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
