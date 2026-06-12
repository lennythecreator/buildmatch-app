import { Button } from '@/components/ui/button';
import type { EscrowOnboardStatus } from '@/lib/api/types';
import { type EscrowSummary, formatEscrowCurrency } from '@/lib/escrow/escrow-summary';
import { themeColors } from '@/lib/theme';
import { IconLock, IconShieldCheck } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

interface EscrowOrderTotalProps {
  summary: EscrowSummary;
  isFunding: boolean;
  isSecured: boolean;
  onFund: () => void;
  onReviewAgreement: () => void;
  onboardStatus?: EscrowOnboardStatus;
  isOnboarding: boolean;
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm font-medium text-foreground/60">{label}</Text>
      <Text selectable className="text-base font-bold text-foreground">
        {value}
      </Text>
    </View>
  );
}

export function EscrowOrderTotal({
  summary,
  isFunding,
  isSecured,
  onFund,
  onReviewAgreement,
  onboardStatus,
  isOnboarding,
}: EscrowOrderTotalProps) {
  const needsOnboarding = onboardStatus && !onboardStatus.hasAccount;

  return (
    <View className="gap-8 rounded-3xl bg-surface p-8 shadow-sm">
      <View className="gap-1">
        <Text selectable className="text-lg font-bold text-foreground">
          Order Total
        </Text>
        <Text className="text-xs font-medium text-foreground/60">
          Amount to be secured in Escrow
        </Text>
      </View>

      <View className="gap-3">
        <TotalRow label="Bid amount" value={formatEscrowCurrency(summary.bidAmount)} />
        <TotalRow label="Escrow protection fee" value={formatEscrowCurrency(summary.escrowFee)} />
        <View className="h-px bg-border" />
        <View className="flex-row items-end justify-between pt-2">
          <Text className="text-base font-bold text-foreground">Total</Text>
          <Text selectable className="text-3xl font-extrabold text-foreground">
            {formatEscrowCurrency(summary.orderTotal)}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start gap-3 rounded-xl bg-foreground/5 p-4">
        <IconLock size={18} color={themeColors.accent} />
        <Text className="flex-1 text-[11px] leading-[18px] text-foreground/60">
          Funds are held securely in escrow and only released to the contractor as milestones are
          completed and approved.
        </Text>
      </View>

      {isSecured ? (
        <View className="flex-row items-center justify-center gap-2 rounded-xl bg-secondary/10 p-4">
          <IconShieldCheck size={18} color={themeColors.secondary} />
          <Text className="text-sm font-bold text-secondary">Funds secured in escrow</Text>
        </View>
      ) : (
        <View className="gap-3">
          <Button variant="primary" isLoading={isFunding || isOnboarding} onPress={onFund}>
            {needsOnboarding ? 'Set Up Escrow Account' : 'Fund Escrow'}
          </Button>
          <Button variant="ghost" size="sm" onPress={onReviewAgreement}>
            Review agreement
          </Button>
          <Text className="text-center text-xs text-foreground/60">
            {needsOnboarding
              ? 'You need an Escrow.com account before funding.'
              : 'Funds are transferred securely via Escrow.com.'}
          </Text>
        </View>
      )}
    </View>
  );
}
