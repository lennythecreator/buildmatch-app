import { ApiQueryClientProvider } from '@/lib/query-client';
import { useAuthStore } from '@/store/auth';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import '../global.css';

function AuthBootstrap() {
  useEffect(() => {
    void useAuthStore.getState().bootstrapAuth();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <ApiQueryClientProvider>
      <AuthBootstrap />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'BuildMatch' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ApiQueryClientProvider>
  );
}
