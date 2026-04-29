import { Card } from '@/components/ui/card';
import { UserRoleType } from '@/lib/api/types';
import { IconBriefcase, IconPencil, IconSearch, IconTool } from '@tabler/icons-react-native';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

interface QuickLinksProps {
  role?: UserRoleType;
}

export function QuickLinks({ role }: QuickLinksProps) {
  const router = useRouter();
  const isInvestor = role === 'INVESTOR';

  const links = isInvestor
    ? [
        { title: 'Edit Profile', icon: IconPencil, onPress: () => router.push('/edit-profile') },
        { title: 'Post a Job', icon: IconTool, onPress: () => router.push('/post-job') },
        { title: 'Find Contractors', icon: IconSearch },
      ]
    : [
        { title: 'Edit Profile', icon: IconPencil, onPress: () => router.push('/edit-profile') },
        { title: 'Find Jobs', icon: IconSearch },
        { title: 'My Bids', icon: IconBriefcase },
      ];

  return (
    <Card className="mb-4">
      <Text className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Quick Links</Text>
      <View className="gap-2">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <TouchableOpacity 
              key={i} 
              className="flex-row items-center justify-between rounded-xl bg-gray-50 p-3 border border-gray-100"
              onPress={link.onPress}
            >
              <View className="flex-row items-center gap-3">
                <View className="rounded-full bg-white p-2 border border-gray-200">
                  <Icon size={20} color="#374151" />
                </View>
                <Text className="font-medium text-gray-700">{link.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
}
