import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { logDisputeDebug } from '@/lib/debug/dispute-debug';
import { useDisputeEligibleJobs } from '@/hooks/useDisputeEligibleJobs';
import { useCreateDispute } from '@/hooks/useDisputes';
import { useAuthStore } from '@/store/auth';
import type { DisputeCategory } from '@/lib/api/types';

type DisputeCategoryOptionId =
  | 'INCOMPLETE_WORK'
  | 'WORK_NOT_STARTED'
  | 'QUALITY_ISSUES'
  | 'TIMELINE_BREACH'
  | 'PAYMENT_DISPUTE'
  | 'SCOPE_CREEP'
  | 'COMMUNICATION_BREAKDOWN'
  | 'OTHER';

const categoryOptions: {
  id: DisputeCategoryOptionId;
  value: DisputeCategory;
  label: string;
  description: string;
}[] = [
  { id: 'INCOMPLETE_WORK', value: 'POOR_QUALITY', label: 'Incomplete Work', description: 'Work was started but not finished' },
  { id: 'WORK_NOT_STARTED', value: 'WORK_NOT_STARTED', label: 'Work Not Started', description: 'Contractor did not begin the job' },
  { id: 'QUALITY_ISSUES', value: 'POOR_QUALITY', label: 'Quality Issues', description: 'Work does not meet required standards' },
  { id: 'TIMELINE_BREACH', value: 'OTHER', label: 'Timeline Breach', description: 'Work not completed by agreed deadline' },
  { id: 'PAYMENT_DISPUTE', value: 'PAYMENT_ISSUE', label: 'Payment Dispute', description: 'Disagreement over payment amounts' },
  { id: 'SCOPE_CREEP', value: 'OTHER', label: 'Scope Creep', description: 'Work expanded beyond original scope' },
  { id: 'COMMUNICATION_BREAKDOWN', value: 'OTHER', label: 'Communication Breakdown', description: 'Contractor became unresponsive' },
  { id: 'OTHER', value: 'OTHER', label: 'Other', description: 'Another issue not listed above' },
];

const stepLabels = ['Select Job', 'Dispute Details', 'Preview'];

function formatCurrency(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function getCategoryOption(optionId: DisputeCategoryOptionId) {
  return categoryOptions.find((option) => option.id === optionId) ?? categoryOptions[categoryOptions.length - 1];
}

export default function NewDispute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isIOS = process.env.EXPO_OS === 'ios';
  const [step, setStep] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [category, setCategory] = useState<DisputeCategoryOptionId>('OTHER');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');

  const userId = useAuthStore((state) => state.user?.id);
  const userRole = useAuthStore((state) => state.user?.role);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const { eligibleJobs, isLoading: isLoadingJobs } = useDisputeEligibleJobs();
  const createDisputeMutation = useCreateDispute();

  const selectedCategory = getCategoryOption(category);
  const selectedJob = eligibleJobs.find((job) => job.id === selectedJobId);
  const parsedAmount = Number(amount);
  const isStep1Valid = Boolean(selectedJobId);
  const isStep2Valid = parsedAmount > 0 && description.trim().length > 0 && desiredOutcome.trim().length > 0;
  const isFormReady = isStep1Valid && isStep2Valid;
  const selectionCopy =
    userRole === 'CONTRACTOR' ? 'Choose a job awarded to you.' : 'Choose a job you posted.';
  const emptyStateCopy =
    userRole === 'CONTRACTOR'
      ? 'You need an awarded job before you can file a dispute.'
      : 'You need a posted job before you can file a dispute.';

  logDisputeDebug('NewDispute.render', {
    userId,
    userRole,
    isAuthLoading,
    isLoadingJobs,
    eligibleJobsCount: eligibleJobs.length,
    eligibleJobIds: eligibleJobs.map((job) => job.id),
    selectedJobId,
    step,
  });

  function handleBack() {
    if (step > 1) {
      setStep((currentStep) => currentStep - 1);
      return;
    }

    router.back();
  }

  function handleNext() {
    if (step === 1 && !isStep1Valid) {
      return;
    }

    if (step === 2 && !isStep2Valid) {
      return;
    }

    setStep((currentStep) => Math.min(currentStep + 1, 3));
  }

  function handleSubmit() {
    if (!isFormReady) {
      return;
    }

    createDisputeMutation.mutate(
      {
        jobId: selectedJobId,
        category: selectedCategory.value,
        amountDisputed: parsedAmount,
        description: description.trim(),
        desiredOutcome: desiredOutcome.trim(),
      },
      {
        onSuccess: (newDispute) => {
          router.replace(`/disputes/${newDispute.id}`);
        },
      }
    );
  }

  function renderLoadingState(message: string) {
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <ActivityIndicator size="large" color="#00264d" />
        <Text className="mt-4 text-sm font-medium text-muted-foreground" selectable>
          {message}
        </Text>
      </View>
    );
  }

  if (isAuthLoading) {
    return renderLoadingState('Loading your account...');
  }

  if (!userId) {
    return (
      <View className="flex-1 items-center justify-center px-6 bg-background" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Text className="text-center text-lg font-bold text-foreground" selectable>
          You need to be signed in
        </Text>
        <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground" selectable>
          We could not identify your account, so the filing form cannot continue safely.
        </Text>
        <Button className="mt-6 w-full" onPress={() => router.replace('/(auth)/login')}>
          Log In
        </Button>
      </View>
    );
  }

  if (isLoadingJobs) {
    return renderLoadingState('Loading your jobs...');
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Stack.Screen options={{ title: 'File Dispute' }} />

      <KeyboardAvoidingView className="flex-1" behavior={isIOS ? 'padding' : undefined}>
        <ScrollView
          className="flex-1"
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 }}
        >
          <Card className="gap-4">
            <View className="gap-2">
              <Text className="text-xl font-bold text-foreground" selectable>
                File a dispute
              </Text>
              <Text className="text-sm leading-5 text-muted-foreground" selectable>
                Walk through the job, the issue, and the final review before submitting.
              </Text>
            </View>

            <View className="flex-row gap-2">
              {stepLabels.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = step === stepNumber;
                const isComplete = step > stepNumber;

                return (
                  <View
                    key={label}
                    className={`flex-1 rounded-2xl border p-3 ${
                      isActive ? 'border-accent bg-accent/10' : isComplete ? 'border-border bg-surface' : 'border-border bg-background'
                    }`}
                  >
                    <Text className={`text-xs font-semibold ${isActive ? 'text-accent' : 'text-muted-foreground'}`} selectable>
                      {stepNumber}
                    </Text>
                    <Text className="mt-1 text-sm font-semibold text-foreground" numberOfLines={1} selectable>
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>

          {step === 1 ? (
            <Card className="gap-4">
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground" selectable>
                  Select Job
                </Text>
                <Text className="text-sm leading-5 text-muted-foreground" selectable>
                  {selectionCopy}
                </Text>
              </View>

              {eligibleJobs.length === 0 ? (
                <View className="rounded-2xl border border-dashed border-border bg-background px-4 py-6">
                  <Text className="text-center text-base font-semibold text-foreground" selectable>
                    No eligible jobs found
                  </Text>
                  <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground" selectable>
                    {emptyStateCopy}
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {eligibleJobs.map((job) => {
                    const isSelected = selectedJobId === job.id;

                    return (
                      <Pressable key={job.id} onPress={() => setSelectedJobId(job.id)}>
                        <View
                          className={`rounded-2xl border p-4 ${isSelected ? 'border-accent bg-accent/10' : 'border-border bg-surface'}`}
                        >
                          <View className="flex-row items-start justify-between gap-3">
                            <View className="flex-1 gap-1">
                              <Text className="text-base font-semibold text-foreground" selectable numberOfLines={2}>
                                {job.title}
                              </Text>
                              <Text className="text-sm text-muted-foreground" selectable>
                                {job.city}, {job.state}
                              </Text>
                            </View>

                            <View className="rounded-full bg-muted px-3 py-1">
                              <Text className="text-xs font-medium text-foreground" selectable>
                                {job.status}
                              </Text>
                            </View>
                          </View>

                          <Text className="mt-3 text-sm font-medium text-foreground" selectable>
                            Budget: ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </Card>
          ) : null}

          {step === 2 ? (
            <Card className="gap-5">
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground" selectable>
                  Dispute Details
                </Text>
                <Text className="text-sm leading-5 text-muted-foreground" selectable>
                  Add the category, amount, and a clear explanation of the issue.
                </Text>
              </View>

              <View className="gap-3">
                <Text className="text-sm font-semibold text-foreground" selectable>
                  Category
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {categoryOptions.map((option) => {
                    const isSelected = category === option.id;

                    return (
                      <Pressable key={option.id} onPress={() => setCategory(option.id)} className="w-[48%]">
                        <View
                          className={`rounded-2xl border p-4 ${isSelected ? 'border-accent bg-accent/10' : 'border-border bg-background'}`}
                        >
                          <Text className="text-base font-semibold text-foreground" selectable>
                            {option.label}
                          </Text>
                          <Text className="mt-1 text-sm leading-5 text-muted-foreground" selectable>
                            {option.description}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground" selectable>
                  Amount Disputed
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="5000"
                  placeholderTextColor="#94a3b8"
                  className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground" selectable>
                  What happened?
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                  placeholder="Describe what went wrong..."
                  placeholderTextColor="#94a3b8"
                  className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground"
                  style={{ minHeight: 120, textAlignVertical: 'top' }}
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-semibold text-foreground" selectable>
                  Desired Outcome
                </Text>
                <TextInput
                  value={desiredOutcome}
                  onChangeText={setDesiredOutcome}
                  multiline
                  numberOfLines={4}
                  placeholder="What resolution are you requesting?"
                  placeholderTextColor="#94a3b8"
                  className="rounded-2xl border border-border bg-surface px-4 py-3 text-foreground"
                  style={{ minHeight: 96, textAlignVertical: 'top' }}
                />
              </View>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card className="gap-4">
              <View className="gap-2">
                <Text className="text-lg font-bold text-foreground" selectable>
                  Preview
                </Text>
                <Text className="text-sm leading-5 text-muted-foreground" selectable>
                  Review everything before submitting the dispute.
                </Text>
              </View>

              <View className="gap-3 rounded-2xl bg-background p-4">
                <View className="gap-1">
                  <Text className="text-xs font-medium text-muted-foreground" selectable>
                    Job
                  </Text>
                  <Text className="text-base font-semibold text-foreground" selectable>
                    {selectedJob?.title ?? 'Unknown job'}
                  </Text>
                </View>

                <View className="gap-1">
                  <Text className="text-xs font-medium text-muted-foreground" selectable>
                    Category
                  </Text>
                  <Text className="text-base font-semibold text-foreground" selectable>
                    {selectedCategory.label}
                  </Text>
                </View>

                <View className="gap-1">
                  <Text className="text-xs font-medium text-muted-foreground" selectable>
                    Amount Disputed
                  </Text>
                  <Text className="text-base font-semibold text-foreground" selectable>
                    {parsedAmount > 0 ? formatCurrency(parsedAmount) : '$0'}
                  </Text>
                </View>

                <View className="gap-1">
                  <Text className="text-xs font-medium text-muted-foreground" selectable>
                    What happened?
                  </Text>
                  <Text className="text-sm leading-6 text-foreground" selectable>
                    {description.trim()}
                  </Text>
                </View>

                <View className="gap-1">
                  <Text className="text-xs font-medium text-muted-foreground" selectable>
                    Desired outcome
                  </Text>
                  <Text className="text-sm leading-6 text-foreground" selectable>
                    {desiredOutcome.trim()}
                  </Text>
                </View>
              </View>

              <Text className="text-xs leading-5 text-muted-foreground" selectable>
                Submission will create the dispute and route it into the handling flow.
              </Text>
            </Card>
          ) : null}

          <View className="gap-3">
            {step < 3 ? (
              <Button onPress={handleNext} disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}>
                Next
              </Button>
            ) : (
              <Button onPress={handleSubmit} isLoading={createDisputeMutation.isPending} disabled={!isFormReady || createDisputeMutation.isPending}>
                Submit Dispute
              </Button>
            )}

            <Button variant="secondary" onPress={handleBack}>
              {step > 1 ? 'Back' : 'Cancel'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
