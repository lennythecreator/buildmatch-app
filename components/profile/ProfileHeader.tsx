import { Card } from '@/components/ui/card';
import { User } from '@/lib/api/types';
import { Text, View } from 'react-native';

interface ProfileHeaderProps {
  user: User;
}

function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return 'U';
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const isInvestor = user?.role === 'INVESTOR';
  const roleText = isInvestor ? 'Real estate investor on BuildMatch' : 'Contractor on BuildMatch';
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <Card className="mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Text className="text-xl font-bold text-emerald-700">{initials}</Text>
          </View>
          <View className="gap-1">
            <Text className="text-xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-sm text-gray-500">{roleText}</Text>
          </View>
        </View>
        {/* <TouchableOpacity className="rounded-full bg-gray-50 p-2 border border-gray-200">
          <IconShare size={16} color="#6b7280" />
        </TouchableOpacity> */}
      </View>
    </Card>
  );
}