import React, { Component, ReactNode, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react-native';
import { DisputeTabs } from '@/components/disputes/dispute-tabs';
import { DisputeCard } from '@/components/disputes/dispute-card';
import { logDisputeDebug } from '@/lib/debug/dispute-debug';
import { useDisputeTabCounts } from '@/hooks/useDisputes';
import { useScopedDisputes, type ScopedDisputeTabId } from '@/hooks/useScopedDisputes';
import { useAuthStore } from '@/store/auth';
import type { Dispute } from '@/lib/api/types';

interface DisputeRowBoundaryProps {
  dispute: Dispute;
  children: ReactNode;
}

interface DisputeRowBoundaryState {
  hasError: boolean;
  errorMessage?: string;
}

class DisputeRowBoundary extends Component<DisputeRowBoundaryProps, DisputeRowBoundaryState> {
  constructor(props: DisputeRowBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DisputeRowBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error) {
    logDisputeDebug('DisputeRowBoundary.error', {
      disputeId: this.props.dispute.id,
      error: error.message,
      status: this.props.dispute.status,
      title: this.props.dispute.jobTitle,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="mx-4 mb-4 rounded-2xl border border-red-500 bg-red-100 px-4 py-4">
          <Text className="text-base font-bold text-red-800">Dispute card failed to render</Text>
          <Text className="mt-2 text-sm text-red-800">ID: {this.props.dispute.id}</Text>
          <Text className="mt-1 text-sm text-red-800">
            Title: {this.props.dispute.jobTitle || 'Untitled dispute'}
          </Text>
          <Text className="mt-1 text-sm text-red-800">
            Error: {this.state.errorMessage || 'Unknown render failure'}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error';
}

export function DisputesListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<ScopedDisputeTabId>('ALL');
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);

  const {
    data: tabCounts,
    isError: isTabCountsError,
    error: tabCountsError,
  } = useDisputeTabCounts();
  const {
    disputes,
    isLoading,
    isError: isDisputesError,
    error: disputesError,
    refetch: refetchDisputes,
  } = useScopedDisputes(activeTab);
  const hasQueryError = isDisputesError || isTabCountsError;
  const errorMessage = getErrorMessage(disputesError) || getErrorMessage(tabCountsError);

  logDisputeDebug('DisputesListScreen.render', {
    userId: user?.id,
    activeTab,
    isAuthLoading,
    isLoading,
    isDisputesError,
    disputesError,
    isTabCountsError,
    tabCountsError,
    disputeCount: disputes.length,
    disputeIds: disputes.map((dispute) => dispute.id),
    tabCounts,
  });

  if (isAuthLoading) {
    return (
      <SafeAreaView className="h-full bg-background">
        <View className="h-full items-center justify-center px-6">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-sm font-medium text-muted-foreground">Loading your disputes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView className="h-full bg-background">
        <View className="h-full items-center justify-center px-6">
          <Text className="text-center text-lg font-bold text-foreground">You need to be signed in</Text>
          <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground">
            We could not determine your account, so disputes cannot be loaded safely.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-background">
      <View className="px-4 py-4 flex-row justify-between items-center bg-surface border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Disputes</Text>
        <View className="flex-row gap-2">
          <Button onPress={() => router.push('/disputes/test-cards')} size="sm" variant="secondary">
            <Text className="font-medium text-foreground">Test Cards</Text>
          </Button>
          <Button onPress={() => router.push('/disputes/new')} size="sm">
            <IconPlus size={18} color="#ffffff" className="mr-1" />
            <Text className="text-white font-medium">File Dispute</Text>
          </Button>
        </View>
      </View>

      <DisputeTabs 
        activeTab={activeTab} 
        onTabChange={(tabId) => setActiveTab(tabId as ScopedDisputeTabId)} 
        counts={tabCounts} 
      />

      {isLoading ? (
        <View className="h-full justify-center items-center px-4 py-20 bg-surface">
          <ActivityIndicator size="large" color="#3b82f6" className="mb-4" />
          <Text className="text-muted-foreground">Loading disputes...</Text>
        </View>
      ) : hasQueryError ? (
        <View className="h-full justify-center px-4 py-10 bg-surface">
          <View className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5">
            <Text className="text-lg font-bold text-red-700">Unable to load disputes</Text>
            <Text className="mt-2 text-sm leading-5 text-red-700">
              {errorMessage || 'The disputes request failed before any items could render.'}
            </Text>
            <Text className="mt-4 text-xs leading-5 text-red-700">
              User: {user.id}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-red-700">
              Tab: {activeTab}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-red-700">
              Tab counts error: {isTabCountsError ? 'yes' : 'no'}
            </Text>
            <Text className="mt-1 text-xs leading-5 text-red-700">
              Disputes error: {isDisputesError ? 'yes' : 'no'}
            </Text>
            <View className="mt-4 flex-row gap-2">
              <Button onPress={() => refetchDisputes()} size="sm">
                <Text className="text-white font-medium">Retry</Text>
              </Button>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={disputes}
          keyExtractor={(item, index) => item.id || `dispute-${index}`}
          renderItem={({ item }) => (
            <DisputeRowBoundary dispute={item}>
              <View className="mx-4 mb-4">
                <DisputeCard dispute={item} />
              </View>
            </DisputeRowBoundary>
          )}
          className="h-full bg-white"
          contentContainerStyle={{
            paddingTop: 16,
            paddingBottom: Math.max(insets.bottom + 24, 32),
          }}
          ListEmptyComponent={() => (
            <View className="h-full px-4 py-20 items-center justify-center">
              <Text className="text-lg font-bold text-foreground mb-2">No disputes found</Text>
              <Text className="text-sm text-muted-foreground text-center px-6">
                You don&apos;t have any disputes matching this status. Everything is running smoothly!
              </Text>
              <View className="mt-5 w-full rounded-2xl border border-border bg-background px-4 py-4">
                <Text className="text-sm font-semibold text-foreground">Debug details</Text>
                <Text className="mt-2 text-xs leading-5 text-muted-foreground">
                  User ID: {user.id}
                </Text>
                <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                  Active tab: {activeTab}
                </Text>
                <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                  Loaded disputes: {disputes.length}
                </Text>
                <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                  Counts: {JSON.stringify(tabCounts ?? {})}
                </Text>
                <Text className="mt-1 text-xs leading-5 text-muted-foreground">
                  Check the metro/device console for `[dispute-debug]` entries from `getAllDisputes` and `useDisputes`.
                </Text>
                <View className="mt-4">
                  <Button onPress={() => refetchDisputes()} size="sm" variant="secondary">
                    <Text className="font-medium text-foreground">Refetch</Text>
                  </Button>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
