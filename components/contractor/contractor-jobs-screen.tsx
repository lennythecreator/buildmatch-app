import { CONTRACTOR_JOB_TABS, ContractorJobsControls, DEFAULT_CONTRACTOR_JOBS_FILTERS, type ContractorJobsDeadlineFilter, type ContractorJobsFiltersValue, type ContractorJobsPriceFilter, type ContractorJobsTab } from '@/components/contractor/contractor-jobs-controls';
import JobCard from '@/components/job/job-card';
import { Pagination } from '@/components/ui/pagination';
import { useMyBids } from '@/hooks/useJobs';
import type { Bid, Job as ApiJob } from '@/lib/api/types';
import type { Job as LocalJob } from '@/types/job';
import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PAGE_SIZE = 5;

type ContractorJob = LocalJob & {
  awardedAt?: string;
  deadline?: string;
  dueDate?: string;
};

function mapApiJobToLocalJob(job: ApiJob): ContractorJob {
  const contractorSource = job as ApiJob & Partial<Pick<ContractorJob, 'awardedAt' | 'deadline' | 'dueDate'>>;

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
    awardedAt: contractorSource.awardedAt,
    deadline: contractorSource.deadline,
    dueDate: contractorSource.dueDate,
  };
}

function extractJobFromBidResponse(item: ApiJob | Bid): ApiJob | null {
  if ('job' in item && item.job) {
    return item.job;
  }
  if ('title' in item) {
    return item as ApiJob;
  }
  return null;
}

function formatSearchableTradeType(tradeType: string | undefined | null) {
  if (!tradeType) return '';
  return tradeType.replace(/_/g, ' ').toLowerCase();
}

function getContractorTab(job: ContractorJob): ContractorJobsTab | null {
  if (job.status === 'AWARDED') {
    return 'AWARDED';
  }

  if (job.status === 'OPEN') {
    return 'PENDING';
  }

  return null;
}

function isWithinDays(dateValue: string | Date | undefined, days: number) {
  if (!dateValue) {
    return false;
  }

  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const differenceInDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return differenceInDays <= days;
}

function matchesPriceBucket(job: ContractorJob, price: ContractorJobsPriceFilter) {
  const averageBudget = (job.budgetMin + job.budgetMax) / 2;

  switch (price) {
    case 'UNDER_10K':
      return averageBudget < 10000;
    case '10K_25K':
      return averageBudget >= 10000 && averageBudget < 25000;
    case '25K_50K':
      return averageBudget >= 25000 && averageBudget < 50000;
    case '50K_PLUS':
      return averageBudget >= 50000;
    default:
      return true;
  }
}

function matchesDeadlineBucket(job: ContractorJob, deadline: ContractorJobsDeadlineFilter) {
  const deadlineDate = job.deadline ?? job.dueDate;

  switch (deadline) {
    case 'SOON':
      return isWithinDays(deadlineDate, 14);
    case 'WEEK':
      return isWithinDays(deadlineDate, 7);
    case 'MONTH':
      return isWithinDays(deadlineDate, 30);
    default:
      return true;
  }
}

function matchesAwardedDate(job: ContractorJob, dateAwarded: string) {
  const awardedDate = job.awardedAt ?? job.updatedAt;

  switch (dateAwarded) {
    case '7D':
      return isWithinDays(awardedDate, 7);
    case '30D':
      return isWithinDays(awardedDate, 30);
    case '90D':
      return isWithinDays(awardedDate, 90);
    default:
      return true;
  }
}

function applyCommonFilters(jobs: ContractorJob[], searchQuery: string, filters: ContractorJobsFiltersValue) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return jobs.filter((job) => {
    const searchableContent = [
      job.title,
      job.description,
      job.city,
      job.state,
      job.status,
      formatSearchableTradeType(job.tradeType),
      job.bidCount ? `${job.bidCount} bids` : '',
    ]
      .join(' ')
      .toLowerCase();

    if (normalizedQuery && !searchableContent.includes(normalizedQuery)) {
      return false;
    }

    return (
      matchesAwardedDate(job, filters.dateAwarded) &&
      matchesDeadlineBucket(job, filters.deadline) &&
      matchesPriceBucket(job, filters.price)
    );
  });
}

function getTabJobs(jobs: ContractorJob[], tab: ContractorJobsTab) {
  return jobs.filter((job) => getContractorTab(job) === tab);
}

export default function ContractorJobsScreen() {
  const insets = useSafeAreaInsets();
  const { data: response, isLoading, isError, isFetching } = useMyBids();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState(DEFAULT_CONTRACTOR_JOBS_FILTERS);
  const [activeTab, setActiveTab] = React.useState<ContractorJobsTab>('AWARDED');
  const [page, setPage] = React.useState(1);
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState(false);

  const jobs = React.useMemo(() => {
    const items = Array.isArray(response)
      ? response
      : (response as { jobs?: ApiJob[] } | undefined)?.jobs ?? [];
    return items
      .map((item) => extractJobFromBidResponse(item as ApiJob & Bid))
      .filter((job): job is ApiJob => job !== null)
      .map(mapApiJobToLocalJob);
  }, [response]);

  const contractorJobs = React.useMemo(
    () => jobs.filter((job) => job.status !== 'COMPLETED'),
    [jobs]
  );

  const filteredJobs = React.useMemo(
    () => applyCommonFilters(contractorJobs, searchQuery, filters),
    [contractorJobs, filters, searchQuery]
  );

  const tabCounts = React.useMemo(() => {
    const counts = { PENDING: 0, AWARDED: 0 } as Record<ContractorJobsTab, number>;

    for (const tab of CONTRACTOR_JOB_TABS.map((item) => item.value)) {
      counts[tab] = getTabJobs(filteredJobs, tab).length;
    }

    return counts;
  }, [filteredJobs]);

  const activeJobs = React.useMemo(() => getTabJobs(filteredJobs, activeTab), [activeTab, filteredJobs]);

  const totalPages = Math.max(1, Math.ceil(activeJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return activeJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [activeJobs, currentPage]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    filters.dateAwarded !== 'ALL' ||
    filters.deadline !== 'ALL' ||
    filters.price !== 'ALL';

  React.useEffect(() => {
    setPage(1);
  }, [activeTab, filters, searchQuery]);

  if (isLoading) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-medium text-muted">Loading your jobs...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center font-medium text-danger">Failed to load jobs. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <FlatList
        data={paginatedJobs}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1, paddingBottom: 40 }}
        ListHeaderComponent={
          <ContractorJobsControls
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onClearSearch={() => setSearchQuery('')}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabCounts={tabCounts}
            filters={filters}
            onFiltersChange={setFilters}
            isFiltersExpanded={isFiltersExpanded}
            onToggleFilters={() => setIsFiltersExpanded((current) => !current)}
            onClearFilters={() => {
              setFilters(DEFAULT_CONTRACTOR_JOBS_FILTERS);
              setIsFiltersExpanded(false);
            }}
            hasActiveFilters={hasActiveFilters}
          />
        }
        renderItem={({ item }) => <JobCard job={item} />}
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Text className="text-center font-medium text-muted">
              {hasActiveFilters ? 'No jobs match your current search.' : 'No jobs are available right now.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          activeJobs.length > PAGE_SIZE ? (
            <Pagination
              page={currentPage}
              limit={PAGE_SIZE}
              total={activeJobs.length}
              onPageChange={setPage}
              isLoading={isFetching}
              className="mt-2"
            />
          ) : null
        }
      />
    </View>
  );
}