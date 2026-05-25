import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Dispute, DisputeStatus } from '@/lib/api/types';
import { useAuthStore } from '@/store/auth';

interface DisputeCardProps {
  dispute: Dispute;
}

const statusColors: Record<DisputeStatus, any> = {
  UNDER_REVIEW: 'warning',
  AWAITING_EVIDENCE: 'primary',
  PENDING_RULING: 'secondary',
  RESOLVED: 'success',
  WITHDRAWN: 'slate',
};

const statusLabels: Record<DisputeStatus, string> = {
  UNDER_REVIEW: 'Under Review',
  AWAITING_EVIDENCE: 'Awaiting Evidence',
  PENDING_RULING: 'Pending Ruling',
  RESOLVED: 'Resolved',
  WITHDRAWN: 'Withdrawn',
};

export function DisputeCard({ dispute }: DisputeCardProps) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);
  const status = dispute.status && dispute.status in statusLabels
    ? dispute.status
    : 'UNDER_REVIEW';
  const isFiledByMe = userId === dispute.filedById;
  const counterpartLabel = isFiledByMe ? 'Filed against' : 'Filed by';
  const counterpartName = isFiledByMe
    ? `${dispute.against?.firstName ?? ''} ${dispute.against?.lastName ?? ''}`.trim()
    : `${dispute.filedBy?.firstName ?? ''} ${dispute.filedBy?.lastName ?? ''}`.trim();
  const evidenceLabel = dispute.evidenceCount > 0
    ? `${dispute.evidenceCount} evidence item${dispute.evidenceCount === 1 ? '' : 's'}`
    : 'No evidence uploaded yet';
  const messageLabel = `${dispute.messageCount} message${dispute.messageCount === 1 ? '' : 's'}`;

  return (
    <TouchableOpacity onPress={() => router.push(`/disputes/${dispute.id}`)}>
      <Card className="bg-white shadow-sm elevation-1">
        <View className="flex-row justify-between items-start gap-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
              {dispute.jobTitle || 'Untitled dispute'}
            </Text>
            <Text className="mt-2 text-sm text-muted-foreground" numberOfLines={1}>
              {counterpartLabel}: {counterpartName || 'Unknown party'}
            </Text>
            <Text className="text-sm font-medium text-foreground mt-2">
              ${Number(dispute.amountDisputed || 0).toLocaleString()}
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              <View className="rounded-full bg-background px-3 py-1">
                <Text className="text-xs text-muted-foreground">{evidenceLabel}</Text>
              </View>
              <View className="rounded-full bg-background px-3 py-1">
                <Text className="text-xs text-muted-foreground">{messageLabel}</Text>
              </View>
            </View>
          </View>

          <Badge color={statusColors[status] || 'default'} variant="flat">
            {statusLabels[status] || 'Under Review'}
          </Badge>
        </View>
      </Card>
    </TouchableOpacity>
  );
}
