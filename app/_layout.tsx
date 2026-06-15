import { ApiQueryClientProvider } from '@/lib/query-client';
import { SplashScreen as AnimatedSplash } from '@/components/splash/splash-screen';
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
import { useCallback, useEffect, useState } from 'react';
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
  const [animatedSplashDone, setAnimatedSplashDone] = useState(false);

  // Hide the native splash once fonts are ready so the animated
  // splash (rendered below as a React overlay) becomes visible.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const handleAnimatedSplashComplete = useCallback(() => {
    setAnimatedSplashDone(true);
  }, []);

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
        <Stack.Screen name="disputes/index" options={{ headerShown: false }} />
        <Stack.Screen name="disputes/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="agreements/[jobId]" options={{ title: 'Project Agreement' }} />
        <Stack.Screen name="feedback/index" options={{ title: 'Feedback' }} />
      </Stack>
      {!animatedSplashDone && (
        <AnimatedSplash onComplete={handleAnimatedSplashComplete} />
      )}
    </ApiQueryClientProvider>
  );
}
