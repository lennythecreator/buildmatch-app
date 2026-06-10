import { Button } from "@/components/ui/button";
import { useCreateJob, useJob, useUpdateJob } from "@/hooks/useJobs";
import { ApiError } from "@/lib/api/client";
import { JobTradeType } from "@/lib/api/types";
import { US_STATES } from "@/lib/constants";
import { useAuthStore } from "@/store/auth";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { uploadFiles } from "@/lib/upload";
import { Image } from "expo-image";
import { IconPhotoPlus, IconX } from "@tabler/icons-react-native";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type FormValues = {
    title: string;
    tradeType: JobTradeType;
    description: string;
    budgetMin: string;
    budgetMax: string;
    city: string;
    state: string;
    zipCode: string;
};

const TRADES: JobTradeType[] = [
    'GENERAL', 'ELECTRICAL', 'PLUMBING', 'HVAC', 'ROOFING',
    'FLOORING', 'PAINTING', 'LANDSCAPING', 'DEMOLITION', 'OTHER'
];

const MIN_JOB_TITLE_LENGTH = 10;
const MAX_JOB_TITLE_LENGTH = 120;
const MIN_JOB_DESCRIPTION_LENGTH = 50;
const MAX_JOB_DESCRIPTION_LENGTH = 2000;

export default function PostJobManual() {
    const router = useRouter();
    const params = useLocalSearchParams<{ jobId?: string | string[] }>();
    const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
    const isEditing = !!jobId;
    const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
    const { mutateAsync: createJob, isPending: isCreatingJob } = useCreateJob();
    const { mutateAsync: updateJob, isPending: isUpdatingJob } = useUpdateJob();
    const { data: existingJob } = useJob(jobId ?? "");
    const userId = useAuthStore((state) => state.user?.id);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [didHydrate, setDidHydrate] = useState(false);

    const isPending = isCreatingJob || isUpdatingJob || isUploading;
    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            title: "",
            tradeType: undefined,
            description: "",
            budgetMin: "",
            budgetMax: "",
            city: "",
            state: "",
            zipCode: ""
        }
    });

    // In edit mode, prefill the form once the existing job loads.
    useEffect(() => {
        if (existingJob && !didHydrate) {
            reset({
                title: existingJob.title,
                tradeType: existingJob.tradeType,
                description: existingJob.description,
                budgetMin: String(existingJob.budgetMin),
                budgetMax: String(existingJob.budgetMax),
                city: existingJob.city,
                state: existingJob.state,
                zipCode: existingJob.zipCode,
            });
            setPhotos(existingJob.photos ?? []);
            setDidHydrate(true);
        }
    }, [existingJob, didHydrate, reset]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setPhotos(prev => [...prev, ...result.assets.map(a => a.uri)]);
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const actionVerb = isEditing ? "save" : "create";

    function showSubmitError(error: unknown) {
        const title = `Could not ${actionVerb} job`;
        if (error instanceof ApiError) {
            const details = error.errors?.length ? `\n\n${error.errors.join("\n")}` : "";
            Alert.alert(title, `${error.message}${details}`);
            return;
        }

        if (error instanceof Error) {
            Alert.alert(title, error.message);
            return;
        }

        Alert.alert(title, `An unknown error occurred while trying to ${actionVerb} the job.`);
    }

    const onSubmit = async (data: FormValues) => {
        // Photos already saved on the job are remote URLs; newly picked ones are
        // local file URIs that still need uploading. Only upload the new ones.
        const localPhotos = photos.filter((uri) => !/^https?:\/\//i.test(uri));
        if (localPhotos.length > 0 && !userId) {
            alert("Please sign in again before uploading photos.");
            return;
        }
        setIsUploading(true);
        try {
            const photoUrls = photos.filter((uri) => /^https?:\/\//i.test(uri));

            if (localPhotos.length > 0 && userId) {
                const results = await uploadFiles("job-photos", userId, localPhotos);
                photoUrls.push(...results.map((r) => r.publicUrl));
            }

            console.log(`[post-job] ${actionVerb} job with photos`, photoUrls);

            const payload = {
                ...data,
                budgetMin: Number(data.budgetMin),
                budgetMax: Number(data.budgetMax),
                // On edit, always send photos so removals persist; on create, omit when empty.
                ...(isEditing || photoUrls.length > 0 ? { photos: photoUrls } : {}),
            };

            if (isEditing && jobId) {
                await updateJob({ id: jobId, input: payload });
                router.back();
            } else {
                await createJob(payload);
                router.push("/(tabs)/jobs");
            }
        } catch (error) {
            console.error(`Failed to ${actionVerb} job`, error);
            showSubmitError(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1 bg-gray-50">
            <Stack.Screen options={{ title: isEditing ? "Edit Job" : "Post Job (Manual)", headerBackTitle: "Back" }} />
            
            <View className="p-4 gap-6 pb-12">
                {/* 1. Job Details Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 gap-4">
                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Job Details</Text>
                    
                    <View>
                        <Controller
                            control={control}
                            rules={{
                                required: "Title is required",
                                minLength: { value: MIN_JOB_TITLE_LENGTH, message: "Title must be at least 10 characters" },
                                maxLength: { value: MAX_JOB_TITLE_LENGTH, message: "Title must be 120 characters or less" },
                            }}
                            name="title"
                            render={({ field: { onChange, value } }) => {
                                const trimmedLength = value.trim().length;
                                const isTooShort = trimmedLength > 0 && trimmedLength < MIN_JOB_TITLE_LENGTH;
                                const isTooLong = trimmedLength > MAX_JOB_TITLE_LENGTH;
                                const isInvalidLength = isTooShort || isTooLong;

                                return (
                                    <View className="gap-1.5">
                                        <View className="flex-row items-center justify-between gap-3">
                                            <Text className="text-sm font-medium text-gray-700">Job Title</Text>
                                            <Text
                                                className={`text-xs font-medium ${
                                                    isInvalidLength ? "text-red-500" : "text-gray-500"
                                                }`}
                                            >
                                                {isTooLong
                                                    ? `${trimmedLength}/${MAX_JOB_TITLE_LENGTH} max`
                                                    : `${Math.min(trimmedLength, MIN_JOB_TITLE_LENGTH)}/${MIN_JOB_TITLE_LENGTH} min`}
                                            </Text>
                                        </View>
                                        <TextInput
                                            className={`border rounded-xl p-3 text-base text-gray-900 bg-white ${errors.title ? "border-red-500" : "border-gray-200"}`}
                                            placeholder="e.g. Full kitchen renovation"
                                            placeholderTextColor="#9CA3AF"
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        <Text
                                            selectable
                                            className={`text-xs leading-5 ${isInvalidLength ? "text-red-500" : "text-gray-500"}`}
                                        >
                                            {isTooLong
                                                ? `Job titles must be ${MAX_JOB_TITLE_LENGTH} characters or less.`
                                                : `Job titles must be at least ${MIN_JOB_TITLE_LENGTH} characters.`}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                        {errors.title && <Text className="text-red-500 text-xs mt-1">{errors.title.message}</Text>}
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">Trade Type</Text>
                        <Controller
                            control={control}
                            rules={{ required: "Please select a trade type" }}
                            name="tradeType"
                            render={({ field: { onChange, value } }) => (
                                <View className="flex-row flex-wrap gap-2">
                                    {TRADES.map(trade => (
                                        <TouchableOpacity
                                            key={trade}
                                            onPress={() => onChange(trade)}
                                            className={`px-3 py-2 rounded-full border ${value === trade ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text className={`text-sm ${value === trade ? 'text-emerald-700 font-bold' : 'text-gray-600 font-medium'}`}>
                                                {trade.replace(/_/g, ' ')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        />
                        {errors.tradeType && <Text className="text-red-500 text-xs mt-1">{errors.tradeType.message}</Text>}
                    </View>

                    <View>
                        <Controller
                            control={control}
                            rules={{
                                required: "Description is required",
                                minLength: { value: MIN_JOB_DESCRIPTION_LENGTH, message: "Description must be at least 50 characters" },
                                maxLength: { value: MAX_JOB_DESCRIPTION_LENGTH, message: "Description must be 2000 characters or less" },
                            }}
                            name="description"
                            render={({ field: { onChange, value } }) => {
                                const trimmedLength = value.trim().length;
                                const isTooShort = trimmedLength > 0 && trimmedLength < MIN_JOB_DESCRIPTION_LENGTH;
                                const isTooLong = trimmedLength > MAX_JOB_DESCRIPTION_LENGTH;
                                const isInvalidLength = isTooShort || isTooLong;

                                return (
                                    <View className="gap-1.5">
                                        <View className="flex-row items-center justify-between gap-3">
                                            <Text className="text-sm font-medium text-gray-700">Description</Text>
                                            <Text
                                                className={`text-xs font-medium ${
                                                    isInvalidLength ? "text-red-500" : "text-gray-500"
                                                }`}
                                            >
                                                {isTooLong
                                                    ? `${trimmedLength}/${MAX_JOB_DESCRIPTION_LENGTH} max`
                                                    : `${Math.min(trimmedLength, MIN_JOB_DESCRIPTION_LENGTH)}/${MIN_JOB_DESCRIPTION_LENGTH} min`}
                                            </Text>
                                        </View>
                                        <TextInput
                                            multiline
                                            textAlignVertical="top"
                                            className={`border rounded-xl p-3 min-h-[120px] text-base text-gray-900 bg-white ${errors.description ? "border-red-500" : "border-gray-200"}`}
                                            placeholder="Describe the scope of work..."
                                            placeholderTextColor="#9CA3AF"
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        <Text
                                            selectable
                                            className={`text-xs leading-5 ${isInvalidLength ? "text-red-500" : "text-gray-500"}`}
                                        >
                                            {isTooLong
                                                ? `Descriptions must be ${MAX_JOB_DESCRIPTION_LENGTH} characters or less.`
                                                : `Descriptions must be at least ${MIN_JOB_DESCRIPTION_LENGTH} characters.`}
                                        </Text>
                                    </View>
                                );
                            }}
                        />
                        {errors.description && <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>}
                    </View>
                </View>

                {/* 2. Budget Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 gap-4">
                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Budget</Text>
                    
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1.5">Minimum ($)</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: "Min budget required",
                                    validate: (value) => Number(value) > 0 || "Minimum budget must be greater than 0",
                                }}
                                name="budgetMin"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        keyboardType="numeric"
                                        className={`border rounded-xl p-3 text-base text-gray-900 bg-white ${errors.budgetMin ? "border-red-500" : "border-gray-200"}`}
                                        placeholder="e.g. 1000"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.budgetMin && <Text className="text-red-500 text-xs mt-1">{errors.budgetMin.message}</Text>}
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1.5">Maximum ($)</Text>
                            <Controller
                                control={control}
                                rules={{
                                    required: "Max budget required",
                                    validate: (value, formValues) => {
                                        const maxBudget = Number(value);
                                        const minBudget = Number(formValues.budgetMin);
                                        if (maxBudget <= 0) {
                                            return "Maximum budget must be greater than 0";
                                        }

                                        return maxBudget > minBudget || "Maximum budget must be greater than minimum budget";
                                    },
                                }}
                                name="budgetMax"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        keyboardType="numeric"
                                        className={`border rounded-xl p-3 text-base text-gray-900 bg-white ${errors.budgetMax ? "border-red-500" : "border-gray-200"}`}
                                        placeholder="e.g. 5000"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.budgetMax && <Text className="text-red-500 text-xs mt-1">{errors.budgetMax.message}</Text>}
                        </View>
                    </View>
                </View>

                {/* Photos Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 gap-4">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">Photos (Optional)</Text>
                        <Text className="text-xs text-gray-400">{photos.length} selected</Text>
                    </View>
                    <View className="flex-row flex-wrap gap-3">
                        {photos.map((uri, index) => (
                            <View key={uri} className="relative">
                                <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 12 }} contentFit="cover" />
                                <TouchableOpacity 
                                    onPress={() => removePhoto(index)}
                                    className="absolute -top-2 -right-2 bg-slate-900 rounded-full p-1 border-2 border-white"
                                >
                                    <IconX size={14} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity 
                            onPress={pickImage}
                            className="w-20 h-20 rounded-xl border border-dashed border-gray-300 bg-gray-50 items-center justify-center"
                        >
                            <IconPhotoPlus size={24} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. Location Card */}
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 gap-4">
                    <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</Text>
                    
                    <View className="flex-row gap-4">
                        <View className="flex-1">
                            <Text className="text-sm font-medium text-gray-700 mb-1.5">City</Text>
                            <Controller
                                control={control}
                                rules={{ required: "City required" }}
                                name="city"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        className={`border rounded-xl p-3 text-base text-gray-900 bg-white ${errors.city ? "border-red-500" : "border-gray-200"}`}
                                        placeholder="San Francisco"
                                        placeholderTextColor="#9CA3AF"
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.city && <Text className="text-red-500 text-xs mt-1">{errors.city.message}</Text>}
                        </View>
                        <View className="flex-[0.5]">
                            <Text className="text-sm font-medium text-gray-700 mb-1.5">State</Text>
                            <Controller
                                control={control}
                                rules={{ required: "State required" }}
                                name="state"
                                render={({ field: { onChange, value } }) => (
                                    <>
                                        <TouchableOpacity
                                            onPress={() => setIsStateDropdownOpen(true)}
                                            className={`border rounded-xl p-3 min-h-[48px] justify-center bg-white ${errors.state ? "border-red-500" : "border-gray-200"}`}
                                        >
                                            <Text className={`text-base ${value ? 'text-gray-900' : 'text-[#9CA3AF]'}`}>
                                                {value || "State"}
                                            </Text>
                                        </TouchableOpacity>

                                        <Modal
                                            visible={isStateDropdownOpen}
                                            transparent={true}
                                            animationType="fade"
                                            onRequestClose={() => setIsStateDropdownOpen(false)}
                                        >
                                            <TouchableOpacity 
                                                className="flex-1 justify-center bg-black/50 p-4" 
                                                activeOpacity={1} 
                                                onPress={() => setIsStateDropdownOpen(false)}
                                            >
                                                <View className="bg-white rounded-2xl max-h-[70%] w-full shadow-xl">
                                                    <View className="p-4 border-b border-gray-100 flex-row justify-between items-center bg-gray-50 rounded-t-2xl">
                                                        <Text className="font-bold text-gray-700 text-base">Select State</Text>
                                                        <TouchableOpacity onPress={() => setIsStateDropdownOpen(false)}>
                                                            <Text className="text-emerald-600 font-bold p-1">Close</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <FlatList
                                                        data={US_STATES}
                                                        keyExtractor={(item) => item.value}
                                                        renderItem={({ item }) => (
                                                            <TouchableOpacity
                                                                className={`p-4 border-b border-gray-50 flex-row justify-between items-center ${value === item.value ? 'bg-emerald-50' : 'bg-white'}`}
                                                                onPress={() => {
                                                                    onChange(item.value);
                                                                    setIsStateDropdownOpen(false);
                                                                }}
                                                            >
                                                                <Text className={`text-base ${value === item.value ? 'text-emerald-700 font-bold' : 'text-gray-800'}`}>
                                                                    {item.label}
                                                                </Text>
                                                                <Text className={`text-sm ${value === item.value ? 'text-emerald-600 font-bold' : 'text-gray-500'}`}>
                                                                    {item.value}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        )}
                                                    />
                                                </View>
                                            </TouchableOpacity>
                                        </Modal>
                                    </>
                                )}
                            />
                            {errors.state && <Text className="text-red-500 text-xs mt-1">{errors.state.message}</Text>}
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1.5">Zip Code</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: "Zip code required",
                                pattern: { value: /^\d{5}$/, message: "Enter a valid 5-digit zip code" },
                            }}
                            name="zipCode"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    keyboardType="numeric"
                                    className={`border rounded-xl p-3 text-base text-gray-900 bg-white ${errors.zipCode ? "border-red-500" : "border-gray-200"}`}
                                    placeholder="94103"
                                    placeholderTextColor="#9CA3AF"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        {errors.zipCode && <Text className="text-red-500 text-xs mt-1">{errors.zipCode.message}</Text>}
                    </View>
                </View>

                {/* Submit Action */}
                <Button 
                    className="bg-[#1f2937] rounded-xl py-4 mt-2"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                >
                    {isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-center text-base">
                            {isEditing ? "Save Changes" : "Post Job"}
                        </Text>
                    )}
                </Button>
            </View>
        </ScrollView>
    );
}
