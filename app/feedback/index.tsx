import { FeedbackScreen } from '@/components/feedback/feedback-screen';
import { Stack } from 'expo-router';
import React from 'react';

export default function FeedbackRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Feedback',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#fafafa' },
        }}
      />
      <FeedbackScreen />
    </>
  );
}
