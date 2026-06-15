import { Text, View } from 'react-native';

export function FounderMessageBubble() {
  return (
    <View className="max-w-[351px] self-start rounded-3xl bg-foreground/5 border border-border/50 px-6 py-6"
      style={{ borderBottomLeftRadius: 0 }}
    >
      <Text className="font-medium text-base leading-[26px] text-foreground">
        Hey! Founder here. We&apos;re obsessing over making BuildMatch perfect. What&apos;s one thing we should change today?
      </Text>
    </View>
  );
}
