import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilterChip } from '@/components/ui/filter-chip';
import { SearchField } from '@/components/ui/search-field';
import type { JobTradeType } from '@/lib/api/types';
import { IconAdjustmentsHorizontal, IconChevronDown, IconX } from '@tabler/icons-react-native';
import React from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

export interface JobSearchFiltersValue {
  tradeType: JobTradeType | 'ALL';
  city: string;
  state: string;
  minBudget: string;
  maxBudget: string;
}

export const DEFAULT_JOB_SEARCH_FILTERS: JobSearchFiltersValue = {
  tradeType: 'ALL',
  city: '',
  state: '',
  minBudget: '',
  maxBudget: '',
};

export const JOB_SEARCH_TRADE_OPTIONS: Array<{ label: string; value: JobTradeType | 'ALL' }> = [
  { label: 'All trades', value: 'ALL' },
  { label: 'General', value: 'GENERAL' },
  { label: 'Electrical', value: 'ELECTRICAL' },
  { label: 'Plumbing', value: 'PLUMBING' },
  { label: 'HVAC', value: 'HVAC' },
  { label: 'Roofing', value: 'ROOFING' },
  { label: 'Flooring', value: 'FLOORING' },
  { label: 'Painting', value: 'PAINTING' },
  { label: 'Landscaping', value: 'LANDSCAPING' },
  { label: 'Demolition', value: 'DEMOLITION' },
  { label: 'Other', value: 'OTHER' },
];

interface JobSearchControlsProps {
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onClearSearch: () => void;
  filters: JobSearchFiltersValue;
  onFiltersChange: (nextFilters: JobSearchFiltersValue) => void;
  isFiltersExpanded: boolean;
  onToggleFilters: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function JobSearchControls({
  searchDraft,
  onSearchDraftChange,
  onClearSearch,
  filters,
  onFiltersChange,
  isFiltersExpanded,
  onToggleFilters,
  onClearFilters,
  hasActiveFilters,
}: JobSearchControlsProps) {
  return (
    <View className="gap-4">
      <Card className="gap-4 rounded-3xl bg-surface p-4">
        <View className="gap-1.5">
          <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/45">Search jobs</Text>
          <Text className="text-sm leading-6 text-foreground/60">
            Search by title, description, trade, city, or state.
          </Text>
        </View>

        <SearchField
          value={searchDraft}
          onChangeText={onSearchDraftChange}
          onClear={onClearSearch}
          placeholder="Search title, description, trade, city, or state"
          returnKeyType="search"
          autoCorrect={false}
          containerClassName="flex-row items-center gap-3 rounded-2xl bg-background px-4 py-3.5"
          iconSize={20}
        />

        <View className="flex-row items-center justify-between gap-3">
          <Button
            variant={isFiltersExpanded || hasActiveFilters ? 'outline' : 'secondary'}
            size="sm"
            onPress={onToggleFilters}
            className="flex-1"
          >
            <View className="flex-row items-center justify-center gap-2">
              <IconAdjustmentsHorizontal size={16} color="#002743" />
              <Text className="font-semibold text-foreground">Filters</Text>
              <IconChevronDown
                size={16}
                color="#002743"
                style={{ transform: [{ rotate: isFiltersExpanded ? '180deg' : '0deg' }] }}
              />
            </View>
          </Button>

          {hasActiveFilters ? (
            <Button variant="ghost" size="sm" onPress={onClearFilters}>
              <View className="flex-row items-center gap-1.5">
                <IconX size={16} color="#DC2626" />
                <Text className="font-semibold text-danger">Clear</Text>
              </View>
            </Button>
          ) : null}
        </View>
      </Card>

      {isFiltersExpanded ? (
        <Card className="gap-5 rounded-3xl bg-surface p-4">
          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/50">Trade type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {JOB_SEARCH_TRADE_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    isActive={filters.tradeType === option.value}
                    onPress={() => onFiltersChange({ ...filters, tradeType: option.value })}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/50">Location</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <TextInput
                  value={filters.city}
                  onChangeText={(city) => onFiltersChange({ ...filters, city })}
                  placeholder="City"
                  placeholderTextColor="#94A3B8"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
                />
              </View>
              <View className="w-24">
                <TextInput
                  value={filters.state}
                  onChangeText={(state) => onFiltersChange({ ...filters, state: state.toUpperCase() })}
                  placeholder="State"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  maxLength={2}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
                />
              </View>
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-[0.22em] text-foreground/50">Budget range</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <TextInput
                  value={filters.minBudget}
                  onChangeText={(minBudget) => onFiltersChange({ ...filters, minBudget })}
                  placeholder="Min budget"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
                />
              </View>
              <View className="flex-1">
                <TextInput
                  value={filters.maxBudget}
                  onChangeText={(maxBudget) => onFiltersChange({ ...filters, maxBudget })}
                  placeholder="Max budget"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground"
                />
              </View>
            </View>
          </View>
        </Card>
      ) : null}
    </View>
  );
}