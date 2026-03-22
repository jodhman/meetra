import { Stack } from 'expo-router';

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Event hub' }} />
    </Stack>
  );
}
