import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAssetsStore } from '../../src/store/useAssetsStore';
import { useTransactionsStore } from '../../src/store/useTransactionsStore';
import { useGoalsStore } from '../../src/store/useGoalsStore';
import { useEssentialsStore } from '../../src/store/useEssentialsStore';
import { NetWorthCard } from '../../src/components/dashboard/NetWorthCard';
import { SummaryRow } from '../../src/components/dashboard/SummaryRow';
import { AssetsMiniList } from '../../src/components/dashboard/AssetsMiniList';
import { GoalsMiniList } from '../../src/components/dashboard/GoalsMiniList';
import { RecentTransactions } from '../../src/components/dashboard/RecentTransactions';
import { computeGoalProgress, computeMonthlySummary } from '../../src/utils/calculations';
import { todayISO } from '../../src/utils/date';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const assets = useAssetsStore(s => s.assets);
  const transactions = useTransactionsStore(s => s.transactions);
  const goals = useGoalsStore(s => s.goals);
  const goalLinks = useGoalsStore(s => s.links);
  const saveSnapshot = useEssentialsStore(s => s.saveSnapshot);

  const totalAssets = assets.reduce((s, a) => s + a.current_value, 0);
  const now = new Date();
  const summary = computeMonthlySummary(transactions, now.getFullYear(), now.getMonth() + 1);

  // Take net worth snapshot once per day
  useEffect(() => {
    saveSnapshot(todayISO(), totalAssets, totalAssets);
  }, [totalAssets]);

  const goalsWithProgress = goals.map(goal => {
    const links = goalLinks[goal.id] ?? [];
    const { progress } = computeGoalProgress(goal, links, assets, transactions);
    return { goal, progress };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
        }}>
          <View>
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>Welcome back</Text>
            <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
              AssetFlow 🌿
            </Text>
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

        {/* Net Worth */}
        <NetWorthCard netWorth={totalAssets} totalAssets={totalAssets} />

        {/* Monthly Summary */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.medium, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            This Month
          </Text>
        </View>
        <SummaryRow income={summary.income} expense={summary.expense} savings={summary.savings} />

        <View style={{ height: 16 }} />

        {/* Assets Mini */}
        <AssetsMiniList assets={assets} />

        <View style={{ height: 16 }} />

        {/* Goals Mini */}
        <GoalsMiniList goals={goalsWithProgress} />

        <View style={{ height: 16 }} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions} />
      </ScrollView>
    </SafeAreaView>
  );
}

