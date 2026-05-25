import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DisputeCard } from '@/components/disputes/dispute-card';
import type { Dispute } from '@/types/dispute';

const sampleDisputes: Dispute[] = [
  {
    id: 'dispute-1',
    jobId: 'job-1',
    jobTitle: 'Kitchen remodel at 42 Oak Street',
    filedById: 'user-1',
    againstId: 'user-2',
    milestoneDraw: 'Draw 1',
    amountDisputed: 12500,
    category: 'PAYMENT_ISSUE',
    description: 'Payment was withheld after the first milestone was completed.',
    desiredOutcome: 'Release payment for completed work.',
    status: 'UNDER_REVIEW',
    ruling: null,
    rulingNote: null,
    resolvedAt: null,
    lastActivityAt: '2026-05-20T12:00:00Z',
    createdAt: '2026-05-18T09:30:00Z',
    filedBy: {
      id: 'user-1',
      firstName: 'Ava',
      lastName: 'Stone',
      avatarUrl: null,
      role: 'INVESTOR',
    },
    against: {
      id: 'user-2',
      firstName: 'Marcus',
      lastName: 'Lee',
      avatarUrl: null,
      role: 'CONTRACTOR',
    },
    evidenceCount: 3,
    messageCount: 8,
  },
  {
    id: 'dispute-2',
    jobId: 'job-2',
    jobTitle: 'Basement waterproofing',
    filedById: 'user-3',
    againstId: 'user-4',
    milestoneDraw: null,
    amountDisputed: 7800,
    category: 'POOR_QUALITY',
    description: 'The finished work does not meet the agreed scope.',
    desiredOutcome: 'Require corrective work or partial refund.',
    status: 'AWAITING_EVIDENCE',
    ruling: null,
    rulingNote: null,
    resolvedAt: null,
    lastActivityAt: '2026-05-19T17:15:00Z',
    createdAt: '2026-05-17T14:10:00Z',
    filedBy: {
      id: 'user-3',
      firstName: 'Priya',
      lastName: 'Nolan',
      avatarUrl: null,
      role: 'INVESTOR',
    },
    against: {
      id: 'user-4',
      firstName: 'Drew',
      lastName: 'Carter',
      avatarUrl: null,
      role: 'CONTRACTOR',
    },
    evidenceCount: 1,
    messageCount: 2,
  },
  {
    id: 'dispute-3',
    jobId: 'job-3',
    jobTitle: 'Exterior paint and trim',
    filedById: 'user-5',
    againstId: 'user-6',
    milestoneDraw: 'Final draw',
    amountDisputed: 4600,
    category: 'WORK_NOT_STARTED',
    description: 'The contractor has not started the final scope after deposit payment.',
    desiredOutcome: 'Start work or refund the deposit.',
    status: 'RESOLVED',
    ruling: 'Partial refund issued.',
    rulingNote: 'Both parties agreed to split the remaining balance.',
    resolvedAt: '2026-05-20T08:45:00Z',
    lastActivityAt: '2026-05-20T08:45:00Z',
    createdAt: '2026-05-15T11:00:00Z',
    filedBy: {
      id: 'user-5',
      firstName: 'Elena',
      lastName: 'Brooks',
      avatarUrl: null,
      role: 'INVESTOR',
    },
    against: {
      id: 'user-6',
      firstName: 'Noah',
      lastName: 'Kim',
      avatarUrl: null,
      role: 'CONTRACTOR',
    },
    evidenceCount: 5,
    messageCount: 14,
  },
];

export default function DisputeCardTestScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-4 border-b border-border bg-surface">
        <Text className="text-2xl font-bold text-foreground">Dispute Card Test</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Controlled sample data for checking card layout, badge rendering, and spacing.
        </Text>
      </View>

      <FlatList
        data={sampleDisputes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DisputeCard dispute={item} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      />
    </SafeAreaView>
  );
}
