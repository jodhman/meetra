import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/auth-context';

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      router.replace('/(app)');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Sign up failed.';
      setError(message);
      if (Platform.OS === 'web') {
        Alert.alert('Sign up failed', message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 py-12">
            <Text className="mb-2 text-center text-2xl font-semibold text-foreground">
              Create account
            </Text>
            <Text className="mb-8 text-center text-muted-foreground">
              Sign up to get started
            </Text>

            {error ? (
              <View className="mb-4 rounded-md bg-destructive/15 p-3">
                <Text className="text-sm text-destructive">{error}</Text>
              </View>
            ) : null}

            <View className="gap-4">
              <View className="gap-2">
                <Label nativeID="email">Email</Label>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  aria-labelledby="email"
                />
              </View>
              <View className="gap-2">
                <Label nativeID="password">Password</Label>
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  aria-labelledby="password"
                />
              </View>
              <View className="gap-2">
                <Label nativeID="confirmPassword">Confirm password</Label>
                <Input
                  placeholder="••••••••"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  aria-labelledby="confirmPassword"
                />
              </View>
              <Button onPress={handleSubmit} disabled={loading} className="mt-2">
                <Text>{loading ? 'Creating account…' : 'Sign up'}</Text>
              </Button>
            </View>

            <View className="mt-8 flex-row justify-center gap-1">
              <Text className="text-muted-foreground">Already have an account?</Text>
              <Button variant="link" size="sm" onPress={() => router.push('/(auth)/login')}>
                <Text className="text-primary">Sign in</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
