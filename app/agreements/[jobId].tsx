import { AgreementDraftScreen } from '@/components/agreements/agreement-draft-screen';
import { Button } from '@/components/ui/button';
import { useBids, useMyBid } from '@/hooks/useBids';
import { useJob } from '@/hooks/useJobs';
import type { PaymentPreference } from '@/lib/api/types';
import { generateProjectAgreementDraft } from '@/lib/agreements/project-agreement-draft';
import { useAuthStore } from '@/store/auth';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function AgreementDraftRoute() {
  const params = useLocalSearchParams<{ jobId?: string | string[]; bidId?: string | string[]; paymentPreference?: string | string[] }>();
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const selectedBidId = Array.isArray(params.bidId) ? params.bidId[0] : params.bidId;
  const paymentPreferenceParam = Array.isArray(params.paymentPreference) ? params.paymentPreference[0] : params.paymentPreference;
  const userRole = useAuthStore((state) => state.user?.role);
  const isInvestor = userRole === 'INVESTOR';

  const jobQuery = useJob(jobId ?? '');
  const bidsQuery = useBids(jobId ?? '', { enabled: isInvestor });
  const myBidQuery = useMyBid(jobId ?? '', { enabled: userRole === 'CONTRACTOR' });

  const bid = React.useMemo(() => {
    if (isInvestor) {
      const bids = bidsQuery.data?.bids ?? [];
      return bids.find((item) => item.id === selectedBidId) ?? bids.find((item) => item.status === 'ACCEPTED') ?? null;
    }

    return myBidQuery.data?.status === 'ACCEPTED' ? myBidQuery.data : null;
  }, [bidsQuery.data, isInvestor, myBidQuery.data, selectedBidId]);

  if (!jobId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Missing job id.
        </Text>
      </View>
    );
  }

  if (jobQuery.isLoading || (isInvestor ? bidsQuery.isLoading : myBidQuery.isLoading)) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <ActivityIndicator size="large" />
        <Text selectable className="mt-4 text-center text-sm font-medium text-foreground/60">
          Preparing agreement draft...
        </Text>
      </View>
    );
  }

  if (jobQuery.isError || !jobQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Failed to load this job for agreement drafting.
        </Text>
        <Button variant="primary" className="mt-6 w-full" onPress={() => router.back()}>
          Back
        </Button>
      </View>
    );
  }

  const draft = generateProjectAgreementDraft(jobQuery.data, bid, paymentPreferenceParam as PaymentPreference);
  const isReadyForSignature = Boolean(bid) && jobQuery.data.status === 'AWARDED';

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Project Agreement',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <AgreementDraftScreen draft={draft} isReadyForSignature={isReadyForSignature} />
    </>
  );
}
