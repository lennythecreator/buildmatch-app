import BidCard from '@/components/bid-card';
import { Button } from '@/components/ui/button';
import { useActiveBids } from '@/hooks/use-active-bids';
import { Stack, router } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

export default function ContractorBidsScreen() {
  const { data: bids = [], isLoading, error } = useActiveBids();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
    >
      <Stack.Screen
        options={{
          title: 'My Bids',
          headerTitleAlign: 'center',
          headerBackTitle: 'Back',
          headerShadowVisible: false,
        }}
      />

      <View className="gap-2 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
        <Text selectable className="text-2xl font-extrabold tracking-tight text-foreground">
          All Bids
        </Text>
        <Text selectable className="text-sm leading-6 text-muted">
          Review every active bid you have submitted and open the project details when you need to follow up.
        </Text>
      </View>

      {isLoading ? (
        <View className="items-center justify-center gap-3 rounded-3xl bg-white px-6 py-12 shadow-sm shadow-slate-200/50">
          <ActivityIndicator />
          <Text selectable className="text-sm text-muted">
            Loading your bids...
          </Text>
        </View>
      ) : error ? (
        <View className="rounded-3xl bg-red-50 px-5 py-4">
          <Text selectable className="text-sm text-danger">
            Failed to load your bids.
          </Text>
        </View>
      ) : bids.length > 0 ? (
        <View className="gap-4">
          {bids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              viewAs="contractor"
              onPress={() => router.push({ pathname: '/job/[id]', params: { id: bid.jobId } })}
            />
          ))}
        </View>
      ) : (
        <View className="gap-4 rounded-3xl bg-white px-6 py-10 shadow-sm shadow-slate-200/50">
          <Text selectable className="text-center text-lg font-bold text-foreground">
            You have no active bids yet.
          </Text>
          <Text selectable className="text-center text-sm leading-6 text-muted">
            Find jobs that fit your trade and submit your first bid to start tracking activity here.
          </Text>
          <Button variant="primary" size="md" onPress={() => router.push('/find-jobs')}>
            Find Job
          </Button>
        </View>
      )}
    </ScrollView>
  );
}
