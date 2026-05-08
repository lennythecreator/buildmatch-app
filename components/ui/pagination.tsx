import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react-native";
import React from "react";
import { Text, View, type ViewProps } from "react-native";

import { Button } from "./button";

export interface PaginationProps extends ViewProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({
  page,
  limit,
  total,
  onPageChange,
  isLoading = false,
  className = "",
  ...props
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (totalPages <= 1) {
    return null;
  }

  const isPreviousDisabled = isLoading || page <= 1;
  const isNextDisabled = isLoading || page >= totalPages;

  return (
    <View className={["gap-3 rounded-2xl border border-border bg-surface p-4", className].filter(Boolean).join(" ")} {...props}>
      <Text className="text-center text-sm font-medium text-foreground/60">
        Page {page} of {totalPages}
      </Text>

      <View className="flex-row items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          disabled={isPreviousDisabled}
          onPress={() => onPageChange(page - 1)}
          className="flex-1"
        >
          <View className="flex-row items-center justify-center gap-2">
            <IconChevronLeft size={18} color="#111827" />
            <Text className="font-semibold text-foreground">Previous</Text>
          </View>
        </Button>

        <Button
          variant="primary"
          size="md"
          disabled={isNextDisabled}
          onPress={() => onPageChange(page + 1)}
          className="flex-1"
        >
          <View className="flex-row items-center justify-center gap-2">
            <Text className="font-semibold text-accent-foreground">Next</Text>
            <IconChevronRight size={18} color="#FFFFFF" />
          </View>
        </Button>
      </View>
    </View>
  );
}
