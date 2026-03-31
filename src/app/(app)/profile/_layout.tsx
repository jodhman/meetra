import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Profile' }} />
      <Stack.Screen name="onboarding" options={{ title: 'Your profile' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit profile' }} />
    </Stack>
  );
}
