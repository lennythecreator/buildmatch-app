import type { JobStatus, JobTradeType } from "@/lib/api/types";
import { IconSearch, IconX } from "@tabler/icons-react-native";
import React from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { Card } from "./ui/card";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export interface MyJobsFiltersValue {
  searchQuery: string;
  status: JobStatus | "ALL";
  tradeType: JobTradeType | "ALL";
}

interface MyJobsFiltersProps {
  value: MyJobsFiltersValue;
  totalJobs: number;
  filteredJobs: number;
  onChange: (value: MyJobsFiltersValue) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: { label: string; value: JobStatus | "ALL" }[] = [
  { label: "All statuses", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Awarded", value: "AWARDED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const TRADE_OPTIONS: { label: string; value: JobTradeType | "ALL" }[] = [
  { label: "All trades", value: "ALL" },
  { label: "General", value: "GENERAL" },
  { label: "Electrical", value: "ELECTRICAL" },
  { label: "Plumbing", value: "PLUMBING" },
  { label: "HVAC", value: "HVAC" },
  { label: "Roofing", value: "ROOFING" },
  { label: "Flooring", value: "FLOORING" },
  { label: "Painting", value: "PAINTING" },
  { label: "Landscaping", value: "LANDSCAPING" },
  { label: "Demolition", value: "DEMOLITION" },
  { label: "Other", value: "OTHER" },
];

export const DEFAULT_MY_JOBS_FILTERS: MyJobsFiltersValue = {
  searchQuery: "",
  status: "ALL",
  tradeType: "ALL",
};

function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "rounded-full px-4 py-2.5",
        isActive ? "bg-slate-900" : "bg-slate-100",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Text
        className={[
          "text-[13px] font-bold tracking-wide",
          isActive ? "text-white" : "text-slate-600",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function MyJobsFilters({
  value,
  totalJobs,
  filteredJobs,
  onChange,
  onReset,
}: MyJobsFiltersProps) {
  const hasActiveFilters =
    value.searchQuery.trim().length > 0 ||
    value.status !== "ALL" ||
    value.tradeType !== "ALL";

  return (
    <Card className="gap-6 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
      <View className="gap-1.5">
        <Text className="text-[22px] font-extrabold tracking-tight text-slate-900">Search & filter</Text>
        <Text className="text-sm font-medium text-slate-500">
          Showing {filteredJobs} of {totalJobs} jobs
        </Text>
      </View>

      <View className="flex-row items-center gap-3 rounded-[20px] bg-slate-100 px-5 py-3.5">
        <IconSearch size={22} color="#64748B" />
        <TextInput
          value={value.searchQuery}
          onChangeText={(searchQuery) => onChange({ ...value, searchQuery })}
          placeholder="Search title, location, or description"
          placeholderTextColor="#94A3B8"
          className="flex-1 text-[15px] font-medium text-slate-900"
        />
        {value.searchQuery.length > 0 ? (
          <Pressable
            onPress={() => onChange({ ...value, searchQuery: "" })}
            className="rounded-full bg-slate-200 p-1.5"
          >
            <IconX size={16} color="#64748B" />
          </Pressable>
        ) : null}
      </View>

      <View className="gap-3">
        <Text className="uppercase tracking-widest text-[11px] font-bold text-slate-500">STATUS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {STATUS_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                isActive={value.status === option.value}
                onPress={() => onChange({ ...value, status: option.value })}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View className="gap-3">
        <Text className="uppercase tracking-widest text-[11px] font-bold text-slate-500">TRADE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {TRADE_OPTIONS.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                isActive={value.tradeType === option.value}
                onPress={() => onChange({ ...value, tradeType: option.value })}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      {hasActiveFilters ? (
        <Pressable
          onPress={onReset}
          className="mt-2 flex-row items-center justify-center gap-2 rounded-[20px] bg-red-50 px-5 py-3.5"
        >
          <IconX size={18} color="#DC2626" />
          <Text className="text-[15px] font-bold text-red-600">Clear filters</Text>
        </Pressable>
      ) : null}
    </Card>
  );
}
