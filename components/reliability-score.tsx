import { useReliabilityScore } from '@/hooks/useReliabilityScore';
import { IconGauge } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

export default function ReliabilityScore() {
    const { data, isLoading } = useReliabilityScore();
    const score = data?.score ?? 0;
    const factors = data?.factors ?? [];

    return (
        <Card className="gap-5 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-2">
                    <View className="flex-row items-center gap-2">
                        <View className="rounded-2xl bg-accent/10 p-2">
                            <IconGauge size={20} color="#00264d" />
                        </View>
                        <Text selectable className="text-lg font-bold text-foreground">
                            Reliability Score
                        </Text>
                    </View>
                    <Text selectable className="text-sm leading-6 text-muted">
                        A weighted view of how consistently you respond, bid, and complete work.
                    </Text>
                </View>

                <Badge color={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'slate'} size="sm">
                    {score}/100
                </Badge>
            </View>

            {isLoading ? (
                <View className="rounded-2xl bg-slate-50 px-5 py-6">
                    <Text selectable className="text-sm text-muted">
                        Loading your reliability score...
                    </Text>
                </View>
            ) : null}

            <View className="gap-3">
                {factors.map((factor) => (
                    <View key={factor.name} className="gap-2 rounded-2xl bg-slate-50 p-4">
                        <View className="flex-row items-center justify-between gap-3">
                            <Text selectable className="text-sm font-semibold text-foreground">
                                {factor.name}
                            </Text>
                            <Text selectable className="text-xs font-semibold uppercase tracking-widest text-muted">
                                {factor.impact} pts
                            </Text>
                        </View>

                        <View className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <View
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${Math.min(100, (factor.impact / 25) * 100)}%` }}
                            />
                        </View>

                        <Text selectable className="text-xs leading-5 text-muted">
                            {factor.description}
                        </Text>
                    </View>
                ))}
            </View>
        </Card>
    );
}