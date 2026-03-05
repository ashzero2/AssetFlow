import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTheme } from '../../theme';

interface IncomeExpenseChartProps {
  data: { month: string; income: number; expense: number }[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <View style={{ alignItems: 'center', padding: 24 }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>No data available</Text>
      </View>
    );
  }

  const barData = data.flatMap(d => [
    { value: Math.round(d.income / 1000), label: d.month.slice(0, 3), frontColor: theme.colors.income, spacing: 2, labelTextStyle: { color: theme.colors.textSecondary, fontSize: 10 } },
    { value: Math.round(d.expense / 1000), frontColor: theme.colors.expense, spacing: 18 },
  ]);

  return (
    <View>
      <BarChart
        data={barData}
        barWidth={14}
        noOfSections={4}
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
        hideRules={false}
        rulesColor={theme.colors.border}
        backgroundColor={theme.colors.surface}
        isAnimated
        width={280}
        height={160}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.colors.income }} />
          <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>Income</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: theme.colors.expense }} />
          <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>Expense</Text>
        </View>
      </View>
    </View>
  );
}


