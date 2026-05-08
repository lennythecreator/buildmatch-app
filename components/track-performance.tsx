import { useTrackPerformance } from '@/hooks/useTrackPerformance';
import { IconCoin, IconTrendingUp } from '@tabler/icons-react-native';
import { Text, View } from 'react-native';

import { Badge } from './ui/badge';
import { Card } from './ui/card';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TrackPerformance() {
  const { data, isLoading } = useTrackPerformance();
  const incomeThisMonth = data?.incomeThisMonth ?? 0;
  const successScore = data?.successScore ?? 0;

  return (
    <Card className="gap-5 rounded-3xl bg-white p-6 shadow-sm shadow-slate-200/50">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-2">
          <View className="flex-row items-center gap-2">
            <View className="rounded-2xl bg-accent/10 p-2">
              <IconTrendingUp size={20} color="#00264d" />
            </View>
            <Text selectable className="text-lg font-bold text-foreground">
              Track Performance
            </Text>
          </View>
          <Text selectable className="text-sm leading-6 text-muted">
            Watch your earnings and progress score in one place.
          </Text>
        </View>

        <Badge color={successScore >= 80 ? 'success' : successScore >= 60 ? 'warning' : 'slate'} size="sm">
          {successScore}/100
        </Badge>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2 rounded-2xl bg-slate-50 p-4">
          <View className="flex-row items-center gap-2">
            <IconCoin size={16} color="#64748B" />
            <Text selectable className="text-xs font-semibold uppercase tracking-widest text-muted">
              Earned this month
            </Text>
          </View>
          <Text selectable className="text-2xl font-extrabold tracking-tight text-foreground">
            {isLoading ? '...' : formatCurrency(incomeThisMonth)}
          </Text>
        </View>

        <View className="flex-1 gap-2 rounded-2xl bg-slate-50 p-4">
          <Text selectable className="text-xs font-semibold uppercase tracking-widest text-muted">
            Success score
          </Text>
          <Text selectable className="text-2xl font-extrabold tracking-tight text-foreground">
            {isLoading ? '...' : `${successScore}`}
          </Text>
          <Text selectable className="text-xs leading-5 text-muted">
            Based on active bid activity and acceptance history.
          </Text>
        </View>
      </View>
    </Card>
  );
}
