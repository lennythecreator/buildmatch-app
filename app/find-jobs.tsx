import JobCard from '@/components/job-card';
import { Button } from '@/components/ui/button';
import { useJobs } from '@/hooks/useJobs';
import type { Job as ApiJob } from '@/lib/api/types';
import type { Job as LocalJob } from '@/types/job';
import { Stack, router } from 'expo-router';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

function mapApiJobToLocalJob(job: ApiJob): LocalJob {
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    tradeType: job.tradeType,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    city: job.city,
    state: job.state,
    zipCode: job.zipCode,
    status: job.status,
    postedById: job.postedById,
    createdAt: new Date(job.createdAt),
    updatedAt: new Date(job.updatedAt),
    bidCount: job.bidCount,
  };
}

export default function FindJobsScreen() {
  const { data: response, isLoading, error } = useJobs({ status: 'OPEN' });
  const jobs = (response?.jobs ?? []).map(mapApiJobToLocalJob);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: 'Find Jobs',
          headerTitleAlign: 'center',
          headerBackTitle: 'Back',
          headerShadowVisible: false,
        }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-3 px-6">
          <ActivityIndicator size="large" />
          <Text selectable className="text-sm text-muted">
            Loading available jobs...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text selectable className="text-center text-danger">
            Failed to load available jobs.
          </Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
          ListHeaderComponent={
            <View className="gap-2 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
              <Text selectable className="text-2xl font-extrabold tracking-tight text-foreground">
                Open Jobs
              </Text>
              <Text selectable className="text-sm leading-6 text-muted">
                Browse available work and jump into a project that matches your trade.
              </Text>
            </View>
          }
          renderItem={({ item }) => <JobCard job={item} />}
          ListEmptyComponent={
            <View className="gap-4 rounded-3xl bg-white px-6 py-10 shadow-sm shadow-slate-200/50">
              <Text selectable className="text-center text-lg font-bold text-foreground">
                No open jobs right now.
              </Text>
              <Text selectable className="text-center text-sm leading-6 text-muted">
                Check back later or refresh from the dashboard.
              </Text>
              <Button variant="secondary" size="md" onPress={() => router.back()}>
                Back
              </Button>
            </View>
          }
        />
      )}
    </View>
  );
}
