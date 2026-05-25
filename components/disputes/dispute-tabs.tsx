import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';

const tabs = [
  { id: 'ALL', label: 'All' },
  { id: 'ACTIVE', label: 'Active' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'AWAITING_EVIDENCE', label: 'Awaiting Evidence' },
  { id: 'RESOLVED', label: 'Resolved' },
  { id: 'WITHDRAWN', label: 'Withdrawn' },
];

export interface DisputeTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  counts?: Record<string, number>;
}

export function DisputeTabs({ activeTab, onTabChange, counts = {} }: DisputeTabsProps) {
  return (
    <View className="border-b border-border">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              className={`mr-6 py-3 border-b-2 ${
                isActive ? 'border-primary' : 'border-transparent'
              }`}
            >
              <View className="flex-row items-center">
                <Text
                  className={`text-sm font-medium ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </Text>
                {count > 0 && (
                  <View className="ml-2 bg-muted px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-muted-foreground">{count}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
