import ContractorCard from "@/components/contractor-card";
import { ContractorSearchBar } from "@/components/contractor-search-bar";
import { ContractorSearchFilters } from "@/components/contractor-search-filters";
import { Pagination } from "@/components/ui/pagination";
import { useContractors } from "@/hooks/useContractors";
import type { ContractorFilters } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth";
import { useContractorExploreStore, type ContractorExploreFiltersValue } from "@/store/contractor-explore";
import { Redirect, router } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INITIAL_LIMIT = 12;

function hasActiveContractorFilters(filters: ContractorExploreFiltersValue) {
  return (
    filters.searchQuery.trim().length > 0 ||
    filters.specialty !== "ALL" ||
    filters.city.trim().length > 0 ||
    filters.state.trim().length > 0 ||
    filters.ratingMin !== null ||
    filters.availableOnly
  );
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const filters = useContractorExploreStore((state) => state.filters);
  const page = useContractorExploreStore((state) => state.page);
  const isFiltersExpanded = useContractorExploreStore((state) => state.isFiltersExpanded);
  const setFilters = useContractorExploreStore((state) => state.setFilters);
  const setPage = useContractorExploreStore((state) => state.setPage);
  const setIsFiltersExpanded = useContractorExploreStore((state) => state.setIsFiltersExpanded);
  const resetFilters = useContractorExploreStore((state) => state.resetFilters);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState(filters.searchQuery);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters.searchQuery]);

  const queryFilters = useMemo<ContractorFilters>(() => {
    const normalizedSearchQuery = debouncedSearchQuery.trim();
    const normalizedCity = filters.city.trim();
    const normalizedState = filters.state.trim();

    return {
      ...(normalizedSearchQuery ? { search: normalizedSearchQuery } : {}),
      ...(filters.specialty !== "ALL" ? { specialty: filters.specialty } : {}),
      ...(normalizedCity ? { city: normalizedCity } : {}),
      ...(normalizedState ? { state: normalizedState } : {}),
      ...(filters.ratingMin !== null ? { minRating: filters.ratingMin } : {}),
      ...(filters.availableOnly ? { available: true } : {}),
      page,
      limit: INITIAL_LIMIT,
    };
  }, [debouncedSearchQuery, filters.availableOnly, filters.city, filters.ratingMin, filters.specialty, filters.state, page]);

  const { data: response, isLoading, isError, isFetching } = useContractors(queryFilters);

  const contractors = response?.contractors ?? [];
  const totalContractors = response?.total ?? 0;
  const hasActiveFilters = hasActiveContractorFilters(filters);
  const hasLoadedOnce = Boolean(response);

  function handleFiltersChange(nextFilters: ContractorExploreFiltersValue) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleFiltersReset() {
    resetFilters();
  }

  if (user?.role && user.role !== "INVESTOR") {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  if (isLoading && !hasLoadedOnce) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted font-medium">Loading contractors...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-danger font-medium text-center">
          Failed to load contractors. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Explore Contractors</Text>
      </View>

      <View className="px-4 pt-4">
        <ContractorSearchBar
          value={filters.searchQuery}
          onChangeText={(searchQuery) => handleFiltersChange({ ...filters, searchQuery })}
          onClear={() => handleFiltersChange({ ...filters, searchQuery: "" })}
        />
      </View>

      <FlatList
        data={contractors}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1, paddingTop: 16 }}
        ListHeaderComponent={
          <View className="gap-4 mb-4">
            <ContractorSearchFilters
              value={filters}
              totalContractors={totalContractors}
              isExpanded={isFiltersExpanded}
              onChange={handleFiltersChange}
              onReset={handleFiltersReset}
              onToggleExpanded={() => setIsFiltersExpanded(!isFiltersExpanded)}
            />

            {isFetching ? (
              <View className="flex-row items-center gap-2 px-1">
                <ActivityIndicator size="small" />
                <Text className="text-sm font-medium text-foreground/60">Refreshing results...</Text>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <ContractorCard
            contractor={item}
            onViewProfile={() => router.push({ pathname: "/contractor/[id]", params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Text className="text-muted font-medium text-center">
              {hasActiveFilters
                ? "No contractors match your current search."
                : "No contractors are available to browse right now."}
            </Text>
          </View>
        }
        ListFooterComponent={
          contractors.length > 0 ? (
            <Pagination
              page={response?.page ?? page}
              limit={response?.limit ?? INITIAL_LIMIT}
              total={totalContractors}
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
