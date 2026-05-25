import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import type { Dispute, DisputeEvidence } from '@/lib/api/types';

export interface EvidenceCarouselProps {
  evidence: DisputeEvidence[];
  dispute: Dispute;
}

export function EvidenceCarousel({ evidence, dispute }: EvidenceCarouselProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <View className="py-6 items-center justify-center border border-dashed border-border rounded-xl bg-muted/10">
        <Text className="text-sm text-foreground font-medium mb-1">No Evidence Uploaded</Text>
        <Text className="text-xs text-muted-foreground text-center px-4">
          Neither party has uploaded any evidence yet. 
        </Text>
      </View>
    );
  }

  // Get user name helper
  const getUserName = (userId: string) => {
    if (userId === dispute.filedById) {
      return `${dispute.filedBy?.firstName} ${dispute.filedBy?.lastName}`;
    }
    if (userId === dispute.againstId) {
      return `${dispute.against?.firstName} ${dispute.against?.lastName}`;
    }
    return 'Admin';
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 -mx-4 px-4">
      {evidence.map((item) => (
        <View key={item.id} className="mr-4 w-40 bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
          {item.type.includes('image') || item.url.match(/\.(jpeg|jpg|gif|png)$/) ? (
            <Image 
              source={{ uri: item.url }} 
              className="w-full h-32" 
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-32 bg-muted items-center justify-center">
              <Text className="text-xs text-muted-foreground">Document</Text>
            </View>
          )}
          <View className="p-3">
            <Text className="text-xs font-semibold text-foreground mb-1" numberOfLines={1}>
              {item.description || 'Evidence File'}
            </Text>
            <Text className="text-[10px] text-muted-foreground">
              Uploaded by: {getUserName(item.uploadedById)}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
