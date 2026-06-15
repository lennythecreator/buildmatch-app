import BidCard from "@/components/bid-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBids, useCreateBid, useMyBid } from "@/hooks/useBids";
import { useCancelJob, useJob } from "@/hooks/useJobs";
import { ApiError } from "@/lib/api/client";
import { useAuthStore } from "@/store/auth";
import {
  IconCalendar,
  IconCash,
  IconDotsVertical,
  IconFileText,
  IconHistory,
  IconMapPin,
  IconPencil,
  IconShieldCheck,
  IconTrash
} from "@tabler/icons-react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

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

const MIN_BID_MESSAGE_LENGTH = 50;

export default function JobDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const userRole = useAuthStore((state) => state.user?.role);
  const userId = useAuthStore((state) => state.user?.id);
  const isContractor = userRole === "CONTRACTOR";
  const [bidAmount, setBidAmount] = React.useState("");
  const [bidMessage, setBidMessage] = React.useState("");
  const [menuVisible, setMenuVisible] = React.useState(false);
  const cancelJob = useCancelJob();

  const { data: job, isLoading: isJobLoading, isError: hasJobError } = useJob(jobId ?? "");
  const {
    data: bidsResponse,
    isLoading: isBidsLoading,
    isError: hasBidsError,
  } = useBids(jobId ?? "", { enabled: !isContractor });
  const { data: myBid, isLoading: isMyBidLoading } = useMyBid(jobId ?? "", { enabled: isContractor });
  const createBid = useCreateBid();

  const bids = bidsResponse?.bids ?? [];
  const activeBids = bids.filter((bid) => bid.status !== "WITHDRAWN");
  const withdrawnBids = bids.filter((bid) => bid.status === "WITHDRAWN");
  const canSubmitBid = isContractor && job?.status === "OPEN" && !myBid;
  const trimmedBidMessage = bidMessage.trim();
  const isBidMessageTooShort =
    trimmedBidMessage.length > 0 && trimmedBidMessage.length < MIN_BID_MESSAGE_LENGTH;

  React.useEffect(() => {
    if (job) {
      console.log("[job detail] ownership", {
        investorId: job.investorId,
        investorNestedId: job.investor?.id,
        currentUserId: userId,
      });
    }
  }, [job, userId]);

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

  // The backend owns jobs via `investorId` (exposed as a scalar and a nested
  // `investor` object); `postedById`/`postedBy` are legacy fallbacks.
  const ownerId = job.investorId ?? job.investor?.id ?? job.postedById ?? job.postedBy?.id;
  const isOwner = !!userId && ownerId === userId;

  function handleEditJob() {
    setMenuVisible(false);
    router.push({ pathname: "/post-job-manual", params: { jobId } });
  }

  function handleDeleteJob() {
    setMenuVisible(false);
    Alert.alert(
      "Delete this job?",
      "This cancels the job and notifies anyone who has bid. This can't be undone.",
      [
        { text: "Keep job", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            if (!jobId) return;
            cancelJob.mutate(jobId, {
              onSuccess: () => router.replace("/(tabs)/dashboard"),
              onError: (error) => {
                const message =
                  error instanceof ApiError ? error.message : "Please try again later.";
                Alert.alert("Could not delete job", message);
              },
            });
          },
        },
      ]
    );
  }

  function showBidError(error: unknown) {
    if (error instanceof ApiError) {
      const details = error.errors?.length ? `\n\n${error.errors.join("\n")}` : "";
      Alert.alert("Could not submit bid", `${error.message}${details}`);
      return;
    }

    Alert.alert("Could not submit bid", "Please check your bid amount and try again.");
  }

  function handleSubmitBid() {
    if (!jobId) {
      Alert.alert("Missing job", "We could not identify this job. Please go back and try again.");
      return;
    }

    const amount = Number(bidAmount);

    if (!amount || amount <= 0) {
      Alert.alert("Enter a bid amount", "Your bid amount must be greater than 0.");
      return;
    }

    if (trimmedBidMessage.length < MIN_BID_MESSAGE_LENGTH) {
      Alert.alert(
        "Add more proposal detail",
        `Your bid message must be at least ${MIN_BID_MESSAGE_LENGTH} characters so the developer understands your scope, timeline, or experience.`
      );
      return;
    }

    createBid.mutate(
      {
        jobId,
        input: {
          amount,
          message: trimmedBidMessage,
        },
      },
      {
        onSuccess: () => {
          setBidAmount("");
          setBidMessage("");
          Alert.alert("Bid submitted", "Your proposal was sent to the developer.");
        },
        onError: showBidError,
      }
    );
  }

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
          headerLeft: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go to dashboard"
              className="-ml-2 px-2 py-2"
              onPress={() => router.replace("/(tabs)/dashboard")}
            >
              <Text className="text-base font-semibold text-accent">Dashboard</Text>
            </Pressable>
          ),
          headerRight: () =>
            isOwner ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Job options"
                className="-mr-2 p-2"
                onPress={() => setMenuVisible(true)}
              >
                <IconDotsVertical size={24} color="#0f172a" />
              </Pressable>
            ) : null,
        }}
      />

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setMenuVisible(false)}
        >
          <View className="rounded-t-3xl bg-white pb-8 pt-2">
            <View className="items-center py-2">
              <View className="h-1.5 w-12 rounded-full bg-slate-200" />
            </View>
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-3 px-6 py-4 active:bg-slate-50"
              onPress={handleEditJob}
            >
              <IconPencil size={22} color="#0f172a" />
              <Text className="text-base font-semibold text-slate-900">Edit job</Text>
            </Pressable>
            <View className="mx-6 h-px bg-slate-100" />
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-3 px-6 py-4 active:bg-red-50"
              onPress={handleDeleteJob}
            >
              <IconTrash size={22} color="#dc2626" />
              <Text className="text-base font-semibold text-danger">Delete job</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

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

        {job.status === "AWARDED" ? (
          <View className="mt-2 gap-3">
            <Button
              variant="primary"
              onPress={() => router.push(`/agreements/${jobId}` as never)}
            >
              <View className="flex-row items-center justify-center gap-2">
                <IconFileText size={18} color="#ffffff" />
                <Text className="font-semibold text-accent-foreground">Project agreement</Text>
              </View>
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push(`/escrow/${jobId}` as never)}
            >
              <View className="flex-row items-center justify-center gap-2">
                <IconShieldCheck size={18} color="#00264d" />
                <Text className="font-semibold text-foreground">
                  {isContractor ? "View escrow" : "Fund escrow"}
                </Text>
              </View>
            </Button>
          </View>
        ) : null}
      </View>

      {/* Description Card */}
      <View className="rounded-3xl bg-white p-8 shadow-sm shadow-slate-200/50">
        <Text selectable className="text-base leading-relaxed text-slate-600">
          {job.description}
        </Text>
      </View>

      {/* Photos */}
      {job.photos && job.photos.length > 0 ? (
        <View className="gap-3">
          <Text selectable className="text-base font-bold uppercase tracking-widest text-slate-500">
            Photos
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {job.photos.map((uri, index) => (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={{ width: 240, height: 180, borderRadius: 20 }}
                contentFit="cover"
                transition={150}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      {isContractor ? (
        <View className="gap-4 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
          <Text selectable className="text-2xl font-extrabold text-slate-900">
            Your Bid
          </Text>
          {isMyBidLoading ? (
            <View className="items-center justify-center py-4">
              <ActivityIndicator />
              <Text selectable className="mt-3 text-sm text-slate-500">
                Checking your bid status...
              </Text>
            </View>
          ) : myBid ? (
            <BidCard bid={myBid} viewAs="contractor" />
          ) : canSubmitBid ? (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-slate-700">Bid Amount</Text>
                <TextInput
                  value={bidAmount}
                  onChangeText={setBidAmount}
                  keyboardType="numeric"
                  placeholder="25000"
                  placeholderTextColor="#94a3b8"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
                />
              </View>
              <View className="gap-2">
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="text-sm font-semibold text-slate-700">Message</Text>
                  <Text
                    className={`text-xs font-medium ${
                      isBidMessageTooShort ? "text-danger" : "text-slate-500"
                    }`}
                  >
                    {Math.min(trimmedBidMessage.length, MIN_BID_MESSAGE_LENGTH)}/
                    {MIN_BID_MESSAGE_LENGTH} min
                  </Text>
                </View>
                <TextInput
                  value={bidMessage}
                  onChangeText={setBidMessage}
                  multiline
                  placeholder="Share your timeline, approach, or relevant experience."
                  placeholderTextColor="#94a3b8"
                  className="min-h-[96px] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900"
                  style={{ textAlignVertical: "top" }}
                />
                <Text
                  selectable
                  className={`text-xs leading-5 ${
                    isBidMessageTooShort ? "text-danger" : "text-slate-500"
                  }`}
                >
                  Proposal messages must be at least {MIN_BID_MESSAGE_LENGTH} characters.
                </Text>
              </View>
              <Button
                variant="primary"
                isLoading={createBid.isPending}
                onPress={handleSubmitBid}
              >
                Submit bid
              </Button>
            </View>
          ) : (
            <Text selectable className="text-sm leading-6 text-slate-500">
              Bidding is only available while this job is open.
            </Text>
          )}
        </View>
      ) : null}

      {/* Bids Section */}
      {!isContractor ? (
      <View className="mt-4 gap-6">
        <View className="flex-row items-center justify-between gap-3">
          <Text selectable className="text-[28px] font-extrabold text-slate-900">
            All Bids
          </Text>
          {bids.length > 0 ? (
            <Button
              variant="secondary"
              size="sm"
              onPress={() => router.push({ pathname: "/job/[id]/bids", params: { id: jobId } })}
            >
              Compare bids
            </Button>
          ) : null}
        </View>

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
          <View className="gap-6">
            <View className="gap-4">
              <View className="flex-row items-center justify-between">
                <Text selectable className="text-base font-bold uppercase tracking-widest text-slate-500">
                  Active Bids
                </Text>
                <Text selectable className="text-sm text-slate-500">
                  {activeBids.length}
                </Text>
              </View>

              {activeBids.length > 0 ? (
                <View className="gap-4">
                  {activeBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} viewAs="investor" />
                  ))}
                </View>
              ) : (
                <View className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8">
                  <Text selectable className="text-sm text-slate-500">
                    No active bids right now.
                  </Text>
                </View>
              )}
            </View>

            {withdrawnBids.length > 0 ? (
              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <Text selectable className="text-base font-bold uppercase tracking-widest text-slate-500">
                    Withdrawn Bids
                  </Text>
                  <Text selectable className="text-sm text-slate-500">
                    {withdrawnBids.length}
                  </Text>
                </View>

                <View className="gap-4 opacity-90">
                  {withdrawnBids.map((bid) => (
                    <BidCard key={bid.id} bid={bid} viewAs="investor" />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
      ) : null}

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
