import React from 'react';
import { View, Text } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { IconCheck } from '@tabler/icons-react-native';

const TIMELINE_STEPS = [
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'AWAITING_EVIDENCE', label: 'Evidence Collection' },
  { id: 'PENDING_RULING', label: 'Pending Ruling' },
  { id: 'RESOLVED', label: 'Resolved' },
] as const;

const TIMELINE_STEP_COPY = {
  UNDER_REVIEW: 'Case logged and assigned for review.',
  AWAITING_EVIDENCE: 'Documents, photos, and notes are being gathered.',
  PENDING_RULING: 'The mediation team is weighing the facts.',
  RESOLVED: 'A decision has been issued and the case is closed.',
} as const;

interface DisputeTimelineProps {
  status: string;
}

export function DisputeTimeline({ status }: DisputeTimelineProps) {
  const currentStepIndex = TIMELINE_STEPS.findIndex((step) => step.id === status);
  const timelineProgress = currentStepIndex < 0 ? 0 : ((currentStepIndex + 1) / TIMELINE_STEPS.length) * 100;
  const currentTimelineStep = TIMELINE_STEPS[currentStepIndex] ?? TIMELINE_STEPS[0];

  return (
    <Card className="mb-6 gap-4">
      <View className="flex-row items-center justify-between pb-4 border-b border-border/50">
        <View className="flex-1 pr-3">
          <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status Timeline</Text>
          <Text className="mt-1 text-base font-bold text-foreground">{currentTimelineStep.label}</Text>
        </View>
        <Badge color={status === 'RESOLVED' ? 'success' : 'primary'} variant="surface" size="md">
          {Math.round(timelineProgress)}% Complete
        </Badge>
      </View>

      <View className="mt-4 px-1">
        {TIMELINE_STEPS.map((step, index) => {
          const isCompleted = currentStepIndex > index;
          const isActive = currentStepIndex === index;
          const isPending = currentStepIndex < index;
          const isLast = index === TIMELINE_STEPS.length - 1;

          return (
            <View key={step.id} className="flex-row relative">
              {/* Left Track */}
              <View className="items-center mr-4 w-8 relative">
                {/* Connector Line (drawn first so node sits on top) */}
                {!isLast && (
                  <View
                    className={`absolute top-8 -bottom-6 w-0.5 ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
                {/* Node */}
                <View
                  className={`z-10 h-8 w-8 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-primary bg-primary'
                      : isActive
                      ? 'border-primary bg-surface shadow-sm'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  {isCompleted ? (
                    <IconCheck size={16} color="#ffffff" stroke={3} />
                  ) : (
                    <Text
                      className={`text-xs font-bold leading-none ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
              </View>

              {/* Content */}
              <View className={`flex-1 pb-6 ${isActive || isCompleted ? 'opacity-100' : 'opacity-60'}`}>
                <Text
                  className={`text-base font-bold ${
                    isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </Text>
                <Text className="mt-1 text-sm text-muted-foreground leading-5">
                  {TIMELINE_STEP_COPY[step.id]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </Card>
  );
}