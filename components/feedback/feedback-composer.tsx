import type { FeedbackSentiment } from '@/lib/api/types';
import { useSubmitFeedback } from '@/hooks/useSubmitFeedback';
import { themeColors } from '@/lib/theme';
import { IconSend } from '@tabler/icons-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

interface FeedbackComposerProps {
  sentiment: FeedbackSentiment;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export function FeedbackComposer({ sentiment, onSuccess, onError }: FeedbackComposerProps) {
  const [message, setMessage] = React.useState('');
  const submitFeedback = useSubmitFeedback();

  const trimmed = message.trim();
  const canSend = trimmed.length > 0 && !submitFeedback.isPending;

  function handleSend() {
    if (!canSend) return;

    submitFeedback.mutate(
      { sentiment, comment: trimmed },
      {
        onSuccess: () => {
          setMessage('');
          onSuccess();
        },
        onError: (error) => {
          onError(error);
        },
      }
    );
  }

  return (
    <View className="flex-row items-center rounded-full bg-surface border border-border px-2 py-1.5 shadow-lg">
      {/* Secondary action placeholder (attachment) - hidden for MVP */}
      <View className="w-0" />

      {/* Text input */}
      <View className="flex-1 px-3">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Tell us what makes you smile... ❤️"
          placeholderTextColor={themeColors.placeholderText}
          multiline
          editable={!submitFeedback.isPending}
          className="font-semibold text-base text-foreground leading-5 max-h-20 py-1"
        />
      </View>

      {/* Send button */}
      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        className={`h-[42px] w-[42px] items-center justify-center rounded-full ${
          canSend ? 'bg-foreground' : 'bg-foreground/30'
        }`}
        style={canSend ? { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 } : {}}
      >
        {submitFeedback.isPending ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <IconSend size={16} color="#ffffff" />
        )}
      </Pressable>
    </View>
  );
}
