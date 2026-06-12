import { EscrowHero } from '@/components/escrow/escrow-hero';
import { EscrowOrderTotal } from '@/components/escrow/escrow-order-total';
import { EscrowProtectionStatus } from '@/components/escrow/escrow-protection-status';
import { EscrowSummaryCard } from '@/components/escrow/escrow-summary-card';
import { EscrowSupportCard } from '@/components/escrow/escrow-support-card';
import { PaymentSchedule } from '@/components/escrow/payment-schedule';
import { useBids, useMyBid } from '@/hooks/useBids';
import { useApproveMilestone, useDisputeMilestone, useEscrowOnboard, useEscrowOnboardStatus, useEscrowPayment, useFundEscrowFromJob, useSubmitMilestone } from '@/hooks/useEscrow';
import { useJob } from '@/hooks/useJobs';
import type { Bid, EscrowMilestone } from '@/lib/api/types';
import { type EscrowPaymentStatus, buildEscrowSummary } from '@/lib/escrow/escrow-summary';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';

interface EscrowScreenProps {
  jobId: string;
}

function CenteredMessage({ children, tone = 'muted' }: { children: string; tone?: 'muted' | 'danger' }) {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text selectable className={`text-center ${tone === 'danger' ? 'text-danger' : 'text-foreground/60'}`}>
        {children}
      </Text>
    </View>
  );
}

export function EscrowScreen({ jobId }: EscrowScreenProps) {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);
  const userId = useAuthStore((state) => state.user?.id);
  const isInvestor = role === 'INVESTOR';
  const isContractor = role === 'CONTRACTOR';

  const jobQuery = useJob(jobId);
  const bidsQuery = useBids(jobId, { enabled: isInvestor });
  const myBidQuery = useMyBid(jobId, { enabled: isContractor });
  const escrowPaymentQuery = useEscrowPayment(jobId);
  const onboardStatusQuery = useEscrowOnboardStatus();
  const escrowOnboard = useEscrowOnboard();
  const fundEscrow = useFundEscrowFromJob();
  const submitMilestone = useSubmitMilestone();
  const approveMilestone = useApproveMilestone();
  const disputeMilestone = useDisputeMilestone();

  const [isFunding, setIsFunding] = React.useState(false);

  const acceptedBid = React.useMemo<Bid | null>(() => {
    if (isInvestor) {
      const bids = bidsQuery.data?.bids ?? [];
      return bids.find((bid) => bid.status === 'ACCEPTED') ?? null;
    }
    return myBidQuery.data?.status === 'ACCEPTED' ? myBidQuery.data : null;
  }, [bidsQuery.data, isInvestor, myBidQuery.data]);

  const escrowPayment = escrowPaymentQuery.data ?? null;

  const isBidLoading = isInvestor ? bidsQuery.isLoading : myBidQuery.isLoading;
  const isLoading = jobQuery.isLoading || isBidLoading || escrowPaymentQuery.isLoading;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text selectable className="mt-4 text-foreground/60">
          Preparing escrow details…
        </Text>
      </View>
    );
  }

  if (jobQuery.isError || !jobQuery.data) {
    return <CenteredMessage tone="danger">Failed to load escrow for this job. Please try again later.</CenteredMessage>;
  }

  const job = jobQuery.data;
  const ownerId = job.investorId ?? job.investor?.id ?? job.postedById;
  const isOwner = !!userId && ownerId === userId;
  const isAwardedContractor =
    !!userId && (job.awardedContractorId === userId || acceptedBid?.contractorId === userId);

  if (!((isInvestor && isOwner) || (isContractor && isAwardedContractor))) {
    return <CenteredMessage tone="danger">You don&apos;t have access to this escrow.</CenteredMessage>;
  }

  if (job.status !== 'AWARDED' || !acceptedBid) {
    return <CenteredMessage>Escrow opens once a bid is accepted.</CenteredMessage>;
  }

  const investorName = [job.investor?.firstName, job.investor?.lastName].filter(Boolean).join(' ');
  const summary = buildEscrowSummary(acceptedBid, escrowPayment, { investorName });
  const escrowStatus: EscrowPaymentStatus = escrowPayment?.status ?? 'PENDING';

  const onboardStatus = onboardStatusQuery.data;

  function handleSubmitMilestone(milestone: EscrowMilestone) {
    Alert.alert('Submit milestone', 'Mark this milestone as complete and submit for review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () => {
          submitMilestone.mutate(
            { jobId, milestoneId: milestone.id },
            {
              onSuccess: () => Alert.alert('Submitted', 'Milestone submitted for investor review.'),
              onError: (error) => Alert.alert('Submit failed', error instanceof Error ? error.message : 'Please try again.'),
            }
          );
        },
      },
    ]);
  }

  function handleApproveMilestone(milestone: EscrowMilestone) {
    Alert.alert('Approve milestone', 'This will release funds for this milestone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: () => {
          approveMilestone.mutate(
            { jobId, milestoneId: milestone.id },
            {
              onSuccess: () => Alert.alert('Approved', 'Milestone approved and funds released.'),
              onError: (error) => Alert.alert('Approval failed', error instanceof Error ? error.message : 'Please try again.'),
            }
          );
        },
      },
    ]);
  }

  function handleDisputeMilestone(milestone: EscrowMilestone) {
    Alert.alert('Dispute milestone', 'Are you sure you want to dispute this milestone?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Dispute',
        style: 'destructive',
        onPress: () => {
          disputeMilestone.mutate(
            { jobId, milestoneId: milestone.id, input: { reason: 'Disputed by investor' } },
            {
              onSuccess: () => Alert.alert('Disputed', 'Milestone has been disputed.'),
              onError: (error) => Alert.alert('Dispute failed', error instanceof Error ? error.message : 'Please try again.'),
            }
          );
        },
      },
    ]);
  }

  async function handleFund() {
    if (!onboardStatus?.hasAccount) {
      Alert.alert(
        'Escrow account required',
        'You need to set up your Escrow.com account before funding this job.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Set up account',
            onPress: async () => {
              escrowOnboard.mutate(undefined, {
                onSuccess: (result) => {
                  Alert.alert(
                    'Account created',
                    `${result.message}\n\nAfter setting your password, return here to fund the job.`
                  );
                },
                onError: () => {
                  Alert.alert('Setup failed', 'Could not create Escrow.com account. Please try again.');
                },
              });
            },
          },
        ]
      );
      return;
    }

    setIsFunding(true);
    fundEscrow.mutate(
      { jobId, input: { milestones: [] } },
      {
        onSuccess: (result) => {
          setIsFunding(false);
          if (result.paymentUrl) {
            WebBrowser.openBrowserAsync(result.paymentUrl);
          } else {
            Alert.alert('Escrow funded', 'Your funds have been secured in escrow.');
          }
        },
        onError: (error) => {
          setIsFunding(false);
          Alert.alert('Could not fund escrow', error instanceof Error ? error.message : 'Please try again.');
        },
      }
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-background"
      contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <EscrowHero title={job.title} status={escrowStatus} photoUri={job.photos?.[0]} />
      <EscrowSummaryCard summary={summary} />
      <PaymentSchedule
        milestones={summary.milestones}
        jobId={jobId}
        onSubmitMilestone={isContractor && escrowPayment ? handleSubmitMilestone : undefined}
        onApproveMilestone={isInvestor && escrowPayment ? handleApproveMilestone : undefined}
        onDisputeMilestone={isInvestor && escrowPayment ? handleDisputeMilestone : undefined}
      />

      {isInvestor && !escrowPayment ? (
        <EscrowOrderTotal
          summary={summary}
          isFunding={isFunding || fundEscrow.isPending}
          isSecured={false}
          onFund={handleFund}
          onReviewAgreement={() => router.push(`/agreements/${jobId}` as never)}
          onboardStatus={onboardStatus}
          isOnboarding={escrowOnboard.isPending}
        />
      ) : null}

      {escrowPayment ? (
        <EscrowProtectionStatus summary={summary} payment={escrowPayment} />
      ) : null}

      <EscrowSupportCard />
    </ScrollView>
  );
}
