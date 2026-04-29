import BidCard from "@/components/bid-card";
import { Badge } from "@/components/ui/badge";
import { useBids } from "@/hooks/useBids";
import { useJob } from "@/hooks/useJobs";
import {
  IconCalendar,
  IconCash,
  IconDotsVertical,
  IconHistory,
  IconMapPin
} from "@tabler/icons-react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

function getStatusColor(status: string) {
  switch (status) {
    case "OPEN":
      return "success";
    case "AWARDED":
      return "primary";
    case "COMPLETED":
      return "secondary";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTradeType(tradeType: string) {
  return tradeType.replace(/_/g, " ");
}

function formatBidCount(count: number) {
  return `${count} ${count === 1 ? "bid" : "bids"}`;
}

export default function JobDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: job, isLoading: isJobLoading, isError: hasJobError } = useJob(jobId ?? "");
  const {
    data: bidsResponse,
    isLoading: isBidsLoading,
    isError: hasBidsError,
  } = useBids(jobId ?? "");

  const bids = bidsResponse?.bids ?? [];

  if (!jobId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Missing job id.
        </Text>
      </View>
    );
  }

  if (isJobLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text selectable className="mt-4 text-muted">
          Loading job details...
        </Text>
      </View>
    );
  }

  if (hasJobError || !job) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Failed to load this job. Please try again later.
        </Text>
      </View>
    );
  }

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-slate-50"
      contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: "Project Details",
          headerTitleAlign: "center",
          headerBackTitle: "",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#f8fafc' },
          headerRight: () => (
            <Pressable className="-mr-2 p-2">
              <IconDotsVertical size={24} color="#0f172a" />
            </Pressable>
          ),
        }}
      />

      <View className="gap-4">
        {/* Badges & Meta */}
        <View className="flex-row flex-wrap items-center gap-3">
          <Badge 
            color={job.status === 'OPEN' ? 'vibrant' : (getStatusColor(job.status) as any)} 
            variant={job.status === 'OPEN' ? 'solid' : 'solid'} 
            shape={job.status === 'OPEN' ? 'block' : 'pill'}
            size="md"
          >
            {job.status === 'OPEN' ? 'Open' : job.status}
          </Badge>
          
          <Badge color="slate" variant="solid" shape="block" size="md" classNames={{ text: 'tracking-wider font-semibold' }}>
            {formatTradeType(job.tradeType)}
          </Badge>
          
          <View className="ml-1 flex-row items-center gap-1.5">
            <IconHistory size={16} color="#000000" />
            <Text className="text-sm font-medium text-slate-900">
              {bids.length} {bids.length === 1 ? 'bid' : 'bids'}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text selectable className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
          {job.title}
        </Text>
      </View>

      {/* Description Card */}
      <View className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/50">
        <Text selectable className="text-base leading-relaxed text-slate-600">
          {job.description}
        </Text>
      </View>

      {/* Active Bids Section */}
      <View className="mt-4 gap-6">
        <Text selectable className="text-[28px] font-extrabold text-slate-900">
          Active Bids
        </Text>

        {isBidsLoading ? (
          <View className="items-center justify-center py-8">
            <ActivityIndicator />
            <Text selectable className="mt-3 text-sm text-slate-500">
              Loading bids...
            </Text>
          </View>
        ) : hasBidsError ? (
          <View className="rounded-3xl bg-red-50 p-4">
            <Text selectable className="text-sm text-danger">
              Failed to load bids for this job.
            </Text>
          </View>
        ) : bids.length === 0 ? (
          <View className="items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12">
            <View className="mt-2 rounded-full bg-slate-200 p-4">
              <IconCash size={32} color="#64748B" />
            </View>
            <View className="mb-2 items-center gap-2">
              <Text selectable className="text-[24px] font-bold text-slate-800">
                No bids yet
              </Text>
              <Text selectable className="px-2 text-center text-[15px] leading-relaxed text-slate-500">
                Contractors have not submitted proposals for this job yet. Check back soon or invite contractors to bid.
              </Text>
            </View>
          </View>
        ) : (
          <View className="gap-4">
            {bids.map((bid) => (
              <BidCard key={bid.id} bid={bid} viewAs="investor" />
            ))}
          </View>
        )}
      </View>

      {/* Details Card */}
      <View className="mt-4 gap-8 rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/50">
        <View className="gap-3">
          <Text selectable className="text-xs font-bold tracking-widest text-slate-500">
            EST. BUDGET RANGE
          </Text>
          <Text selectable className="text-3xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(job.budgetMin)} — {formatCurrency(job.budgetMax)}
          </Text>
        </View>

        <View className="flex-row items-center gap-5">
          <View className="rounded-[18px] bg-slate-100 p-3.5">
            <IconMapPin size={24} color="#059669" />
          </View>
          <View className="flex-1 gap-1">
            <Text selectable className="text-[11px] font-bold tracking-[0.15em] text-slate-500">
              LOCATION
            </Text>
            <Text selectable className="text-base font-bold text-slate-900">
              {job.city}, {job.state} {job.zipCode}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-5">
          <View className="rounded-[18px] bg-slate-100 p-3.5">
            <IconCalendar size={24} color="#059669" />
          </View>
          <View className="flex-1 gap-1">
            <Text selectable className="text-[11px] font-bold tracking-[0.15em] text-slate-500">
              POSTED DATE
            </Text>
            <Text selectable className="text-base font-bold text-slate-900">
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>
      
    </ScrollView>
  );
}
