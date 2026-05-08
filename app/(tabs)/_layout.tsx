import { IconBriefcase, IconLayoutDashboard, IconMessage, IconSearch, IconUser } from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function TabLayout() {
  const { user } = useAuthStore();
  const isInvestor = user?.role === 'INVESTOR';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'hsl(210 100% 15%)', // Brand Navy
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="contractor-dashboard"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="investor-dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <IconLayoutDashboard size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <IconMessage size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: isInvestor ? undefined : null,
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <IconSearch size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'My Jobs',
          tabBarIcon: ({ color, size }) => <IconBriefcase size={size || 24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <IconUser size={size || 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
