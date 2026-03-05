import React from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme } from '../../theme';
import { format, subMonths, addMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

interface TransactionFilterBarProps {
  typeFilter: 'ALL' | 'INCOME' | 'EXPENSE';
  onTypeChange: (type: 'ALL' | 'INCOME' | 'EXPENSE') => void;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function TransactionFilterBar({
  typeFilter, onTypeChange, selectedMonth, onMonthChange,
}: TransactionFilterBarProps) {
  const { theme } = useTheme();
  const types: { value: 'ALL' | 'INCOME' | 'EXPENSE'; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'INCOME', label: 'Income' },
    { value: 'EXPENSE', label: 'Expense' },
  ];

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 16, paddingVertical: 12,
      borderBottomWidth: 1, borderBottomColor: theme.colors.border,
      gap: 12,
    }}>
      {/* Month selector */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => onMonthChange(subMonths(selectedMonth, 1))}>
          <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={{
          fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text, minWidth: 120, textAlign: 'center',
        }}>{format(selectedMonth, 'MMMM yyyy')}</Text>
        <TouchableOpacity onPress={() => onMonthChange(addMonths(selectedMonth, 1))}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Type filter pills */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {types.map(t => {
          const isActive = typeFilter === t.value;
          return (
            <TouchableOpacity
              key={t.value}
              onPress={() => onTypeChange(t.value)}
              style={{
                flex: 1, paddingVertical: 8, borderRadius: 10,
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceAlt,
                alignItems: 'center',
              }}
            >
              <Text style={{
                fontSize: theme.fontSize.sm,
                fontWeight: isActive ? theme.fontWeight.semibold : theme.fontWeight.regular,
                color: isActive ? '#fff' : theme.colors.textSecondary,
              }}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

