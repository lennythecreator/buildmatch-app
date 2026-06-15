import { FeedbackComposer } from '@/components/feedback/feedback-composer';
import { FeedbackHeadline } from '@/components/feedback/feedback-headline';
import { FeedbackWatermark } from '@/components/feedback/feedback-watermark';
import { FounderMessageBubble } from '@/components/feedback/founder-message-bubble';
import { FounderStatusWidget } from '@/components/feedback/founder-status-widget';
import { SentimentToggle } from '@/components/feedback/sentiment-toggle';
import type { FeedbackSentiment } from '@/lib/api/types';
import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

export function FeedbackScreen() {
  const [sentiment, setSentiment] = React.useState<FeedbackSentiment>('POSITIVE');
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function handleSuccess() {
    setSubmitted(true);
    setError(null);
  }

  function handleError(err: Error) {
    setError(err.message || 'Something went wrong. Please try again.');
  }

  if (submitted) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-background"
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary/20 mb-6">
            <Text className="text-3xl">✓</Text>
          </View>
          <Text className="text-center text-xl font-bold text-foreground mb-2">
            Thank you!
          </Text>
          <Text className="text-center font-medium text-foreground/60 leading-6 max-w-xs">
            The founders got your note. We read every single piece of feedback.
          </Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      className="flex-1 bg-background"
    >
      <View className="flex-1">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          className="flex-1"
          contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FounderStatusWidget />
          <FeedbackHeadline />
          <SentimentToggle value={sentiment} onChange={setSentiment} />
          <FounderMessageBubble />
          <FeedbackWatermark />
        </ScrollView>

        {/* Error banner */}
        {error ? (
          <View className="mx-6 mb-2 rounded-xl bg-danger/10 px-4 py-3">
            <Text className="text-sm font-semibold text-danger">{error}</Text>
          </View>
        ) : null}

        {/* Composer pinned to bottom */}
        <View className="px-6 pb-6 pt-2">
          <FeedbackComposer
            sentiment={sentiment}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
