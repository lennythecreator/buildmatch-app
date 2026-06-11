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
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: 'Back',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'BuildMatch', headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="job" options={{ headerShown: false }} />
        <Stack.Screen name="contractor" options={{ headerShown: false }} />
        <Stack.Screen name="post-job" options={{ title: 'Post Job' }} />
        <Stack.Screen name="post-job-manual" options={{ title: 'Post Job' }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="find-jobs" options={{ title: 'Find Jobs' }} />
        <Stack.Screen name="bids" options={{ title: 'My Bids' }} />
        <Stack.Screen name="conversation/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="disputes" options={{ headerShown: false }} />
        <Stack.Screen name="agreements/[jobId]" options={{ title: 'Project Agreement' }} />
        <Stack.Screen name="agreements/preview" options={{ title: 'Agreement Preview' }} />
      </Stack>
    </ApiQueryClientProvider>
  );
}
