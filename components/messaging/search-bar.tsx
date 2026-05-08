import { IconSearch, IconX } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
}

export function SearchBar({ value, onChangeText, onClear }: SearchBarProps) {
  const hasValue = value.trim().length > 0;

  return (
    <View className="flex-row items-center rounded-2xl bg-surface px-4 py-3">
      <IconSearch size={18} color="#64748b" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search conversations"
        placeholderTextColor="#64748b"
        className="ml-3 flex-1 text-base text-foreground"
      />
      {hasValue && onClear ? (
        <Pressable onPress={onClear} hitSlop={8} className="ml-2 rounded-full bg-slate-100 p-1.5">
          <IconX size={14} color="#64748b" />
        </Pressable>
      ) : null}
    </View>
  );
}