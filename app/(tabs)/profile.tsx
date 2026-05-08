import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileSection } from '@/components/profile/ProfileSection';
import { QuickLinks } from '@/components/profile/QuickLinks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/store/auth';
import { IconBriefcase, IconUser, IconVideo } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { data: remoteUser, isLoading, isError, error } = useCurrentUser();
  const cachedUser = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const insets = useSafeAreaInsets();
  const user = remoteUser ?? cachedUser;
  const isAuthError = error instanceof ApiError && error.status === 401;
  const showRecoveryBanner = isError && isAuthError;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.replace('/(auth)/login');
  };

  function handleEditProfile() {
    router.push('/edit-profile');
  }

  function handleIntroVideoPress() {
    Alert.alert('Coming soon', 'Intro video support is not available yet.');
  }

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center bg-gray-50 px-6"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-medium text-gray-500">Loading your profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View
        className="flex-1 items-center justify-center bg-gray-50 px-6"
        style={{ paddingTop: insets.top }}
      >
        <Text className="text-center text-lg font-bold text-foreground">
          We could not load your profile.
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Your session may have expired. Please log in again to refresh your data.
        </Text>
        <Button
          variant="primary"
          className="mt-6 w-full"
          onPress={handleLogout}
          isLoading={logoutMutation.isPending}
        >
          Log in again
        </Button>
      </View>
    );
  }

  const hasBio = Boolean(user.bio?.trim());
  const detailLines = [user.title, user.company, user.website].filter(
    (value): value is string => Boolean(value?.trim())
  );
  const hasProfessionalDetails = detailLines.length > 0;

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ paddingTop: insets.top, padding: 16, paddingBottom: 60 }}
    >
      {showRecoveryBanner ? (
        <Card className="mb-4 rounded-2xl border border-danger/20 bg-danger/5 p-4">
          <Text className="text-base font-bold text-foreground">Session expired</Text>
          <Text className="mt-1 text-sm leading-5 text-foreground/70">
            We&apos;re showing cached profile data, but your token is no longer valid. Log in again to refresh everything.
          </Text>
          <Button
            variant="primary"
            className="mt-4"
            onPress={handleLogout}
            isLoading={logoutMutation.isPending}
          >
            Log in again
          </Button>
        </Card>
      ) : null}

      <ProfileHeader user={user} />
      
      <QuickLinks role={user.role} />

      <ProfileSection 
        title="Introduce yourself"
        description="A strong bio helps you stand out and attract better opportunities."
        buttonText={hasBio ? "Edit bio" : "+ Add a bio"}
        icon={<IconUser size={32} color="#9ca3af" />}
        onPress={handleEditProfile}
        content={
          hasBio ? (
            <Text className="text-sm leading-6 text-gray-600">{user.bio}</Text>
          ) : undefined
        }
      />

      <ProfileSection 
        title="Intro video"
        description="Introduce yourself and make a connection with potential clients."
        buttonText="+ Add intro video"
        icon={<IconVideo size={32} color="#9ca3af" />}
        onPress={handleIntroVideoPress}
      />

      <ProfileSection 
        title="Professional details"
        description="Add your title, company, and website to give insight into who you are."
        buttonText={hasProfessionalDetails ? "Edit details" : "+ Add details"}
        icon={<IconBriefcase size={32} color="#9ca3af" />}
        onPress={handleEditProfile}
        content={
          hasProfessionalDetails ? (
            <View className="gap-2">
              {detailLines.map((line) => (
                <Text key={line} className="text-sm text-gray-600">
                  {line}
                </Text>
              ))}
            </View>
          ) : undefined
        }
      />

      <View className="mt-4">
        <Button variant="danger" onPress={handleLogout}>
          <Text className="text-white font-bold">Log Out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}

