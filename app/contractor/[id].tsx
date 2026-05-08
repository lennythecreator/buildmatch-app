import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateConversation, useMyJobs } from "@/hooks";
import { useContractor } from "@/hooks/useContractors";
import { useSavedContractorIds, useToggleSavedContractor } from "@/hooks/useSaved";
import type { ContractorProfile, ContractorSpecialty } from "@/lib/api/types";
import {
  IconClock,
  IconInfoCircle,
  IconMapPin,
  IconRosetteDiscountCheckFilled,
  IconStarFilled,
  IconUsers,
} from "@tabler/icons-react-native";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

function getContractorName(contractor?: ContractorProfile | null) {
  if (!contractor) {
    return "Contractor Profile";
  }

  const fullName = [contractor.user.firstName, contractor.user.lastName].filter(Boolean).join(" ").trim();

  return fullName || "Contractor Profile";
}

function getContractorInitials(contractor?: ContractorProfile | null) {
  if (!contractor) {
    return "BM";
  }

  const initials = [contractor.user.firstName, contractor.user.lastName]
    .filter(Boolean)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  return initials || "BM";
}

function formatSpecialtyLabel(specialty: ContractorSpecialty) {
  return specialty.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatLocation(contractor: ContractorProfile) {
  return [contractor.city, contractor.state].filter(Boolean).join(", ");
}

export default function ContractorDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const contractorId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: contractor, isLoading, isError } = useContractor(contractorId ?? "");
  const { data: myJobsResponse } = useMyJobs();
  const { data: savedIds } = useSavedContractorIds();
  const { mutate: toggleSavedContractor, isPending: isTogglingSaved } = useToggleSavedContractor();
  const createConversation = useCreateConversation();

  const contractorName = getContractorName(contractor);
  const contractorInitials = getContractorInitials(contractor);
  const location = contractor ? formatLocation(contractor) : "";
  const rating = typeof contractor?.averageRating === "number" ? contractor.averageRating.toFixed(1) : null;
  const reviewCount = typeof contractor?.totalReviews === "number" ? contractor.totalReviews : null;
  const yearsExperience = typeof contractor?.yearsExperience === "number" ? contractor.yearsExperience : null;
  const savedContractorId = contractor ? savedIds?.[contractor.id] : undefined;
  const isSaved = Boolean(savedContractorId);
  const specialties = contractor?.specialties ?? [];
  const hasBio = Boolean(contractor?.bio?.trim());
  const screenTitle = contractor ? contractorName : "Contractor Profile";
  const availableJobs = myJobsResponse?.jobs ?? [];

  function getMessagingJobId() {
    const prioritizedJob = availableJobs.find((job) => job.status === "OPEN" || job.status === "AWARDED");

    return prioritizedJob?.id ?? availableJobs[0]?.id ?? null;
  }

  async function handleMessageContractor() {
    if (!contractor?.userId) {
      return;
    }

    const jobId = getMessagingJobId();

    if (!jobId) {
      Alert.alert(
        "Create a job first",
        "You need a job before BuildMatch can open a conversation with this contractor.",
        [{ text: "OK" }]
      );
      return;
    }

    try {
      const conversation = await createConversation.mutateAsync({ jobId, recipientId: contractor.userId });
      router.push({ pathname: "/conversation/[id]", params: { id: conversation.id } });
    } catch {
      Alert.alert("Could not start conversation", "Please try again.");
    }
  }

  if (!contractorId) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Missing contractor id.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
        <Text selectable className="mt-4 text-sm font-medium text-muted">
          Loading contractor profile...
        </Text>
      </View>
    );
  }

  if (isError || !contractor) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text selectable className="text-center text-danger">
          Failed to load this contractor. Please try again later.
        </Text>
      </View>
    );
  }

  const metrics = [
    rating ? { key: "rating", label: "Rating", value: rating, icon: <IconStarFilled size={16} color="#F59E0B" /> } : null,
    reviewCount !== null
      ? {
          key: "reviews",
          label: "Reviews",
          value: reviewCount.toString(),
          icon: <IconUsers size={16} color="#64748B" />,
        }
      : null,
    yearsExperience !== null
      ? {
          key: "experience",
          label: "Experience",
          value: `${yearsExperience}y`,
          icon: <IconClock size={16} color="#00264d" />,
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; value: string; icon: React.ReactNode }>;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
    >
      <Stack.Screen
        options={{
          title: screenTitle,
          headerTitleAlign: "center",
          headerBackTitle: "Back",
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#F8FAFC" },
        }}
      />

      <View className="gap-4">
        <Card className="gap-5 rounded-3xl p-5 overflow-hidden">
          <View className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/10" />

          <View className="flex-row items-start gap-4">
            <View className="relative">
              <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface">
                {contractor.user.avatarUrl ? (
                  <Image source={{ uri: contractor.user.avatarUrl }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                ) : (
                  <Text className="text-xl font-bold text-foreground/70">{contractorInitials}</Text>
                )}
              </View>

              {contractor.isLicenseVerified ? (
                <View className="absolute -bottom-2 -right-2 rounded-full bg-background p-1 shadow-sm">
                  <IconRosetteDiscountCheckFilled size={18} color="#16A34A" />
                </View>
              ) : null}
            </View>

            <View className="flex-1 gap-3">
              <View className="flex-row items-start gap-2">
                <Text selectable className="flex-1 text-2xl font-bold tracking-tight text-foreground">
                  {contractorName}
                </Text>
                {contractor.isLicenseVerified ? <Badge color="success">Verified</Badge> : null}
              </View>

              {(rating || reviewCount !== null) ? (
                <View className="flex-row flex-wrap items-center gap-2">
                  {rating ? (
                    <View className="flex-row items-center gap-1.5">
                      <IconStarFilled size={16} color="#F59E0B" />
                      <Text selectable className="text-sm font-semibold text-foreground">
                        {rating}
                      </Text>
                    </View>
                  ) : null}
                  {reviewCount !== null ? (
                    <Text selectable className="text-sm text-foreground/60">
                      ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
                    </Text>
                  ) : null}
                </View>
              ) : null}

              {location ? (
                <View className="flex-row items-center gap-1.5">
                  <IconMapPin size={16} color="#6B7280" />
                  <Text selectable className="text-sm text-foreground/70">
                    {location}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {metrics.length > 0 ? (
            <View className="flex-row flex-wrap gap-3 border-t border-border pt-4">
              {metrics.map((metric) => (
                <View key={metric.key} className="min-w-24 flex-1 rounded-2xl bg-surface p-4">
                  <View className="flex-row items-center gap-1.5">
                    {metric.icon}
                    <Text className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
                      {metric.label}
                    </Text>
                  </View>
                  <Text selectable className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                    {metric.value}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}
        </Card>

        <Card className="gap-4 rounded-3xl p-5">
          <View className="flex-row items-center gap-2">
            <IconInfoCircle size={18} color="#64748B" />
            <Text className="text-lg font-bold text-foreground">About</Text>
          </View>
          {hasBio ? (
            <Text selectable className="text-sm leading-6 text-foreground/70">
              {contractor.bio}
            </Text>
          ) : (
            <Text selectable className="text-sm leading-6 text-foreground/45">
              This contractor has not added a bio yet.
            </Text>
          )}
        </Card>

        <Card className="gap-4 rounded-3xl p-5">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-lg font-bold text-foreground">Specialties</Text>
            {specialties.length > 0 ? <Text className="text-xs font-semibold uppercase tracking-widest text-foreground/40">{specialties.length} listed</Text> : null}
          </View>

          {specialties.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {specialties.map((specialty) => (
                <View key={specialty} className="rounded-full border border-border bg-surface px-3 py-2">
                  <Text selectable className="text-xs font-semibold text-foreground/70">
                    {formatSpecialtyLabel(specialty)}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text selectable className="text-sm leading-6 text-foreground/45">
              No specialties listed yet.
            </Text>
          )}
        </Card>

        <Card className="gap-4 rounded-3xl p-5">
          <View className="flex-row items-center justify-between gap-3">
            <Text className="text-lg font-bold text-foreground">Availability</Text>
            <Badge color={contractor.isAvailable ? "success" : "danger"} size="md" shape="pill" variant="solid">
              {contractor.isAvailable ? "Available now" : "Currently unavailable"}
            </Badge>
          </View>
          <Text selectable className="text-sm leading-6 text-foreground/70">
            {contractor.isAvailable
              ? "This contractor is currently accepting new work through the app."
              : "This contractor is not currently marked as available for new work."}
          </Text>
        </Card>

        <View className="gap-3 pt-1">
          <Button
            variant={isSaved ? "secondary" : "primary"}
            isLoading={isTogglingSaved}
            onPress={() => toggleSavedContractor(contractor.id)}
            className="rounded-2xl"
          >
            {isSaved ? "Saved" : "Save Contractor"}
          </Button>

          <Button
            variant="outline"
            isLoading={createConversation.isPending}
            onPress={handleMessageContractor}
            className="rounded-2xl border-border"
          >
            Message Contractor
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}