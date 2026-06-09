import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUser, useUpdateAvatar, useUpdateProfile } from "@/hooks/useAuth";
import { MediaPermissionError, pickImagesFromLibrary, uploadFile } from "@/lib/upload";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface EditProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  state: string;
  bio: string;
  title: string;
  company: string;
  website: string;
}

export default function EditProfileScreen() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: updateAvatar } = useUpdateAvatar();
  const [isUploadingAvatar, setIsUploadingAvatar] = React.useState(false);
  const { control, handleSubmit, reset, formState: { errors } } = useForm<EditProfileFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      state: "",
      bio: "",
      title: "",
      company: "",
      website: "",
    },
  });

  React.useEffect(() => {
    if (!user) {
      return;
    }

    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      city: user.city ?? "",
      state: user.state ?? "",
      bio: user.bio ?? "",
      title: user.title ?? "",
      company: user.company ?? "",
      website: user.website ?? "",
    });
  }, [reset, user]);

  const screenOptions = {
    headerShown: true,
    title: "Edit Profile",
    headerBackTitle: "Back",
  };

  function handleSave(values: EditProfileFormValues) {
    updateProfile(
      {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phone: values.phone.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        bio: values.bio.trim(),
        title: values.title.trim(),
        company: values.company.trim(),
        website: values.website.trim(),
      },
      {
        onSuccess: () => {
          router.replace("/(tabs)/profile");
        },
        onError: () => {
          Alert.alert("Update failed", "We couldn't save your profile. Please try again.");
        },
      }
    );
  }

  async function handleChangeAvatar() {
    if (!user) {
      return;
    }
    try {
      setIsUploadingAvatar(true);
      const [uri] = await pickImagesFromLibrary();
      if (!uri) {
        return; // user cancelled
      }
      const { publicUrl } = await uploadFile({ bucket: "avatars", userId: user.id, uri });
      updateAvatar(publicUrl, {
        onError: () => {
          Alert.alert("Update failed", "We couldn't update your photo. Please try again.");
        },
      });
    } catch (error) {
      if (error instanceof MediaPermissionError) {
        Alert.alert("Permission needed", "Enable photo access in Settings to change your photo.");
      } else {
        Alert.alert("Upload failed", "We couldn't upload your photo. Please try again.");
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";

  if (isLoading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Stack.Screen options={screenOptions} />
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-sm font-medium text-gray-500">Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1 bg-gray-50">
      <Stack.Screen options={screenOptions} />

      <View className="gap-6 p-4 pb-12">
        <View className="items-center gap-3 py-2">
          <TouchableOpacity onPress={handleChangeAvatar} disabled={isUploadingAvatar} activeOpacity={0.8}>
            <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-200">
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
              ) : (
                <Text className="text-2xl font-bold text-gray-500">{initials}</Text>
              )}
              {isUploadingAvatar ? (
                <View className="absolute inset-0 items-center justify-center bg-black/30">
                  <ActivityIndicator color="#ffffff" />
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChangeAvatar} disabled={isUploadingAvatar}>
            <Text className="text-sm font-semibold text-[#1f2937]">
              {isUploadingAvatar ? "Uploading..." : "Change photo"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm gap-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">Basic Info</Text>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="First Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="First name"
                    error={errors.firstName?.message}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Last Name"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Last name"
                    error={errors.lastName?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Phone"
                value={value}
                onChangeText={onChange}
                placeholder="(555) 123-4567"
                keyboardType="phone-pad"
              />
            )}
          />

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="City"
                    value={value}
                    onChangeText={onChange}
                    placeholder="City"
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="State"
                    value={value}
                    onChangeText={onChange}
                    placeholder="State"
                    autoCapitalize="characters"
                    maxLength={2}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm gap-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">Introduce Yourself</Text>

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Bio"
                value={value}
                onChangeText={onChange}
                placeholder="Tell people about your background and what you do best."
                multiline
                textAlignVertical="top"
                inputClassName="min-h-[140px] py-3"
              />
            )}
          />
        </View>

        <View className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm gap-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-gray-500">Professional Details</Text>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Title"
                value={value}
                onChangeText={onChange}
                placeholder="Project Manager"
              />
            )}
          />

          <Controller
            control={control}
            name="company"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Company"
                value={value}
                onChangeText={onChange}
                placeholder="Your company"
              />
            )}
          />

          <Controller
            control={control}
            name="website"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Website"
                value={value}
                onChangeText={onChange}
                placeholder="https://example.com"
                keyboardType="url"
                autoCapitalize="none"
              />
            )}
          />
        </View>

        <Button
          className="mt-2 rounded-xl bg-[#1f2937] py-4"
          onPress={handleSubmit(handleSave)}
          isLoading={isPending}
        >
          Save Profile
        </Button>
      </View>
    </ScrollView>
  );
}
