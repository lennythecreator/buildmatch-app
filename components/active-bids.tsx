import { useActiveBids } from '@/hooks/use-active-bids';
import { IconBriefcase, IconMapPin } from '@tabler/icons-react-native';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import BidCard from './bid-card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';

export default function ActiveBids() {
    const { data: bids = [], isLoading, error } = useActiveBids();
    const activeBids = useMemo(
        () => bids.filter((bid) => bid.status === 'PENDING' || bid.status === 'ACCEPTED'),
        [bids]
    );
    const visibleBids = useMemo(() => activeBids.slice(0, 3), [activeBids]);
    const hasActiveBids = activeBids.length > 0;
    const hasMoreBids = bids.length > 3;

    return (
        <Card className="gap-5 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
            <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-2">
                    <View className="flex-row items-center gap-2">
                        <View className="rounded-2xl bg-accent/10 p-2">
                            <IconBriefcase size={20} color="#00264d" />
                        </View>
                        <Text selectable className="text-lg font-bold text-foreground">
                            Active Bids
                        </Text>
                    </View>
                    <Text selectable className="text-sm leading-6 text-muted">
                        Review the proposals you have submitted and track their status.
                    </Text>
                </View>

                {hasActiveBids ? (
                    <Badge color="slate" size="sm" variant="solid">
                    {activeBids.length}
                    </Badge>
                ) : null}
            </View>

            {isLoading ? (
                <View className="items-center justify-center gap-3 rounded-2xl bg-slate-50 px-6 py-10">
                    <ActivityIndicator />
                    <Text selectable className="text-sm text-muted">
                        Loading your bids...
                    </Text>
                </View>
            ) : error ? (
                <View className="rounded-2xl bg-red-50 px-5 py-4">
                    <Text selectable className="text-sm text-danger">
                        Failed to load your bids.
                    </Text>
                </View>
            ) : hasActiveBids ? (
                <View className="gap-4">
                    {visibleBids.map((bid) => (
                        <BidCard
                            key={bid.id}
                            bid={bid}
                            viewAs="contractor"
                            onPress={() => router.push({ pathname: '/job/[id]', params: { id: bid.jobId } })}
                        />
                    ))}

                    <View className="flex-row items-center gap-3 pt-1">
                        {hasMoreBids ? (
                            <Button
                                variant="secondary"
                                size="sm"
                                onPress={() => router.push('/bids')}
                                className="flex-1"
                            >
                                Review more
                            </Button>
                        ) : null}
                        <Button
                            variant={hasMoreBids ? 'ghost' : 'secondary'}
                            size="sm"
                            onPress={() => router.push('/find-jobs')}
                            className="flex-1"
                        >
                            Find Job
                        </Button>
                    </View>
                </View>
            ) : (
                <View className="gap-4 rounded-2xl bg-slate-50 px-5 py-6">
                    <View className="flex-row items-center gap-2">
                        <IconMapPin size={18} color="#64748B" />
                        <Text selectable className="text-base font-semibold text-foreground">
                            No active bids yet
                        </Text>
                    </View>

                    <Text selectable className="text-sm leading-6 text-muted">
                        Start by finding jobs that fit your trade, then submit your first bid to begin tracking activity here.
                    </Text>

                    <Button variant="primary" size="md" onPress={() => router.push('/find-jobs')}>
                        Find Job
                    </Button>
                </View>
            )}
        </Card>
    );
}