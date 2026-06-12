import type { EscrowPayment } from '@/lib/api/types';
import { type EscrowSummary, formatEscrowCurrency, getPaymentStatusLabel } from '@/lib/escrow/escrow-summary';
import { themeColors } from '@/lib/theme';
import { IconClock, IconShieldCheck, IconAlertTriangle, IconCheck } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

interface EscrowProtectionStatusProps {
  summary: EscrowSummary;
  payment: EscrowPayment;
}

function isFundedStatus(status: string): boolean {
  return ['FUNDED', 'IN_PROGRESS', 'FULLY_RELEASED'].includes(status);
}

function isDisputedStatus(status: string): boolean {
  return status === 'DISPUTED';
}

export function EscrowProtectionStatus({ summary, payment }: EscrowProtectionStatusProps) {
  const isFunded = isFundedStatus(payment.status);
  const isDisputed = isDisputedStatus(payment.status);
  const isComplete = payment.status === 'FULLY_RELEASED';

  function getStatusIcon() {
    if (isComplete) return <IconCheck size={20} color={themeColors.secondary} />;
    if (isDisputed) return <IconAlertTriangle size={20} color={themeColors.danger} />;
    if (isFunded) return <IconShieldCheck size={20} color={themeColors.secondary} />;
    return <IconClock size={20} color={themeColors.mutedText} />;
  }

  function getStatusBg() {
    if (isComplete || isFunded) return 'bg-secondary/10';
    if (isDisputed) return 'bg-danger/10';
    return 'bg-foreground/5';
  }

  function getStatusText() {
    if (isComplete) return 'text-secondary';
    if (isDisputed) return 'text-danger';
    if (isFunded) return 'text-secondary';
    return 'text-foreground';
  }

  function getStatusMessage() {
    if (isComplete) {
      return 'All milestones have been approved and funds released.';
    }
    if (isDisputed) {
      return 'A milestone has been disputed. Review the details below.';
    }
    if (isFunded) {
      return `${summary.investorName} has funded escrow. Payments release as milestones are approved.`;
    }
    return `${summary.investorName} has not funded escrow yet. You will be notified once funds are secured.`;
  }

  function getStatusTitle() {
    if (isComplete) return 'All funds released';
    if (isDisputed) return 'Dispute active';
    if (isFunded) return 'Funds secured in escrow';
    return 'Awaiting client funding';
  }

  const approvedAmount = payment.milestones
    .filter((m) => m.status === 'APPROVED' || m.status === 'RELEASED')
    .reduce((sum, m) => sum + m.amount, 0);

  const remainingAmount = payment.totalAmount - approvedAmount;

  return (
    <View className="gap-6 rounded-3xl bg-surface p-8 shadow-sm">
      <View className="gap-1">
        <Text selectable className="text-lg font-bold text-foreground">
          Payment Protection
        </Text>
        <Text className="text-xs font-medium text-foreground/60">
          Status: {getPaymentStatusLabel(payment.status)}
        </Text>
      </View>

      <View className={`flex-row items-center gap-3 rounded-xl p-4 ${getStatusBg()}`}>
        {getStatusIcon()}
        <View className="flex-1">
          <Text className={`text-sm font-bold ${getStatusText()}`}>
            {getStatusTitle()}
          </Text>
          <Text className="text-xs text-foreground/60">
            {getStatusMessage()}
          </Text>
        </View>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-foreground/60">Contract value</Text>
          <Text selectable className="text-base font-bold text-foreground">
            {formatEscrowCurrency(summary.bidAmount)}
          </Text>
        </View>
        {isFunded ? (
          <>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-foreground/60">Approved for release</Text>
              <Text selectable className="text-base font-bold text-secondary">
                {formatEscrowCurrency(approvedAmount)}
              </Text>
            </View>
            {remainingAmount > 0 ? (
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-foreground/60">Remaining in escrow</Text>
                <Text selectable className="text-base font-bold text-foreground">
                  {formatEscrowCurrency(remainingAmount)}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}
        <View className="h-px bg-border" />
        <View className="flex-row items-end justify-between pt-2">
          <Text className="text-base font-bold text-foreground">Protected total</Text>
          <Text selectable className="text-3xl font-extrabold text-foreground">
            {formatEscrowCurrency(summary.bidAmount)}
          </Text>
        </View>
      </View>
    </View>
  );
}
