import type { FounderPresence } from '@/lib/api/types';
import { themeColors } from '@/lib/theme';
import { IconDotsVertical } from '@tabler/icons-react-native';
import { View, Text } from 'react-native';

const FALLBACK_FOUNDERS: FounderPresence = {
  founders: [
    { name: 'Alex', avatarUrl: undefined },
    { name: 'Jordan', avatarUrl: undefined },
  ],
  isOnline: true,
  statusLine: 'Founders are listening',
};

interface FounderStatusWidgetProps {
  presence?: FounderPresence;
}

export function FounderStatusWidget({ presence }: FounderStatusWidgetProps) {
  const { founders, isOnline, statusLine } = presence ?? FALLBACK_FOUNDERS;
  const avatarSize = 40;

  return (
    <View className="flex-row items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm">
      <View className="flex-row items-center gap-3">
        <View className="flex-row items-center" style={{ width: 68, height: avatarSize }}>
          {founders.slice(0, 2).map((founder, index) => (
            <View
              key={founder.name}
              className="rounded-full border-2 border-surface"
              style={{
                width: avatarSize,
                height: avatarSize,
                marginLeft: index === 1 ? -12 : 0,
                backgroundColor: themeColors.foreground,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text className="text-xs font-bold text-white">
                {founder.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-0.5">
          <View className="flex-row items-center gap-1.5">
            <View
              className={`rounded-full ${isOnline ? 'bg-secondary' : 'bg-foreground/20'}`}
              style={{ width: 8, height: 8 }}
            />
            <Text className="text-[11px] font-bold tracking-widest text-foreground/60 uppercase">
              {isOnline ? 'Online' : 'Away'}
            </Text>
          </View>
          <Text className="font-medium text-sm text-foreground/80">
            {statusLine}
          </Text>
        </View>
      </View>

      <View className="h-10 w-10 items-center justify-center rounded-full bg-foreground/5">
        <IconDotsVertical size={16} color={themeColors.foreground} />
      </View>
    </View>
  );
}
