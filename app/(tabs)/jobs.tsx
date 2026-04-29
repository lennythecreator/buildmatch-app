import { DEFAULT_MY_JOBS_FILTERS, MyJobsFilters } from '@/components/my-jobs-filters';
import JobCard from '@/components/job-card';
import { useMyJobs } from '@/hooks/useJobs';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function formatSearchableTradeType(tradeType: string) {
  return tradeType.replace(/_/g, ' ').toLowerCase();
}

export default function JobsScreen() {
  const insets = useSafeAreaInsets();
  const { data: response, isLoading, isError } = useMyJobs();
  const [filters, setFilters] = React.useState(DEFAULT_MY_JOBS_FILTERS);

  const jobs = React.useMemo(() => {
    return Array.isArray(response) ? response : response?.jobs || [];
  }, [response]);

  const hasActiveFilters =
    filters.searchQuery.trim().length > 0 ||
    filters.status !== 'ALL' ||
    filters.tradeType !== 'ALL';

  const filteredJobs = React.useMemo(() => {
    const normalizedQuery = filters.searchQuery.trim().toLowerCase();

    return jobs.filter((job) => {
      if (filters.status !== 'ALL' && job.status !== filters.status) {
        return false;
      }

      if (filters.tradeType !== 'ALL' && job.tradeType !== filters.tradeType) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableContent = [
        job.title,
        job.description,
        job.city,
        job.state,
        job.status,
        formatSearchableTradeType(job.tradeType),
      ]
        .join(' ')
        .toLowerCase();

      return searchableContent.includes(normalizedQuery);
    });
  }, [filters, jobs]);

  if (isLoading) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted font-medium">Loading your jobs...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-danger font-medium text-center">
          Failed to load jobs. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">My Jobs</Text>
      </View>
      
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
        ListHeaderComponent={
          <MyJobsFilters
            value={filters}
            totalJobs={jobs.length}
            filteredJobs={filteredJobs.length}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_MY_JOBS_FILTERS)}
          />
        }
        renderItem={({ item }) => <JobCard job={item} />}
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Text className="text-muted font-medium text-center">
              {hasActiveFilters
                ? 'No jobs match your current filters.'
                : "You haven't posted any jobs yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

