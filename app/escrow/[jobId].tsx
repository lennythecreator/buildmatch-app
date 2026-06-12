import { EscrowScreen } from '@/components/escrow/escrow-screen';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function EscrowRoute() {
  const params = useLocalSearchParams<{ jobId?: string | string[] }>();
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  if (!jobId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Missing job id.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Escrow',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fafafa' },
        }}
      />
      <EscrowScreen jobId={jobId} />
    </>
  );
}
