import JobCard from '@/components/job-card';
import { DEFAULT_JOB_SEARCH_FILTERS, JobSearchControls, type JobSearchFiltersValue } from '@/components/job-search-controls';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { useJobs } from '@/hooks/useJobs';
import type { Job as ApiJob, JobFilters } from '@/lib/api/types';
import type { Job as LocalJob } from '@/types/job';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

const PAGE_LIMIT = 12;

interface JobSearchScreenProps {
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

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

export function JobSearchScreen({
  title = 'Open Jobs',
  description = 'Browse available work and jump into a project that matches your trade.',
  emptyTitle = 'No open jobs right now.',
  emptyDescription = 'Check back later or adjust your search and filters.',
}: JobSearchScreenProps) {
  const listRef = React.useRef<FlatList<LocalJob>>(null);
  const [searchDraft, setSearchDraft] = React.useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<JobSearchFiltersValue>(DEFAULT_JOB_SEARCH_FILTERS);
  const [page, setPage] = React.useState(1);
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchDraft.trim());
      setPage(1);
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchDraft]);

  const queryFilters = React.useMemo<JobFilters>(() => {
    const normalizedCity = filters.city.trim();
    const normalizedState = filters.state.trim();
    const minBudget = filters.minBudget.trim();
    const maxBudget = filters.maxBudget.trim();

    return {
      status: 'OPEN',
      ...(debouncedSearchQuery ? { search: debouncedSearchQuery } : {}),
      ...(filters.tradeType !== 'ALL' ? { tradeType: filters.tradeType } : {}),
      ...(normalizedCity ? { city: normalizedCity } : {}),
      ...(normalizedState ? { state: normalizedState } : {}),
      ...(minBudget ? { minBudget: Number(minBudget) } : {}),
      ...(maxBudget ? { maxBudget: Number(maxBudget) } : {}),
      page,
      limit: PAGE_LIMIT,
    };
  }, [debouncedSearchQuery, filters.city, filters.maxBudget, filters.minBudget, filters.state, filters.tradeType, page]);

  const { data: response, isLoading, isError, isFetching } = useJobs(queryFilters);

  const jobs = React.useMemo(() => (response?.jobs ?? []).map(mapApiJobToLocalJob), [response]);
  const totalJobs = response?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalJobs / PAGE_LIMIT));
  const hasLoadedOnce = Boolean(response);

  const hasActiveFilters =
    debouncedSearchQuery.length > 0 ||
    filters.tradeType !== 'ALL' ||
    filters.city.trim().length > 0 ||
    filters.state.trim().length > 0 ||
    filters.minBudget.trim().length > 0 ||
    filters.maxBudget.trim().length > 0;

  function handleFiltersChange(nextFilters: JobSearchFiltersValue) {
    setFilters(nextFilters);
    setPage(1);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  function handleClearFilters() {
    setSearchDraft('');
    setDebouncedSearchQuery('');
    setFilters(DEFAULT_JOB_SEARCH_FILTERS);
    setPage(1);
    setIsFiltersExpanded(false);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  if (isLoading && !hasLoadedOnce) {
    return (
      <View className="flex-1 items-center justify-center gap-3 px-6">
        <ActivityIndicator size="large" />
        <Text className="text-sm text-muted">Loading available jobs...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-center text-danger">Failed to load available jobs.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="gap-2 px-4 pt-4">
        <Text className="text-[22px] font-extrabold tracking-tight text-foreground">{title}</Text>
        <Text className="text-sm font-medium leading-6 text-foreground/60">{description}</Text>
        <View className="flex-row items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
          <Text className="text-sm font-semibold text-foreground">
            {totalJobs > 0
              ? `${totalJobs} open job${totalJobs === 1 ? '' : 's'} match your search`
              : 'No open jobs found'}
          </Text>
          <Text className="text-xs font-medium text-foreground/50">
            {page} of {totalPages}
          </Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={jobs}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <JobSearchControls
            searchDraft={searchDraft}
            onSearchDraftChange={setSearchDraft}
            onClearSearch={() => setSearchDraft('')}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isFiltersExpanded={isFiltersExpanded}
            onToggleFilters={() => setIsFiltersExpanded((current) => !current)}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        }
        renderItem={({ item }) => <JobCard job={item} />}
        ListEmptyComponent={
          <Card className="gap-4 rounded-3xl bg-surface px-6 py-10">
            <View className="gap-2">
              <Text className="text-center text-lg font-bold text-foreground">
                {hasActiveFilters ? 'No jobs match your filters.' : emptyTitle}
              </Text>
              <Text className="text-center text-sm leading-6 text-foreground/60">
                {hasActiveFilters ? 'Try clearing filters or widening your search.' : emptyDescription}
              </Text>
            </View>

            {hasActiveFilters ? (
              <Button variant="secondary" size="md" onPress={handleClearFilters}>
                Clear filters
              </Button>
            ) : null}
          </Card>
        }
        ListFooterComponent={
          jobs.length > 0 ? (
            <Pagination
              page={response?.page ?? page}
              limit={response?.limit ?? PAGE_LIMIT}
              total={totalJobs}
              onPageChange={handlePageChange}
              isLoading={isFetching}
              className="mt-2"
            />
          ) : null
        }
      />
    </View>
  );
}