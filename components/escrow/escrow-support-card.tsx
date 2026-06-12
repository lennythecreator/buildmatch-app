import { themeColors } from '@/lib/theme';
import { IconChevronRight, IconHelpCircle } from '@tabler/icons-react-native';
import { Pressable, Text, View } from 'react-native';

interface EscrowSupportCardProps {
  onPress?: () => void;
}

export function EscrowSupportCard({ onPress }: EscrowSupportCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-2xl border border-border bg-foreground/5 p-6 active:opacity-80"
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-surface shadow-sm">
        <IconHelpCircle size={20} color={themeColors.accent} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-bold text-foreground">Questions about escrow?</Text>
        <Text className="text-xs text-foreground/60">
          Learn how funds are protected and released.
        </Text>
      </View>
      <IconChevronRight size={20} color={themeColors.mutedText} />
    </Pressable>
  );
}
