import { Button } from '@/components/ui/button';
import type { EscrowMilestone } from '@/lib/api/types';
import { formatEscrowCurrency, getMilestoneStatusLabel } from '@/lib/escrow/escrow-summary';
import { themeColors } from '@/lib/theme';
import { useAuthStore } from '@/store/auth';
import { IconCheck } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

interface DrawScheduleProps {
  milestones: EscrowMilestone[];
  jobId: string;
  onSubmitMilestone?: (milestone: EscrowMilestone) => void;
  onApproveMilestone?: (milestone: EscrowMilestone) => void;
  onDisputeMilestone?: (milestone: EscrowMilestone) => void;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-foreground/10',
  SUBMITTED: 'bg-warning/20',
  APPROVED: 'bg-accent',
  DISPUTED: 'bg-danger',
  RELEASED: 'bg-secondary',
};

export function DrawSchedule({
  milestones,
  onSubmitMilestone,
  onApproveMilestone,
  onDisputeMilestone,
}: DrawScheduleProps) {
  const role = useAuthStore((state) => state.user?.role);
  const isContractor = role === 'CONTRACTOR';
  const isInvestor = role === 'INVESTOR';

  if (milestones.length === 0) {
    return (
      <View className="gap-6 rounded-2xl bg-surface p-6 shadow-sm">
        <Text selectable className="text-lg font-bold text-foreground">
          Draw Schedule
        </Text>
        <View className="rounded-xl border border-dashed border-border bg-foreground/5 p-6">
          <Text className="text-sm leading-6 text-foreground/60">
            No draw schedule defined yet. Fund the escrow to create a draw schedule.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="gap-6 rounded-2xl bg-surface p-6 shadow-sm">
      <Text selectable className="text-lg font-bold text-foreground">
        Draw Schedule
      </Text>

      <View className="gap-3">
        {milestones.map((milestone, index) => {
          const isPending = milestone.status === 'PENDING';
          const isSubmitted = milestone.status === 'SUBMITTED';
          const isApproved = milestone.status === 'APPROVED';
          const isDisputed = milestone.status === 'DISPUTED';
          const isReleased = milestone.status === 'RELEASED';
          const isComplete = isApproved || isReleased;

          return (
            <View
              key={milestone.id}
              className={`rounded-xl border p-4 ${
                isSubmitted
                  ? 'border-warning/30 bg-warning/5'
                  : isDisputed
                  ? 'border-danger/30 bg-danger/5'
                  : isComplete
                  ? 'border-secondary/30 bg-secondary/5'
                  : 'border-border bg-transparent'
              }`}
            >
              <View className="flex-row items-center justify-between gap-4">
                <View className="flex-1 flex-row items-center gap-4">
                  <View
                    className={`h-10 w-10 items-center justify-center rounded-full ${
                      isComplete || isSubmitted
                        ? 'bg-accent'
                        : isDisputed
                        ? 'bg-danger'
                        : STATUS_COLORS[milestone.status] ?? 'bg-foreground/10'
                    }`}
                  >
                    {isComplete ? (
                      <IconCheck size={18} color={themeColors.accentForeground} />
                    ) : (
                      <Text className="text-base font-bold text-accent-foreground">
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text selectable className="text-base font-bold text-foreground">
                      {milestone.title}
                    </Text>
                    {milestone.description ? (
                      <Text className="text-xs text-foreground/60">{milestone.description}</Text>
                    ) : null}
                    <View className="mt-1 flex-row items-center gap-2">
                      <Text className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                        {getMilestoneStatusLabel(milestone.status)}
                      </Text>
                      <Text className="text-[10px] text-foreground/30">•</Text>
                      <Text className="text-[10px] text-foreground/40">
                        {milestone.percentage}%
                      </Text>
                    </View>
                  </View>
                </View>
                <Text selectable className="text-base font-bold text-foreground">
                  {formatEscrowCurrency(milestone.amount)}
                </Text>
              </View>

              {isSubmitted && isInvestor ? (
                <View className="mt-3 flex-row gap-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onPress={() => onApproveMilestone?.(milestone)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onPress={() => onDisputeMilestone?.(milestone)}
                  >
                    Dispute
                  </Button>
                </View>
              ) : null}

              {isPending && isContractor ? (
                <View className="mt-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onPress={() => onSubmitMilestone?.(milestone)}
                  >
                    Mark as Complete
                  </Button>
                </View>
              ) : null}

              {milestone.completionNotes ? (
                <View className="mt-3 rounded-lg bg-foreground/5 p-3">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                    Completion Notes
                  </Text>
                  <Text className="mt-1 text-sm text-foreground/80">
                    {milestone.completionNotes}
                  </Text>
                </View>
              ) : null}

              {milestone.disputeReason ? (
                <View className="mt-3 rounded-lg bg-danger/10 p-3">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-danger">
                    Dispute Reason
                  </Text>
                  <Text className="mt-1 text-sm text-foreground/80">
                    {milestone.disputeReason}
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
