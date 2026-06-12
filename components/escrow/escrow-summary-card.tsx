import { type EscrowSummary, formatEscrowCurrency } from '@/lib/escrow/escrow-summary';
import { themeColors } from '@/lib/theme';
import { IconCircleCheck } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

interface EscrowSummaryCardProps {
  summary: EscrowSummary;
}

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
      {children}
    </Text>
  );
}

export function EscrowSummaryCard({ summary }: EscrowSummaryCardProps) {
  const feeLabel = `${(summary.feeRate * 100).toFixed(1)}% Protection Fee`;

  return (
    <View className="gap-8 rounded-3xl bg-surface p-8 shadow-sm">
      <Text selectable className="text-xl font-bold text-foreground">
        Payment Verification
      </Text>

      <View className="gap-6">
        <View className="gap-1">
          <FieldLabel>Contractor</FieldLabel>
          <Text selectable className="text-lg font-bold text-foreground">
            {summary.contractorName}
          </Text>
          <View className="flex-row items-center gap-1">
            <IconCircleCheck size={14} color={themeColors.secondary} />
            <Text className="text-xs font-semibold text-secondary">Verified contractor</Text>
          </View>
        </View>

        <View className="gap-1">
          <FieldLabel>Bid Amount</FieldLabel>
          <Text selectable className="text-lg font-bold text-foreground">
            {formatEscrowCurrency(summary.bidAmount)}
          </Text>
          <Text className="text-xs font-medium text-foreground/60">Fixed-Price Contract</Text>
        </View>

        <View className="gap-1">
          <FieldLabel>Escrow Fee</FieldLabel>
          <Text selectable className="text-lg font-bold text-foreground">
            {formatEscrowCurrency(summary.escrowFee)}
          </Text>
          <Text className="text-xs font-medium text-foreground/60">{feeLabel}</Text>
        </View>
      </View>
    </View>
  );
}
