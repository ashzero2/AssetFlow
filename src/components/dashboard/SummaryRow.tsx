import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';
import { formatCurrencyCompact } from '../../utils/currency';

interface SummaryRowProps {
  income: number;
  expense: number;
  savings: number;
}

export function SummaryRow({ income, expense, savings }: SummaryRowProps) {
  const { theme } = useTheme();

  const items = [
    { label: 'Income', value: income, color: theme.colors.income, bg: theme.colors.incomeMuted, icon: '↑' },
    { label: 'Expense', value: expense, color: theme.colors.expense, bg: theme.colors.expenseMuted, icon: '↓' },
    { label: 'Savings', value: savings, color: savings >= 0 ? theme.colors.income : theme.colors.expense, bg: theme.colors.primaryMuted, icon: '=' },
  ];

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginVertical: 8 }}>
      {items.map((item) => (
        <View key={item.label} style={{
          flex: 1,
          backgroundColor: theme.colors.surface,
          borderRadius: 14,
          padding: 12,
          borderWidth: 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
        }}>
          <View style={{
            width: 28, height: 28, borderRadius: 8,
            backgroundColor: item.bg,
            alignItems: 'center', justifyContent: 'center', marginBottom: 6,
          }}>
            <Text style={{ color: item.color, fontWeight: 'bold', fontSize: 14 }}>{item.icon}</Text>
          </View>
          <Text style={{
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.bold,
            color: item.color,
          }}>{formatCurrencyCompact(Math.abs(item.value))}</Text>
          <Text style={{
            fontSize: theme.fontSize.xs,
            color: theme.colors.textSecondary,
            marginTop: 2,
          }}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

