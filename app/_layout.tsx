import { ApiQueryClientProvider } from '@/lib/query-client';
import { useAuthStore } from '@/store/auth';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';

void SplashScreen.preventAutoHideAsync();

function AuthBootstrap() {
  useEffect(() => {
    void useAuthStore.getState().bootstrapAuth();
  }, []);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

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
      </Stack>
    </ApiQueryClientProvider>
  );
}
