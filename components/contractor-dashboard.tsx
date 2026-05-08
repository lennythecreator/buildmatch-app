import { useAuthStore } from "@/store/auth";
import { IconBriefcase, IconSparkles } from "@tabler/icons-react-native";
import { ScrollView, Text, View } from "react-native";
import ActiveBids from "./active-bids";
import ReliabilityScore from "./reliability-score";
import TrackPerformance from "./track-performance";
import { Card } from "./ui/card";

export default function ContractorDashboard() {
    const { user } = useAuthStore();

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
        >
            <Card className="gap-3 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
                <View className="flex-row items-start gap-4">
                    <View className="rounded-2xl bg-accent/10 p-3">
                        <IconSparkles size={24} color="#00264d" />
                    </View>

                    <View className="flex-1 gap-1">
                        <Text selectable className="text-[22px] font-extrabold tracking-tight text-foreground">
                            Hi, {user?.firstName || "Contractor"}
                        </Text>
                        <Text selectable className="text-sm leading-6 text-muted">
                            Here&apos;s an overview of your bids, reliability, and monthly performance.
                        </Text>
                    </View>
                </View>

                <View className="flex-row flex-wrap gap-3 pt-2">
                    <View className="flex-row items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
                        <IconBriefcase size={16} color="#64748B" />
                        <Text selectable className="text-xs font-semibold uppercase tracking-widest text-muted">
                            Contractor dashboard
                        </Text>
                    </View>
                </View>
            </Card>

            <ActiveBids />
            <TrackPerformance />
            <ReliabilityScore />
        </ScrollView>
    );
}