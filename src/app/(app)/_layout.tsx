import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

export default function AppLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: undefined,
        }}>
        <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarLabel: 'Dashboard' }} />
        <Tabs.Screen name="event" options={{ title: 'Event', tabBarLabel: 'Event', headerShown: false }} />
        <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarLabel: 'Scan' }} />
        <Tabs.Screen
          name="join"
          options={{
            href: null,
            title: 'Join event',
            headerShown: true,
          }}
        />
        <Tabs.Screen
          name="checkin"
          options={{
            href: null,
            title: 'Check in',
            headerShown: true,
          }}
        />
        <Tabs.Screen name="explore" options={{ title: 'Explore', tabBarLabel: 'Explore' }} />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile', tabBarLabel: 'Profile', headerShown: false }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
