import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Transaction } from '../../db/queries/transactions';
import { TransactionItem } from '../transactions/TransactionItem';

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  const { theme } = useTheme();
  const router = useRouter();
  const recent = transactions.slice(0, 5);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
          Recent Transactions
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.medium }}>
            View all →
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16, paddingHorizontal: 12,
        borderWidth: 1, borderColor: theme.colors.border,
      }}>
        {recent.length === 0 ? (
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions/add')}
            style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>+ Add a transaction</Text>
          </TouchableOpacity>
        ) : (
          recent.map((tx, i) => (
            <View key={tx.id}>
              <TransactionItem transaction={tx} onPress={() => router.push('/(tabs)/transactions')} />
              {i < recent.length - 1 && (
                <View style={{ height: 1, backgroundColor: theme.colors.border }} />
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

