import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import { Text, View } from 'react-native';

interface ProfileSectionProps {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

export function ProfileSection({ title, description, buttonText, onPress, icon, content }: ProfileSectionProps) {
  return (
    <Card className="mb-4">
      <View className="flex-row items-baseline justify-between mb-2">
        <Text className="text-lg font-bold text-gray-900">{title}</Text>
      </View>
      {content ? (
        <View className="gap-4 py-2">
          <View>{content}</View>
          <Button variant="outline" className="self-start" onPress={onPress}>
            <Text className="font-bold text-gray-700">{buttonText}</Text>
          </Button>
        </View>
      ) : (
        <View className="items-center justify-center py-6 gap-3">
          {icon && <View className="mb-2">{icon}</View>}
          <Text className="text-center text-sm text-gray-500">{description}</Text>
          <Button variant="outline" className="mt-2" onPress={onPress}>
            <Text className="font-bold text-gray-700">{buttonText}</Text>
          </Button>
        </View>
      )}
    </Card>
  );
}
