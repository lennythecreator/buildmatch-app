import { IconSearch, IconX } from "@tabler/icons-react-native";
import React from "react";
import { Pressable, TextInput, View } from "react-native";

import { Card } from "./ui/card";

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
      <View className="flex-row items-center gap-3 rounded-[20px] bg-background px-5 py-3.5">
        <IconSearch size={22} color="#64748B" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          className="flex-1 text-[15px] font-medium text-foreground"
        />
        {value.length > 0 ? (
          <Pressable onPress={onClear} className="rounded-full bg-border/50 p-1.5">
            <IconX size={16} color="#64748B" />
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}
