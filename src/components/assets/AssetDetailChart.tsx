import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useTheme } from '../../theme';
import { Asset } from '../../db/queries/assets';
import { formatCurrencyCompact } from '../../utils/currency';

interface AssetDetailChartProps {
  asset: Asset;
}

export function AssetDetailChart({ asset }: AssetDetailChartProps) {
  const { theme } = useTheme();

  // Build a simple 2-point line chart: buy → current
  const hasBuyData = asset.units > 0 && asset.buy_price > 0;
  const investedValue = asset.buy_price * asset.units;
  const currentValue = asset.current_value;
  const isPositive = currentValue >= investedValue;
  const lineColor = isPositive ? theme.colors.income : theme.colors.expense;

  if (!hasBuyData) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
          Add units & buy price to see P&L chart
        </Text>
      </View>
    );
  }

  const data = [
    {
      value: Math.round(investedValue / 1000),
      label: 'Invested',
      labelTextStyle: { color: theme.colors.textSecondary, fontSize: 10 },
      dataPointText: formatCurrencyCompact(investedValue),
    },
    {
      value: Math.round(currentValue / 1000),
      label: 'Current',
      labelTextStyle: { color: theme.colors.textSecondary, fontSize: 10 },
      dataPointText: formatCurrencyCompact(currentValue),
    },
  ];

  return (
    <View>
      <LineChart
        data={data}
        width={260}
        height={120}
        color={lineColor}
        thickness={2.5}
        dataPointsColor={lineColor}
        dataPointsRadius={5}
        startFillColor={lineColor}
        endFillColor={theme.colors.surface}
        startOpacity={0.2}
        endOpacity={0.02}
        areaChart
        xAxisColor={theme.colors.border}
        yAxisColor={theme.colors.border}
        yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
        xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
        rulesColor={theme.colors.border}
        isAnimated
        textFontSize={10}
        textColor={theme.colors.text}
        textShiftY={-8}
      />
    </View>
  );
}

