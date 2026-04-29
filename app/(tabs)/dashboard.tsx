import { useAuthStore } from '@/store/auth';
import { Redirect } from 'expo-router';

export default function DashboardScreen() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href={user.role === 'INVESTOR' ? '/(tabs)/investor-dashboard' : '/(tabs)/contractor-dashboard'} />;
}
