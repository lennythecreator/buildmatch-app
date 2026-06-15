import type { FeedbackSentiment } from '@/lib/api/types';
import { Pressable, Text, View } from 'react-native';

interface SentimentToggleProps {
  value: FeedbackSentiment;
  onChange: (value: FeedbackSentiment) => void;
}

export function SentimentToggle({ value, onChange }: SentimentToggleProps) {
  const isPositive = value === 'POSITIVE';

  return (
    <View className="flex-row rounded-full bg-foreground p-1.5 shadow-lg">
      {/* Positive segment */}
      <Pressable
        onPress={() => onChange('POSITIVE')}
        className={`flex-1 items-center justify-center rounded-full py-3 ${
          isPositive ? 'bg-surface shadow-lg' : 'bg-transparent'
        }`}
        style={isPositive ? { shadowColor: '#16a34a', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 25 } : {}}
      >
        <Text
          className={`text-xs font-extrabold tracking-wide uppercase ${
            isPositive ? 'text-foreground' : 'text-primary-foreground/80'
          }`}
        >
          LOVE IT
        </Text>
      </Pressable>

      {/* Negative segment */}
      <Pressable
        onPress={() => onChange('NEGATIVE')}
        className={`flex-1 items-center justify-center rounded-full py-3 ${
          !isPositive ? 'bg-danger/10' : 'bg-transparent'
        }`}
      >
        <Text
          className={`text-xs font-extrabold tracking-wide uppercase ${
            !isPositive ? 'text-danger' : 'text-primary-foreground/80'
          }`}
        >
          NEEDS WORK
        </Text>
      </Pressable>
    </View>
  );
}
