import { ApiQueryClientProvider } from '@/lib/query-client';
import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <ApiQueryClientProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: 'BuildMatch' }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ApiQueryClientProvider>
  );
}
