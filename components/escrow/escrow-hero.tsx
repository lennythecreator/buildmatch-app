import type { EscrowPaymentStatus } from '@/lib/escrow/escrow-summary';
import { themeColors } from '@/lib/theme';
import { IconShieldCheck } from '@tabler/icons-react-native';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

interface EscrowHeroProps {
  title: string;
  status: EscrowPaymentStatus;
  photoUri?: string;
}

const STATUS_BADGE_STYLES: Record<string, { bg: string; label: string }> = {
  PENDING: { bg: 'bg-white/15', label: 'Awaiting Funding' },
  FUNDED: { bg: 'bg-secondary', label: 'Funded' },
  IN_PROGRESS: { bg: 'bg-secondary', label: 'In Progress' },
  FULLY_RELEASED: { bg: 'bg-secondary', label: 'Completed' },
  DISPUTED: { bg: 'bg-danger', label: 'Disputed' },
  REFUNDED: { bg: 'bg-white/15', label: 'Refunded' },
};

export function EscrowHero({ title, status, photoUri }: EscrowHeroProps) {
  const badge = STATUS_BADGE_STYLES[status] ?? { bg: 'bg-white/15', label: status };

  return (
    <View className="h-72 justify-end overflow-hidden rounded-3xl bg-accent p-6 shadow-sm">
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.4 }}
          contentFit="cover"
          transition={150}
        />
      ) : null}
      <View className="absolute bottom-0 left-0 right-0 h-2/3 bg-black/40" />

      <View className="gap-2">
        <View
          className={`flex-row items-center gap-1.5 self-start rounded-full px-3 py-1 ${badge.bg}`}
        >
          <IconShieldCheck size={14} color={themeColors.accentForeground} />
          <Text className="text-[10px] font-bold uppercase tracking-widest text-white">
            {badge.label}
          </Text>
        </View>
        <Text selectable className="text-3xl font-extrabold leading-tight tracking-tight text-white">
          {title}
        </Text>
      </View>
    </View>
  );
}
