import React from 'react';

import { SearchField } from '../ui/search-field';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
}

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  return (
    <SearchField
      value={value}
      onChangeText={onChangeText}
      onClear={onClear}
      placeholder="Search conversations"
      containerClassName="flex-row items-center rounded-2xl bg-surface px-4 py-3"
      inputClassName="ml-3 flex-1 text-base text-foreground"
      iconSize={18}
      clearIconSize={14}
    />
  );
}