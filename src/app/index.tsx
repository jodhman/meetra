import { Redirect } from 'expo-router';

import { useAuth } from '@/contexts/auth-context';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
