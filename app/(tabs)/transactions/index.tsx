import React, { useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useTransactionsStore } from '../../../src/store/useTransactionsStore';
import { TransactionFilterBar } from '../../../src/components/transactions/TransactionFilterBar';
import { TransactionItem } from '../../../src/components/transactions/TransactionItem';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { formatCurrencyCompact } from '../../../src/utils/currency';
import { groupByDate } from '../../../src/utils/date';
import { format } from 'date-fns';

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const transactions = useTransactionsStore(s => s.transactions);
  const removeTransaction = useTransactionsStore(s => s.remove);
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthStr = format(selectedMonth, 'yyyy-MM');
  const filtered = transactions.filter(t => {
    const matchType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchMonth = t.date.startsWith(monthStr);
    return matchType && matchMonth;
  });

  const grouped = groupByDate(filtered);
  const sections = grouped.map(g => ({ title: g.displayDate, data: g.items }));

  const totalIncome = filtered.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
      }}>
        <View>
          <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
            Transactions
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.income }}>
              +{formatCurrencyCompact(totalIncome)}
            </Text>
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.expense }}>
              -{formatCurrencyCompact(totalExpense)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/transactions/add')}
          style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: theme.colors.primary,
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TransactionFilterBar
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <SectionList
        sections={sections}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            emoji="💸"
            title="No transactions"
            description="Track your income and expenses to get insights"
            actionLabel="Add Transaction"
            onAction={() => router.push('/(tabs)/transactions/add')}
          />
        }
        renderSectionHeader={({ section }) => (
          <View style={{
            backgroundColor: theme.colors.background,
            paddingHorizontal: 16, paddingVertical: 8,
            borderBottomWidth: 1, borderBottomColor: theme.colors.border,
          }}>
            <Text style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {section.title}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, backgroundColor: theme.colors.surface }}>
            <TransactionItem
              transaction={item}
              onPress={() => router.push({ pathname: '/(tabs)/transactions/add', params: { edit: String(item.id) } })}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

