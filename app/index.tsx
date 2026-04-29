import { useAuthStore } from '@/store/auth';
import { Link, Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from './../components/ui/button';

export default function WelcomeScreen() {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return (
    <View className="flex-1 bg-background justify-center items-center px-6">
      <View className="flex-1 justify-center items-center w-full max-w-sm gap-8 relative z-10 p-6 rounded-3xl mt-12 mb-12">
        <View className="items-center gap-2 mb-8">
          <View className="w-20 h-20 bg-accent rounded-2xl items-center justify-center mb-4">
            <Text className="text-accent-foreground text-3xl font-bold">BM</Text>
          </View>
          <Text className="text-3xl font-bold text-foreground text-center">BuildMatch</Text>
          <Text className="text-muted text-center mt-2 leading-6">The smarter way to find contractors and manage your renovation projects.</Text>
        </View>

        <View className="w-full gap-4">
          <Link href="/(auth)/login" asChild>
            <Button variant="primary" className="w-full">
              Log In
            </Button>
          </Link>
          
          <Link href="/(auth)/register" asChild>
            <Button variant="outline" className="w-full">
              Create Account
            </Button>
          </Link>
        </View>
      </View>
    </View>
  );
}
