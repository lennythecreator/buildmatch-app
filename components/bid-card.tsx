import { IconCalendar, IconCoin, IconMessageCircle, IconUser } from "@tabler/icons-react-native";
import { Pressable, Text, View } from "react-native";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface BidCardBid {
    id: string;
    jobId: string;
    contractorId: string;
    amount: number;
    message?: string;
    status: string;
    createdAt: string | Date;
    job?: {
        title?: string;
        tradeType?: string;
    };
    contractor?: {
        firstName?: string;
        lastName?: string;
    };
}

interface BidCardProps {
    bid: BidCardBid;
    viewAs: "contractor" | "investor";
    isSelected?: boolean;
    isRecommended?: boolean;
    comparisonScore?: number;
    onPress?: () => void;
    actionLabel?: string;
    onActionPress?: () => void;
}

function getBidStatusColor(status: string) {
    switch (status) {
        case "ACCEPTED":
            return "success";
        case "REJECTED":
            return "danger";
        case "WITHDRAWN":
            return "secondary";
        default:
            return "warning";
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

function formatBidDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatContractorName(bid: BidCardBid) {
    const firstName = bid.contractor?.firstName;
    const lastName = bid.contractor?.lastName;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    return fullName || "Contractor";
}

function BidCardContent({
    bid,
    viewAs,
    isSelected = false,
    isRecommended = false,
    comparisonScore,
    actionLabel,
    onActionPress,
}: BidCardProps) {
    const isContractor = viewAs === "contractor";

    return (
        <Card
            className={[
                "gap-4 rounded-3xl border-0 bg-white p-8 shadow-sm shadow-slate-200/50",
                isSelected ? "ring-2 ring-accent/30" : "",
            ].join(" ")}
        >
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                    <View className="flex-row flex-wrap items-center gap-2">
                        <Text className="text-base font-semibold text-foreground">
                            {isContractor ? bid.job?.title ?? "Job Bid" : formatContractorName(bid)}
                        </Text>
                        {isRecommended ? (
                            <Badge color="success" size="sm">
                                Best fit
                            </Badge>
                        ) : null}
                    </View>
                    <Text className="text-sm text-muted">
                        {isContractor
                            ? bid.job?.tradeType?.replace(/_/g, " ") || "Proposal"
                            : "Submitted proposal"}
                    </Text>
                </View>

                <View className="items-end gap-2">
                    <Badge color={getBidStatusColor(bid.status)} size="sm">
                        {bid.status}
                    </Badge>
                    {typeof comparisonScore === "number" ? (
                        <Text className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
                            Score {comparisonScore}
                        </Text>
                    ) : null}
                </View>
            </View>

            <View className="flex-row items-center gap-3 rounded-2xl bg-slate-50 p-4">
                <View className="rounded-xl bg-emerald-100 p-2">
                    <IconCoin size={18} color="#059669" />
                </View>
                <View className="gap-1">
                    <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Bid Amount
                    </Text>
                    <Text className="text-lg font-bold text-slate-900">
                        {formatCurrency(bid.amount)}
                    </Text>
                </View>
            </View>

            {bid.message ? (
                <View className="flex-row gap-3 rounded-2xl bg-slate-50 p-4">
                    <View className="self-start rounded-xl bg-blue-100 p-2">
                        <IconMessageCircle size={18} color="#2563EB" />
                    </View>
                    <View className="flex-1 gap-1">
                        <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Message
                        </Text>
                        <Text className="text-sm leading-6 text-slate-700">
                            {bid.message}
                        </Text>
                    </View>
                </View>
            ) : null}

            <View className="flex-row flex-wrap items-center gap-4">
                {!isContractor ? (
                    <View className="flex-row items-center gap-2">
                        <IconUser size={16} color="#64748B" />
                        <Text className="text-sm text-slate-600">
                            {formatContractorName(bid)}
                        </Text>
                    </View>
                ) : null}
                <View className="flex-row items-center gap-2">
                    <IconCalendar size={16} color="#64748B" />
                    <Text className="text-sm text-slate-600">
                        Submitted {formatBidDate(bid.createdAt)}
                    </Text>
                </View>
            </View>

            {actionLabel && onActionPress ? (
                <Pressable
                    onPress={onActionPress}
                    className="items-center justify-center rounded-xl bg-accent px-4 py-3"
                >
                    <Text className="text-sm font-semibold text-accent-foreground">
                        {actionLabel}
                    </Text>
                </Pressable>
            ) : null}
        </Card>
    );
}

export default function BidCard(props: BidCardProps) {
    if (props.onPress) {
        return (
            <Pressable onPress={props.onPress}>
                <BidCardContent {...props} />
            </Pressable>
        );
    }

    return <BidCardContent {...props} />;
}
