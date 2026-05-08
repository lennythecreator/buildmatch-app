import type { ContractorProfile, ContractorSpecialty } from "@/lib/api/types";
import {
  IconArrowRight,
  IconBookmark,
  IconMapPin,
  IconRosetteDiscountCheckFilled,
  IconStarFilled,
} from "@tabler/icons-react-native";
import React from "react";
import { Image, Pressable, Text, View, type GestureResponderEvent } from "react-native";

import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ContractorCardProps {
  contractor: ContractorProfile;
  onPress?: () => void;
  onViewProfile?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

function formatContractorName(contractor: ContractorProfile): string {
  const fullName = [contractor.user.firstName, contractor.user.lastName].filter(Boolean).join(" ").trim();

  return fullName || "Contractor";
}

function formatContractorInitials(contractor: ContractorProfile): string {
  const initials = [contractor.user.firstName, contractor.user.lastName]
    .filter(Boolean)
    .map((name) => name[0]?.toUpperCase())
    .join("");

  return initials || "BM";
}

function formatSpecialtyLabel(specialty: ContractorSpecialty): string {
  return specialty.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatLocation(contractor: ContractorProfile): string | null {
  const parts = [contractor.city, contractor.state].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
}

function formatRating(contractor: ContractorProfile): string | null {
  if (typeof contractor.averageRating !== "number") {
    return null;
  }

  return contractor.averageRating.toFixed(1);
}

function formatReviewCount(contractor: ContractorProfile): string | null {
  if (typeof contractor.totalReviews !== "number") {
    return null;
  }

  const label = contractor.totalReviews === 1 ? "review" : "reviews";

  return `(${contractor.totalReviews} ${label})`;
}

export default function ContractorCard({
  contractor,
  onPress,
  onViewProfile,
  isSaved = false,
  onToggleSave,
}: ContractorCardProps) {
  const contractorName = formatContractorName(contractor);
  const contractorInitials = formatContractorInitials(contractor);
  const contractorLocation = formatLocation(contractor);
  const contractorRating = formatRating(contractor);
  const contractorReviewCount = formatReviewCount(contractor);
  const canOpenProfile = Boolean(onViewProfile || onPress);
  const buttonLabel = "View Profile";

  function handleCardPress() {
    if (onPress) {
      onPress();
      return;
    }

    onViewProfile?.();
  }

  function handleViewProfilePress(event: GestureResponderEvent) {
    event.stopPropagation();

    if (onViewProfile) {
      onViewProfile();
      return;
    }

    onPress?.();
  }

  function handleToggleSavePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onToggleSave?.();
  }

  return (
    <Pressable disabled={!canOpenProfile} onPress={handleCardPress}>
      <Card className="rounded-3xl border-border bg-surface p-6 shadow-sm active:opacity-95">
        <View className="gap-6">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 flex-row items-start gap-4">
              <View className="h-20 w-20 overflow-hidden rounded-2xl bg-border/30 items-center justify-center">
                {contractor.user.avatarUrl ? (
                  <Image
                    source={{ uri: contractor.user.avatarUrl }}
                    resizeMode="cover"
                    className="h-full w-full"
                  />
                ) : (
                  <Text className="text-lg font-bold text-foreground/70">{contractorInitials}</Text>
                )}
              </View>

              <View className="flex-1 gap-2">
                <View className="flex-row items-center gap-2 pr-2">
                  <Text className="flex-1 text-xl font-bold tracking-tight text-foreground" numberOfLines={1}>
                    {contractorName}
                  </Text>
                  {contractor.isLicenseVerified ? (
                    <IconRosetteDiscountCheckFilled size={20} color="#16A34A" />
                  ) : null}
                </View>

                <View className="gap-1.5">
                  {contractorRating ? (
                    <View className="flex-row items-center gap-1.5">
                      <IconStarFilled size={15} color="#F59E0B" />
                      <Text className="text-sm font-semibold text-foreground">{contractorRating}</Text>
                      {contractorReviewCount ? (
                        <Text className="text-sm text-foreground/50">{contractorReviewCount}</Text>
                      ) : null}
                    </View>
                  ) : null}

                  {contractorLocation ? (
                    <View className="flex-row items-center gap-1.5">
                      <IconMapPin size={15} color="#6B7280" />
                      <Text className="text-sm text-foreground/70">{contractorLocation}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            {onToggleSave ? (
              <Pressable
                onPress={handleToggleSavePress}
                className={[
                  "rounded-full border px-3 py-2",
                  isSaved ? "border-accent bg-accent/10" : "border-border bg-surface",
                ].join(" ")}
              >
                <View className="flex-row items-center gap-1.5">
                  <IconBookmark size={16} color={isSaved ? "#00264d" : "#6B7280"} />
                  <Text className={isSaved ? "text-xs font-semibold text-accent" : "text-xs font-semibold text-foreground/70"}>
                    {isSaved ? "Saved" : "Save"}
                  </Text>
                </View>
              </Pressable>
            ) : null}
          </View>

          {contractor.specialties.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {contractor.specialties.map((specialty) => (
                <View key={specialty} className="rounded-xl bg-background px-3 py-1.5">
                  <Text className="text-xs font-semibold text-foreground/70">
                    {formatSpecialtyLabel(specialty)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View className="gap-3">
            {typeof contractor.yearsExperience === "number" ? (
              <View className="flex-row items-center gap-2">
                <View className="h-2 w-2 rounded-full bg-foreground/50" />
                <Text className="text-xs font-semibold uppercase tracking-widest text-foreground/70">
                  {contractor.yearsExperience} {contractor.yearsExperience === 1 ? "Year" : "Years"} Experience
                </Text>
              </View>
            ) : null}

            {contractor.isAvailable ? (
              <View className="flex-row items-center gap-2">
                <View className="h-2.5 w-2.5 rounded-full bg-secondary" />
                <Text className="text-xs font-semibold uppercase tracking-widest text-secondary">
                  Available Now
                </Text>
              </View>
            ) : null}
          </View>

          {contractor.bio ? (
            <Text className="text-sm leading-6 text-foreground/70" numberOfLines={2}>
              {contractor.bio}
            </Text>
          ) : (
            <Text className="text-sm leading-6 text-foreground/45" numberOfLines={2}>
              Profile details will appear here once this contractor adds a business bio.
            </Text>
          )}

          <Button
            variant="primary"
            size="lg"
            onPress={handleViewProfilePress}
            className="rounded-xl"
            textClassName="text-sm font-bold uppercase tracking-[1.5px]"
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-sm font-bold uppercase tracking-[1.5px] text-accent-foreground">
                {buttonLabel}
              </Text>
              <IconArrowRight size={18} color="#FFFFFF" />
            </View>
          </Button>
        </View>
      </Card>
    </Pressable>
  );
}
