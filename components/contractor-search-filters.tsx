import type { ContractorSpecialty } from "@/lib/api/types";
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconMapPin,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react-native";
import React from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

import type { ContractorExploreFiltersValue } from "@/store/contractor-explore";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

interface FilterChipProps {
  label: React.ReactNode;
  isActive: boolean;
  onPress: () => void;
}

interface ContractorSearchFiltersProps {
  value: ContractorExploreFiltersValue;
  totalContractors: number;
  isExpanded: boolean;
  onChange: (value: ContractorExploreFiltersValue) => void;
  onReset: () => void;
  onToggleExpanded: () => void;
}

const SPECIALTY_OPTIONS: { label: string; value: ContractorSpecialty | "ALL" }[] = [
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

const RATING_OPTIONS: { label: string; value: number | null }[] = [
  { label: "All", value: null },
  { label: "4.5+", value: 4.5 },
  { label: "4.0+", value: 4 },
  { label: "3.5+", value: 3.5 },
];

function FilterChip({ label, isActive, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "rounded-full border px-4 py-2.5",
        isActive ? "border-accent bg-accent" : "border-border bg-background",
      ].join(" ")}
    >
      <View className="flex-row items-center gap-1.5">
        {typeof label === "string" ? (
          <Text
            className={[
              "text-[13px] font-semibold tracking-wide",
              isActive ? "text-accent-foreground" : "text-foreground/70",
            ].join(" ")}
          >
            {label}
          </Text>
        ) : (
          label
        )}
      </View>
    </Pressable>
  );
}

export function ContractorSearchFilters({
  value,
  totalContractors,
  isExpanded,
  onChange,
  onReset,
  onToggleExpanded,
}: ContractorSearchFiltersProps) {
  const hasActiveFilters =
    value.specialty !== "ALL" ||
    value.city.trim().length > 0 ||
    value.state.trim().length > 0 ||
    value.ratingMin !== null ||
    value.availableOnly;

  return (
    <Card className="gap-5 rounded-3xl bg-surface p-5">
      <View className="gap-1">
        <Text className="text-[22px] font-extrabold tracking-tight text-foreground">Find contractors</Text>
        <Text className="text-sm font-medium text-foreground/60">Showing {totalContractors} contractors</Text>
      </View>

      <View className="flex-row items-center justify-between gap-3">
        <Pressable
          onPress={onToggleExpanded}
          className={[
            "flex-row items-center gap-2 rounded-full border px-4 py-2.5",
            isExpanded || hasActiveFilters ? "border-accent bg-accent/10" : "border-border bg-background",
          ].join(" ")}
        >
          <IconAdjustmentsHorizontal size={18} color={isExpanded || hasActiveFilters ? "#00264d" : "#6B7280"} />
          <Text className={isExpanded || hasActiveFilters ? "font-semibold text-accent" : "font-semibold text-foreground/70"}>
            Filters
          </Text>
          <IconChevronDown
            size={18}
            color={isExpanded || hasActiveFilters ? "#00264d" : "#6B7280"}
            style={{ transform: [{ rotate: isExpanded ? "180deg" : "0deg" }] }}
          />
        </Pressable>

        {hasActiveFilters ? (
          <Pressable onPress={onReset} className="flex-row items-center gap-1.5 rounded-full px-2 py-1">
            <IconX size={16} color="#DC2626" />
            <Text className="text-sm font-semibold text-danger">Clear</Text>
          </Pressable>
        ) : null}
      </View>

      {isExpanded ? (
        <View className="gap-5 rounded-3xl border border-border bg-background p-4">
          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Trade specialty</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {SPECIALTY_OPTIONS.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    isActive={value.specialty === option.value}
                    onPress={() => onChange({ ...value, specialty: option.value })}
                  />
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Location</Text>
            <View className="flex-row items-center gap-3">
              <View className="flex-1">
                <Input
                  value={value.city}
                  onChangeText={(city) => onChange({ ...value, city })}
                  placeholder="City"
                  className="mb-0"
                  inputClassName="bg-surface"
                />
              </View>
              <View className="w-24">
                <Input
                  value={value.state}
                  onChangeText={(state) => onChange({ ...value, state: state.toUpperCase() })}
                  placeholder="State"
                  autoCapitalize="characters"
                  maxLength={2}
                  className="mb-0"
                  inputClassName="bg-surface"
                />
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <IconMapPin size={15} color="#6B7280" />
              <Text className="text-xs text-foreground/50">Use city and 2-letter state code to narrow the results.</Text>
            </View>
          </View>

          <View className="gap-3">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Minimum rating</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {RATING_OPTIONS.map((option) => {
                  const isActive = value.ratingMin === option.value;

                  return (
                    <FilterChip
                      key={option.label}
                      isActive={isActive}
                      onPress={() => onChange({ ...value, ratingMin: option.value })}
                      label={
                        <View className="flex-row items-center gap-1.5">
                          {option.value !== null ? (
                            <IconStarFilled size={14} color={isActive ? "#FFFFFF" : "#F59E0B"} />
                          ) : null}
                          <Text className={isActive ? "text-[13px] font-semibold text-accent-foreground" : "text-[13px] font-semibold text-foreground/70"}>
                            {option.label}
                          </Text>
                        </View>
                      }
                    />
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View className="flex-row items-center justify-between rounded-3xl bg-surface px-4 py-3.5">
            <View className="gap-1">
              <Text className="text-sm font-semibold text-foreground">Available only</Text>
              <Text className="text-xs text-foreground/50">Show contractors ready to take on new work.</Text>
            </View>
            <Switch
              value={value.availableOnly}
              onValueChange={(availableOnly) => onChange({ ...value, availableOnly })}
              trackColor={{ false: "#D1D5DB", true: "#16A34A" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      ) : null}
    </Card>
  );
}
