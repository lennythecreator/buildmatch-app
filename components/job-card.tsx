import { useRouter } from "expo-router";
import { Job } from "@/types/job";
import { IconCalendar, IconChevronRight, IconCoin, IconMapPin } from "@tabler/icons-react-native";
import { Pressable, Text, View } from "react-native";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface JobCardProps {
    job: Job;
    onPress?: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "OPEN": return "success";
        case "AWARDED": return "primary";
        case "COMPLETED": return "secondary";
        case "CANCELLED": return "danger";
        default: return "default";
    }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function JobCard({ job, onPress }: JobCardProps) {
    const router = useRouter();
    const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    function handlePress() {
        if (onPress) {
            onPress();
            return;
        }

        router.push({
            pathname: "/job/[id]",
            params: { id: job.id },
        });
    }

    return (
        <Pressable onPress={handlePress}>
            <Card className="gap-5 border-border shadow-sm p-4 bg-white active:bg-gray-50 rounded-2xl">
                {/* Header: Title and Chevron */}
                <View className="flex-row justify-between items-start gap-4">
                    <View className="flex-1 gap-1.5">
                        <Text className="text-[17px] font-bold text-gray-900 leading-6" numberOfLines={2}>
                            {job.title}
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <Badge color={getStatusColor(job.status)} variant="solid" size="sm">
                                {job.status}
                            </Badge>
                            <Badge color="default" variant="flat" size="sm">
                                {job.tradeType.replace(/_/g, ' ')}
                            </Badge>
                            {job.bidCount !== undefined && job.bidCount > 0 && (
                                <Text className="text-xs font-semibold text-emerald-600">
                                    {job.bidCount} {job.bidCount === 1 ? 'Bid' : 'Bids'}
                                </Text>
                            )}
                        </View>
                    </View>
                    <IconChevronRight size={20} color="#9CA3AF" />
                </View>

                {/* Middle Section: Metadata Details */}
                <View className="gap-3">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2.5">
                            <View className="bg-emerald-50 p-1.5 rounded-lg">
                                <IconCoin size={16} color="#10B981" />
                            </View>
                            <Text className="text-gray-700 font-medium text-sm">
                                {formatCurrency(job.budgetMin)} - {formatCurrency(job.budgetMax)}
                            </Text>
                        </View>
                        
                        <View className="flex-row items-center gap-1.5">
                            <IconMapPin size={16} color="#6B7280" />
                            <Text className="text-gray-500 font-medium text-sm">
                                {job.city}, {job.state}
                            </Text>
                        </View>
                    </View>
                </View>
                
                {/* Footer/Description */}
                <View className="border-t border-gray-100 pt-4 pb-1">
                    <Text className="text-gray-500 text-[13px] leading-5" numberOfLines={2}>
                        {job.description}
                    </Text>
                    <View className="flex-row items-center gap-1.5 mt-3">
                        <IconCalendar size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs font-medium">
                            Posted {formattedDate}
                        </Text>
                    </View>
                </View>
            </Card>
        </Pressable>
    )
}
