import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { IconUpload } from '@tabler/icons-react-native';

export interface UploadEvidenceProps {
  onUpload: () => void;
  isLoading: boolean;
}

export function UploadEvidence({ onUpload, isLoading }: UploadEvidenceProps) {
  return (
    <View className="border border-dashed border-border rounded-xl p-4 mt-4 bg-muted/30">
      <View className="items-center justify-center p-2 mb-3">
        <IconUpload size={32} color="#a1a1aa" className="mb-2" />
        <Text className="text-sm font-semibold text-foreground text-center">
          Upload Evidence
        </Text>
        <Text className="text-xs text-muted-foreground text-center mt-1 mx-4">
          Please upload photos, receipts, or documents supporting your claim.
        </Text>
      </View>
      <Button 
        onPress={onUpload} 
        disabled={isLoading}
        className="w-full"
      >
        <Text>Select Files</Text>
      </Button>
    </View>
  );
}
