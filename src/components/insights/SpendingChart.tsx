import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTheme } from '../../theme';
import { getCategoryInfo } from '../../constants/transactionCategories';

interface SpendingChartProps {
  data: { category: string; amount: number }[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  const { theme } = useTheme();
  const COLORS = ['#5C6BC0', '#00897B', '#F57C00', '#E53935', '#8E24AA', '#0288D1', '#43A047', '#FB8C00'];

  if (data.length === 0) {
    return (
      <View style={{ alignItems: 'center', padding: 24 }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>No expense data</Text>
      </View>
    );
  }

  const total = data.reduce((s, d) => s + d.amount, 0);
  const pieData = data.map((d, i) => ({
    value: d.amount,
    color: COLORS[i % COLORS.length],
    text: `${Math.round((d.amount / total) * 100)}%`,
    label: getCategoryInfo(d.category).label,
    frontColor: COLORS[i % COLORS.length],
  }));

  return (
    <View style={{ alignItems: 'center' }}>
      <PieChart
        data={pieData}
        donut
        radius={90}
        innerRadius={55}
        innerCircleColor={theme.colors.surface}
        centerLabelComponent={() => (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>Total</Text>
            <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
              ₹{Math.round(total / 1000)}K
            </Text>
          </View>
        )}
      />
      {/* Legend */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16, gap: 10 }}>
        {pieData.slice(0, 6).map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color }} />
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

