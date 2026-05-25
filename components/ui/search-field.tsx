import { themeColors } from '@/lib/theme';
import { IconSearch, IconX } from '@tabler/icons-react-native';
import React from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

interface SearchFieldProps extends TextInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  iconSize?: number;
  clearIconSize?: number;
  showClearButton?: boolean;
}

export function SearchField({
  value,
  onChangeText,
  onClear,
  containerClassName = 'flex-row items-center gap-3 rounded-2xl bg-background px-4 py-3.5',
  inputClassName = 'flex-1 text-[15px] font-medium text-foreground',
  iconSize = 20,
  clearIconSize = 16,
  showClearButton = true,
  placeholderTextColor = themeColors.placeholderText,
  ...props
}: SearchFieldProps) {
  const hasValue = value.trim().length > 0;

  return (
    <View className={containerClassName}>
      <IconSearch size={iconSize} color={themeColors.mutedText} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        className={inputClassName}
        {...props}
      />
      {showClearButton && hasValue && onClear ? (
        <Pressable onPress={onClear} hitSlop={8} className="rounded-full bg-border/50 p-1.5">
          <IconX size={clearIconSize} color={themeColors.mutedText} />
        </Pressable>
      ) : null}
    </View>
  );
}
