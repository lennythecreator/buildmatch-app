import ContractorJobsScreen from '@/components/contractor/contractor-jobs-screen';
import InvestorJobsScreen from '@/components/investor/investor-jobs-screen';
import { useAuthStore } from '@/store/auth';
import { ActivityIndicator, View } from 'react-native';

export default function JobsScreen() {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user.role === 'CONTRACTOR' ? <ContractorJobsScreen /> : <InvestorJobsScreen />;
}

