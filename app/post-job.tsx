import { Button } from "@/components/ui/button";
import { useParseJob } from "@/hooks/useAi";
import { useCreateJob } from "@/hooks/useJobs";
import {
    IconAlertCircle,
    IconCalendar,
    IconClipboardList,
    IconCoin,
    IconHammer,
    IconHome,
    IconMapPin,
    IconSparkles
} from "@tabler/icons-react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type Status = 'idle' | 'analyzing' | 'resolving' | 'creating';

export default function PostJob() {
    const [text, setText] = useState("");
    const [status, setStatus] = useState<Status>('idle');
    const [parsedJob, setParsedJob] = useState<Record<string, any>>({});
    const [missingFields, setMissingFields] = useState<string[]>([]);
    
    const router = useRouter();
    const { mutate: parseJob } = useParseJob();
    const { mutate: createJob } = useCreateJob();
    const maxChars = 1000;

    const REQUIRED_FIELDS = ['title', 'description', 'tradeType', 'budgetMin', 'budgetMax', 'city', 'state', 'zipCode'];

    const handleAnalyze = () => {
        if (!text.trim()) return;
        setStatus('analyzing');
        
        parseJob({ text }, {
            onSuccess: (data) => {
                const missing: string[] = [];
                REQUIRED_FIELDS.forEach(field => {
                    if (data[field as keyof typeof data] === undefined || data[field as keyof typeof data] === null) {
                        missing.push(field);
                    }
                });

                if (missing.length > 0) {
                    setParsedJob(data);
                    setMissingFields(missing);
                    setStatus('resolving');
                } else {
                    submitJob(data);
                }
            },
            onError: () => {
                setStatus('idle');
                alert("Failed to analyze. Please try again or fill manually.");
            }
        });
    };

    const submitJob = (jobData: Record<string, any>) => {
        setStatus('creating');
        // Ensure budgets are numbers
        const finalData = {
            ...jobData,
            budgetMin: Number(jobData.budgetMin) || 0,
            budgetMax: Number(jobData.budgetMax) || 0,
            tradeType: jobData.tradeType || 'OTHER', // Safe fallback
        } as any;

        createJob(finalData, {
            onSuccess: (newJob) => {
                // To the editable preview or details screen
                router.push(`/(tabs)/jobs`);
            },
            onError: (err) => {
                console.error(err);
                setStatus('idle');
                alert("Failed to create job.");
            }
        });
    };

    const handleMissingFieldSubmit = () => {
        // Validate mini-form before submitting
        const stillMissing = missingFields.filter(f => !parsedJob[f]);
        if (stillMissing.length > 0) {
            alert(`Please fill in all fields: ${stillMissing.join(', ')}`);
            return;
        }
        submitJob(parsedJob);
    };

    // Render loading overlay if working
    if (status === 'analyzing' || status === 'creating') {
        const loadingMessage = status === 'analyzing' 
            ? "AI is analyzing your project details..." 
            : "Generating your job and saving to database...";
            
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                <View className="items-center justify-center bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm w-full max-w-sm">
                    <ActivityIndicator size="large" color="#059669" className="mb-6 scale-125" />
                    <Text className="text-xl font-bold text-gray-900 mb-2 text-center">Please wait</Text>
                    <Text className="text-gray-500 text-center text-sm">{loadingMessage}</Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" className="flex-1 bg-gray-50 p-4">
            <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* AI Badge */}
                <View className="flex-row items-center bg-emerald-50 self-start px-2 py-1 rounded-full gap-1.5 mb-4">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <Text className="text-emerald-700 text-[10px] font-bold tracking-wider">AI-POWERED</Text>
                </View>

                {status === 'resolving' ? (
                    // --- RESOLVING MISSING FIELDS UI ---
                    <View>
                        <View className="flex-row items-center mb-2 gap-2">
                            <IconAlertCircle size={24} color="#D97706" />
                            <Text className="text-2xl font-bold text-gray-900">Missing details</Text>
                        </View>
                        <Text className="text-gray-500 text-sm mb-6 leading-5">
                            The AI couldn&apos;t extract everything needed. Please provide the missing fields to continue.
                        </Text>

                        {missingFields.map((field) => (
                            <View key={field} className="mb-4">
                                <Text className="text-sm font-bold text-gray-700 mb-1 capitalize">
                                    {field.replace(/([A-Z])/g, ' $1').trim()}
                                </Text>
                                <TextInput
                                    className="border border-slate-300 rounded-xl p-3 text-base text-gray-800 bg-white"
                                    placeholder={`Enter your ${field}`}
                                    placeholderTextColor="#9CA3AF"
                                    value={parsedJob[field]?.toString() || ""}
                                    onChangeText={(val) => setParsedJob(prev => ({ ...prev, [field]: val }))}
                                />
                            </View>
                        ))}

                        <View className="flex-col items-stretch mt-8 gap-4">
                            <Button 
                                className="bg-[#059669] rounded-lg w-full py-4"
                                onPress={handleMissingFieldSubmit}
                            >
                                <Text className="text-white font-bold text-base text-center">Complete & Post Job</Text>
                            </Button>
                            <TouchableOpacity onPress={() => setStatus('idle')}>
                                <Text className="text-slate-500 text-sm font-medium underline text-center">Go back</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // --- IDLE / TEXT AREA UI ---
                    <View>
                        {/* Header */}
                        <Text className="text-2xl font-bold text-gray-900 mb-2">What do you need done?</Text>
                        <Text className="text-gray-500 text-sm mb-6 leading-5">
                            Describe your project in plain language. AI will read it and pre-fill the job form for you.
                        </Text>

                        {/* Tips Section */}
                        <View className="flex-row items-center flex-wrap gap-2 mb-6">
                            <Text className="text-xs font-bold text-gray-400 mr-1 tracking-wider uppercase">Tips:</Text>
                            <TipBadge icon={<IconMapPin size={14} color="#6B7280" />} label="Location" />
                            <TipBadge icon={<IconHammer size={14} color="#6B7280" />} label="Type of work" />
                            <TipBadge icon={<IconCoin size={14} color="#6B7280" />} label="Budget" />
                            <TipBadge icon={<IconHome size={14} color="#6B7280" />} label="Property type" />
                            <TipBadge icon={<IconClipboardList size={14} color="#6B7280" />} label="Scope of work" />
                            <TipBadge icon={<IconCalendar size={14} color="#6B7280" />} label="Timeline" />
                        </View>

                        {/* Text Area */}
                        <View className="relative">
                            <TextInput
                                multiline
                                textAlignVertical="top"
                                placeholder="e.g. I need to redo the roof of an old property of mine located in Baltimore, MD. Budget is around $10000 looking for contractors to start in the next 2 weeks"
                                placeholderTextColor="#9CA3AF"
                                value={text}
                                onChangeText={setText}
                                maxLength={maxChars}
                                className="border border-slate-300 rounded-xl p-4 min-h-[200px] text-base text-gray-800 bg-white"
                                style={{ paddingTop: 16 }}
                            />
                            <View className="absolute bottom-3 right-3 bg-white px-1">
                                <Text className="text-xs font-medium text-gray-400">{text.length} / {maxChars}</Text>
                            </View>
                        </View>

                        {/* Actions */}
                        <View className="flex-col items-center justify-between mt-8 gap-4">
                            <TouchableOpacity onPress={() => router.push('/post-job-manual')}>
                                <Text className="text-slate-500 text-sm font-medium underline">Skip — fill in manually</Text>
                            </TouchableOpacity>
                            
                            <Button 
                                className="bg-[#1f2937] rounded-lg w-full py-4"
                                onPress={handleAnalyze}
                            >
                                <View className="flex-row items-center justify-center gap-2 w-full">
                                    <IconSparkles size={18} color="white" />
                                    <Text className="text-white font-semibold text-base text-center">Analyze & Create Job</Text>
                                </View>
                            </Button>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

function TipBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-2.5 py-1.5 gap-1.5 mb-1 text-sm">
            {icon}
            <Text className="text-gray-600 text-xs font-medium">{label}</Text>
        </View>
    );
}
