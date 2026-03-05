import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../../theme';
import { NetWorthSnapshot } from '../../db/queries/essentials';

interface NetWorthTrendProps {
  snapshots: NetWorthSnapshot[];
}

export function NetWorthTrend({ snapshots }: NetWorthTrendProps) {
  const { theme } = useTheme();

  if (snapshots.length < 2) {
    return (
      <View style={{ alignItems: 'center', padding: 24 }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
          Need at least 2 data points to show trend
        </Text>
      </View>
    );
  }

  const sorted = [...snapshots].sort((a, b) => a.snapshot_date.localeCompare(b.snapshot_date));
  const lineData = sorted.map(s => ({
    value: Math.round(s.net_worth / 1000),
    dataPointText: '',
    label: s.snapshot_date.slice(5, 7) + '/' + s.snapshot_date.slice(2, 4),
    labelTextStyle: { color: theme.colors.textSecondary, fontSize: 10 },
  }));

  return (
    <View>
      <LineChart
        data={lineData}
        width={280}
        height={150}
        color={theme.colors.primary}
        thickness={2.5}
        dataPointsColor={theme.colors.primary}
        dataPointsRadius={4}
        startFillColor={theme.colors.primary}
        endFillColor={theme.colors.surface}
        startOpacity={0.25}
        endOpacity={0.02}
        areaChart
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
        rulesColor={theme.colors.border}
        isAnimated
        hideDataPoints={false}
      />
    </View>
  );
}


