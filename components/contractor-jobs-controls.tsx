import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilterChip } from '@/components/ui/filter-chip';
import { SearchField } from '@/components/ui/search-field';
import { IconAdjustmentsHorizontal, IconCalendar, IconChevronDown, IconCoin, IconX } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export type ContractorJobsTab = 'PENDING' | 'AWARDED';

export type ContractorJobsDateFilter = 'ALL' | '7D' | '30D' | '90D';
export type ContractorJobsDeadlineFilter = 'ALL' | 'SOON' | 'WEEK' | 'MONTH';
export type ContractorJobsPriceFilter = 'ALL' | 'UNDER_10K' | '10K_25K' | '25K_50K' | '50K_PLUS';

export interface ContractorJobsFiltersValue {
  dateAwarded: ContractorJobsDateFilter;
  deadline: ContractorJobsDeadlineFilter;
  price: ContractorJobsPriceFilter;
}

export const DEFAULT_CONTRACTOR_JOBS_FILTERS: ContractorJobsFiltersValue = {
  dateAwarded: 'ALL',
  deadline: 'ALL',
  price: 'ALL',
};

export const CONTRACTOR_JOB_TABS: Array<{ label: string; value: ContractorJobsTab }> = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Awarded', value: 'AWARDED' },
];

const DATE_AWARDED_OPTIONS: Array<{ label: string; value: ContractorJobsDateFilter }> = [
  { label: 'All dates', value: 'ALL' },
  { label: 'Last 7 days', value: '7D' },
  { label: 'Last 30 days', value: '30D' },
  { label: 'Last 90 days', value: '90D' },
];

const DEADLINE_OPTIONS: Array<{ label: string; value: ContractorJobsDeadlineFilter }> = [
  { label: 'All deadlines', value: 'ALL' },
  { label: 'Due soon', value: 'SOON' },
  { label: 'Within 7 days', value: 'WEEK' },
  { label: 'Within 30 days', value: 'MONTH' },
];

const PRICE_OPTIONS: Array<{ label: string; value: ContractorJobsPriceFilter }> = [
  { label: 'All prices', value: 'ALL' },
  { label: 'Under $10k', value: 'UNDER_10K' },
  { label: '$10k - $25k', value: '10K_25K' },
  { label: '$25k - $50k', value: '25K_50K' },
  { label: '$50k+', value: '50K_PLUS' },
];

interface ContractorJobsControlsProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onClearSearch: () => void;
  activeTab: ContractorJobsTab;
  onTabChange: (tab: ContractorJobsTab) => void;
  tabCounts: Record<ContractorJobsTab, number>;
  filters: ContractorJobsFiltersValue;
  onFiltersChange: (nextFilters: ContractorJobsFiltersValue) => void;
  isFiltersExpanded: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

function TabButton({
  label,
  count,
  isActive,
  onPress,
}: {
  label: string;
  count: number;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        'flex-1 rounded-2xl border px-4 py-3',
        isActive ? 'border-accent bg-accent' : 'border-border bg-surface',
      ].join(' ')}
    >
      <Text className={isActive ? 'text-center text-sm font-semibold text-accent-foreground' : 'text-center text-sm font-semibold text-foreground'}>
        {label}
      </Text>
      <Text className={isActive ? 'mt-1 text-center text-xs font-medium text-accent-foreground/80' : 'mt-1 text-center text-xs font-medium text-foreground/60'}>
        {count} {count === 1 ? 'job' : 'jobs'}
      </Text>
    </Pressable>
  );
}

export function ContractorJobsControls({
  searchQuery,
  onSearchQueryChange,
  onClearSearch,
  activeTab,
  onTabChange,
  tabCounts,
  filters,
  onFiltersChange,
  isFiltersExpanded,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters,
}: ContractorJobsControlsProps) {
  return (
    <View className="gap-4">
      <Card className="gap-4 rounded-3xl bg-surface p-5">
        <View className="gap-1">
          <Text className="text-[22px] font-extrabold tracking-tight text-foreground">My Jobs</Text>
          <Text className="text-sm font-medium text-foreground/60">
            Review awarded jobs, track in-progress work, and check pending bids.
          </Text>
        </View>

        <SearchField
          value={searchQuery}
          onChangeText={onSearchQueryChange}
          onClear={onClearSearch}
          placeholder="Search my jobs"
          containerClassName="flex-row items-center gap-3 rounded-2xl bg-background px-4 py-3.5"
          iconSize={20}
        />

        <View className="flex-row gap-2">
          {CONTRACTOR_JOB_TABS.map((tab) => (
            <TabButton
              key={tab.value}
              label={tab.label}
              count={tabCounts[tab.value] ?? 0}
              isActive={activeTab === tab.value}
              onPress={() => onTabChange(tab.value)}
            />
          ))}
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Button
            variant={isFiltersExpanded || hasActiveFilters ? 'outline' : 'secondary'}
            size="sm"
            onPress={onToggleFilters}
            className="flex-1"
          >
            <View className="flex-row items-center justify-center gap-2">
              <IconAdjustmentsHorizontal size={16} color="#00264d" />
              <Text className="font-semibold text-foreground">Filters</Text>
              <IconChevronDown
                size={16}
                color="#00264d"
                style={{ transform: [{ rotate: isFiltersExpanded ? '180deg' : '0deg' }] }}
              />
            </View>
          </Button>

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onPress={onClearFilters}>
              <View className="flex-row items-center gap-1.5">
                <IconX size={16} color="#dc2626" />
                <Text className="font-semibold text-danger">Clear</Text>
              </View>
            </Button>
          ) : null}
        </View>
      </Card>

      {isFiltersExpanded ? (
        <Card className="gap-5 rounded-3xl bg-surface p-5">
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <IconCalendar size={16} color="#64748B" />
              <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Date awarded</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {DATE_AWARDED_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    isActive={filters.dateAwarded === option.value}
                    onPress={() => onFiltersChange({ ...filters, dateAwarded: option.value })}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <IconCalendar size={16} color="#64748B" />
              <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Deadline</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {DEADLINE_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    isActive={filters.deadline === option.value}
                    onPress={() => onFiltersChange({ ...filters, deadline: option.value })}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <IconCoin size={16} color="#64748B" />
              <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Price</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {PRICE_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    isActive={filters.price === option.value}
                    onPress={() => onFiltersChange({ ...filters, price: option.value })}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </View>
            </ScrollView>
          </View>
        </Card>
      ) : null}
    </View>
  );
}