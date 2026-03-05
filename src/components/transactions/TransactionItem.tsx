import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Transaction } from '../../db/queries/transactions';
import { useTheme } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { formatDateShort } from '../../utils/date';
import { getCategoryInfo } from '../../constants/transactionCategories';

interface TransactionItemProps {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionItem({ transaction, onPress }: TransactionItemProps) {
  const { theme } = useTheme();
  const catInfo = getCategoryInfo(transaction.category);
  const isIncome = transaction.type === 'INCOME';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 12, paddingHorizontal: 4,
      }}>
        <View style={{
          width: 42, height: 42, borderRadius: 12,
          backgroundColor: isIncome ? theme.colors.incomeMuted : theme.colors.expenseMuted,
          alignItems: 'center', justifyContent: 'center', marginRight: 12,
        }}>
          <Text style={{ fontSize: 20 }}>{catInfo.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium,
            color: theme.colors.text, marginBottom: 2,
          }} numberOfLines={1}>{transaction.description || catInfo.label}</Text>
          <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
            {catInfo.label} · {formatDateShort(transaction.date)}
          </Text>
        </View>
        <Text style={{
          fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold,
          color: isIncome ? theme.colors.income : theme.colors.expense,
        }}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

