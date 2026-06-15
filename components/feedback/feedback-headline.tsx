import { View, Text } from 'react-native';

export function FeedbackHeadline() {
  return (
    <View className="gap-2">
      <View className="self-stretch">
        <Text className="text-[40px] leading-[52px] font-extrabold tracking-tight text-foreground" style={{ letterSpacing: -2.25 }}>
          SPEAK YOUR{'\n'}TRUTH.
        </Text>
      </View>
      <View className="max-w-[290px]">
        <Text className="font-medium text-[18px] leading-[27px] text-foreground/80">
          Tell us what needs to change. We&apos;re listening.
        </Text>
      </View>
    </View>
  );
}
