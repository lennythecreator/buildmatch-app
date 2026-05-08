import { useCurrentUser } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function DashboardScreen() {
  const { isAuthenticated, user: storedUser, isLoading } = useAuthStore();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const user = currentUser ?? storedUser;

  if (isLoading || (isAuthenticated && !user && isUserLoading)) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={user.role === 'INVESTOR' ? '/(tabs)/investor-dashboard' : '/(tabs)/contractor-dashboard'} />;
}
