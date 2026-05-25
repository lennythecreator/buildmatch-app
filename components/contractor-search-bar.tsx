import React from "react";

import { Card } from "./ui/card";
import { SearchField } from "./ui/search-field";

interface ContractorSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function ContractorSearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search name, trade, city, or keyword",
}: ContractorSearchBarProps) {
  return (
    <Card className="rounded-3xl bg-surface p-4">
      <SearchField
        value={value}
        onChangeText={onChangeText}
        onClear={onClear}
        placeholder={placeholder}
        containerClassName="flex-row items-center gap-3 rounded-[20px] bg-background px-5 py-3.5"
      />
    </Card>
  );
}
