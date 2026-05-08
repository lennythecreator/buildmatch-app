import BidCard from "@/components/bid-card";
import { Button } from "@/components/ui/button";
import { useAcceptBid, useBids } from "@/hooks/useBids";
import { useJob } from "@/hooks/useJobs";
import { ApiError } from "@/lib/api/client";
import type { Bid } from "@/lib/api/types";
import { useAuthStore } from "@/store/auth";
import { IconCash, IconCheck, IconFilter, IconSortDescending } from "@tabler/icons-react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

type SortMode = "recommended" | "lowest" | "highest" | "newest";

type RankedBid = {
  bid: Bid;
  score: number;
};

const SORT_OPTIONS: { label: string; value: SortMode }[] = [
  { label: "Best fit", value: "recommended" },
  { label: "Lowest bid", value: "lowest" },
  { label: "Highest bid", value: "highest" },
  { label: "Newest", value: "newest" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getComparisonScore(bidAmount: number, jobMin: number, jobMax: number, message?: string, createdAt?: string) {
  const range = Math.max(jobMax - jobMin, 1);
  const budgetFit = 1 - Math.min(1, Math.max(0, (bidAmount - jobMin) / range));
  const messageBonus = message?.trim().length ? 0.12 : 0;
  const ageDays = createdAt ? (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24) : 0;
  const recencyBonus = Math.max(0, 0.1 - ageDays * 0.01);
  return Math.round(budgetFit * 80 + (messageBonus + recencyBonus) * 100);
}

export default function BidComparisonScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const user = useAuthStore((state) => state.user);
  const isInvestor = user?.role === "INVESTOR";
  const [sortMode, setSortMode] = useState<SortMode>("recommended");
  const [selectedBidId, setSelectedBidId] = useState<string | null>(null);
  const { data: job, isLoading: isJobLoading, isError: hasJobError, error: jobError } = useJob(jobId ?? "");
  const { data: bidsResponse, isLoading: isBidsLoading, isError: hasBidsError } = useBids(jobId ?? "");
  const acceptBid = useAcceptBid();

  const bids = useMemo(() => bidsResponse?.bids ?? [], [bidsResponse]);
  const activeBids = useMemo(() => bids.filter((bid) => bid.status !== "WITHDRAWN"), [bids]);
  const withdrawnBids = useMemo(() => bids.filter((bid) => bid.status === "WITHDRAWN"), [bids]);

  const rankedBids = useMemo<RankedBid[]>(() => {
    const decorated = activeBids.map((bid) => ({
      bid,
      score: job
        ? getComparisonScore(bid.amount, job.budgetMin, job.budgetMax, bid.message, bid.createdAt)
        : 0,
    }));

    return [...decorated].sort((left, right) => {
      switch (sortMode) {
        case "lowest":
          return left.bid.amount - right.bid.amount;
        case "highest":
          return right.bid.amount - left.bid.amount;
        case "newest":
          return new Date(right.bid.createdAt).getTime() - new Date(left.bid.createdAt).getTime();
        case "recommended":
        default:
          return right.score - left.score;
      }
    });
  }, [activeBids, job, sortMode]);

  const bestBid = rankedBids[0]?.bid;
  const selectedBid = rankedBids.find((item) => item.bid.id === selectedBidId)?.bid ?? bestBid;
  const averageBid = activeBids.length ? activeBids.reduce((sum, bid) => sum + bid.amount, 0) / activeBids.length : 0;
  const lowestBid = activeBids.length ? Math.min(...activeBids.map((bid) => bid.amount)) : 0;
  const highestBid = activeBids.length ? Math.max(...activeBids.map((bid) => bid.amount)) : 0;

  useEffect(() => {
    if (!selectedBidId && bestBid) {
      setSelectedBidId(bestBid.id);
    }
  }, [bestBid, selectedBidId]);

  if (!jobId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Missing job id.
        </Text>
      </View>
    );
  }

  if (!isInvestor) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-lg font-bold text-foreground">
          Bid comparison is for developers.
        </Text>
        <Text selectable className="mt-2 text-center text-sm text-foreground/60">
          Contractors can view their own bid status, but only developers can compare and accept bids.
        </Text>
        <Button variant="primary" className="mt-6 w-full" onPress={() => router.back()}>
          Back
        </Button>
      </View>
    );
  }

  if (isJobLoading || isBidsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-sm font-medium text-foreground/60">
          Loading bid comparison...
        </Text>
      </View>
    );
  }

  const error = jobError instanceof ApiError ? jobError.message : hasJobError ? "Failed to load this job." : null;

  if (hasJobError || !job) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          {error || "Failed to load this job."}
        </Text>
      </View>
    );
  }

  const handleAcceptBid = (bidId: string) => {
    Alert.alert(
      "Accept this bid?",
      "This will award the job to this contractor and move the project forward.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => {
            acceptBid.mutate(
              { jobId, bidId },
              {
                onSuccess: () => {
                  Alert.alert("Bid accepted", "The job has been awarded.", [
                    { text: "View job", onPress: () => router.replace({ pathname: "/job/[id]", params: { id: jobId } }) },
                  ]);
                },
                onError: () => {
                  Alert.alert("Could not accept bid", "Please try again.");
                },
              }
            );
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
    >
      <Stack.Screen
        options={{
          title: "Compare Bids",
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          headerShadowVisible: false,
        }}
      />

      <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
        <View className="gap-2">
          <Text selectable className="text-2xl font-bold text-foreground">
            {job.title}
          </Text>
          <Text selectable className="text-sm text-foreground/60">
            {job.city}, {job.state} · {job.tradeType.replace(/_/g, " ")}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 rounded-2xl bg-background p-4">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Budget range</Text>
            <Text selectable className="mt-1 text-lg font-bold text-foreground">
              {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-background p-4">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Bids</Text>
            <Text selectable className="mt-1 text-lg font-bold text-foreground">
              {bids.length}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 rounded-2xl bg-background p-4">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Average bid</Text>
            <Text selectable className="mt-1 text-lg font-bold text-foreground">
              {formatCurrency(averageBid)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-background p-4">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Lowest</Text>
            <Text selectable className="mt-1 text-lg font-bold text-foreground">
              {formatCurrency(lowestBid)}
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-background p-4">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">Highest</Text>
            <Text selectable className="mt-1 text-lg font-bold text-foreground">
              {formatCurrency(highestBid)}
            </Text>
          </View>
        </View>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <IconSortDescending size={18} color="#64748B" />
            <Text className="text-base font-semibold text-foreground">Sort bids</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <IconFilter size={18} color="#64748B" />
            <Text className="text-sm text-foreground/50">Tap a bid to select it</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={sortMode === option.value ? "primary" : "secondary"}
              size="sm"
              onPress={() => setSortMode(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </ScrollView>
      </View>

      {hasBidsError ? (
        <View className="rounded-2xl border border-danger/20 bg-danger/5 p-4">
          <Text selectable className="text-sm text-danger">
            Failed to load bids for this job.
          </Text>
        </View>
      ) : null}

      {rankedBids.length > 0 ? (
        <View className="gap-4">
          {rankedBids.map(({ bid, score }, index) => (
            <BidCard
              key={bid.id}
              bid={bid}
              viewAs="investor"
              isSelected={selectedBid?.id === bid.id}
              isRecommended={index === 0 && sortMode === "recommended"}
              comparisonScore={score}
              onPress={() => setSelectedBidId(bid.id)}
              actionLabel={bid.status === "PENDING" ? "Accept bid" : undefined}
              onActionPress={() => handleAcceptBid(bid.id)}
            />
          ))}
        </View>
      ) : (
        <View className="items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-surface px-6 py-12">
          <IconCash size={28} color="#64748B" />
          <Text selectable className="text-center text-base font-semibold text-foreground">
            No active bids to compare yet.
          </Text>
          <Text selectable className="text-center text-sm text-foreground/60">
            Withdrawn bids are kept in the job history, but they cannot be selected here.
          </Text>
        </View>
      )}

      {withdrawnBids.length > 0 ? (
        <View className="gap-4 rounded-3xl border border-border bg-surface p-5">
          <View className="flex-row items-center justify-between">
            <Text selectable className="text-base font-bold uppercase tracking-widest text-slate-500">
              Withdrawn history
            </Text>
            <Text selectable className="text-sm text-slate-500">
              {withdrawnBids.length}
            </Text>
          </View>
          <Text selectable className="text-sm text-foreground/60">
            These bids were withdrawn and are shown only for reference.
          </Text>
        </View>
      ) : null}

      {selectedBid ? (
        <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
          <View className="flex-row items-center gap-2">
            <IconCheck size={18} color="#16A34A" />
            <Text className="text-base font-semibold text-foreground">Selected bid</Text>
          </View>
          <Text selectable className="text-sm text-foreground/60">
            {selectedBid.contractor?.firstName ?? "Contractor"} · {formatCurrency(selectedBid.amount)}
          </Text>
          <Button
            variant="primary"
            className="mt-1"
            onPress={() => handleAcceptBid(selectedBid.id)}
            isLoading={acceptBid.isPending}
          >
            Accept selected bid
          </Button>
        </View>
      ) : null}
    </ScrollView>
  );
}