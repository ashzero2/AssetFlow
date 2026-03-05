import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, subMonths, addMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useTransactionsStore } from '../../../src/store/useTransactionsStore';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { useEssentialsStore } from '../../../src/store/useEssentialsStore';
import { Card } from '../../../src/components/ui/Card';
import { SpendingChart } from '../../../src/components/insights/SpendingChart';
import { IncomeExpenseChart } from '../../../src/components/insights/IncomeExpenseChart';
import { NetWorthTrend } from '../../../src/components/insights/NetWorthTrend';
import { InsightTip } from '../../../src/components/insights/InsightTip';
import { computeMonthlySummary, computeSavingsRate } from '../../../src/utils/calculations';
import { formatCurrency, formatCurrencyCompact } from '../../../src/utils/currency';

export default function InsightsScreen() {
  const { theme } = useTheme();
  const transactions = useTransactionsStore(s => s.transactions);
  const assets = useAssetsStore(s => s.assets);
  const essentials = useEssentialsStore(s => s.essentials);
  const snapshots = useEssentialsStore(s => s.snapshots);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthStr = format(selectedMonth, 'yyyy-MM');
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth() + 1;

  const summary = computeMonthlySummary(transactions, year, month);
  const savingsRate = computeSavingsRate(summary.income, summary.expense);

  // Spending by category for selected month
  const monthExpenses = transactions.filter(t => t.type === 'EXPENSE' && t.date.startsWith(monthStr));
  const categoryTotals: Record<string, number> = {};
  monthExpenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] ?? 0) + t.amount;
  });
  const spendingData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Last 6 months income/expense
  const barData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(selectedMonth, 5 - i);
    const s = computeMonthlySummary(transactions, d.getFullYear(), d.getMonth() + 1);
    return { month: format(d, 'MMM'), income: s.income, expense: s.expense };
  });

  // Insights tips
  const efEssential = essentials.filter(e => e.type === 'EMERGENCY_FUND');
  const efTotal = efEssential.reduce((s, e) => s + e.current_amount, 0);
  const efTarget = efEssential.reduce((s, e) => s + e.target_amount, 0);
  const efRatio = efTarget > 0 ? (efTotal / efTarget) * 100 : 0;

  const hasTermInsurance = essentials.some(e => e.type === 'TERM_INSURANCE' && e.current_amount > 0);
  const hasHealthInsurance = essentials.some(e => e.type === 'HEALTH_INSURANCE' && e.current_amount > 0);
  const totalAssets = assets.reduce((s, a) => s + a.current_value, 0);

  const tips: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; type: 'info' | 'warning' | 'success' | 'danger' }[] = [];

  if (savingsRate >= 20) {
    tips.push({ icon: 'trending-up', title: `Great savings rate: ${savingsRate}%`, description: 'You\'re saving over 20% of your income this month. Keep it up!', type: 'success' });
  } else if (savingsRate > 0) {
    tips.push({ icon: 'alert-circle', title: `Savings rate: ${savingsRate}%`, description: 'Try to save at least 20% of your monthly income. Review your expenses to find areas to cut.', type: 'warning' });
  } else if (summary.income > 0) {
    tips.push({ icon: 'warning', title: 'Spending exceeds income', description: 'Your expenses this month exceed your income. Review your spending categories.', type: 'danger' });
  }

  if (efRatio < 50 && efTarget > 0) {
    tips.push({ icon: 'shield-outline', title: 'Build your emergency fund', description: `Your emergency fund is at ${Math.round(efRatio)}% of target. Aim for ${formatCurrency(efTarget)} (3–6 months of expenses).`, type: 'warning' });
  } else if (efRatio >= 100) {
    tips.push({ icon: 'shield-checkmark', title: 'Emergency fund is healthy!', description: 'You have a fully funded emergency fund. Great financial cushion!', type: 'success' });
  }

  if (!hasTermInsurance) {
    tips.push({ icon: 'person-outline', title: 'No term insurance', description: 'Consider getting term life insurance to protect your dependents financially.', type: 'warning' });
  }
  if (!hasHealthInsurance) {
    tips.push({ icon: 'medkit-outline', title: 'No health insurance', description: 'Health insurance protects you from large, unexpected medical expenses. Set it up in Essentials.', type: 'danger' });
  }
  if (totalAssets > 0) {
    tips.push({ icon: 'pie-chart-outline', title: 'Portfolio diversification', description: `You have ${assets.length} asset(s) worth ${formatCurrencyCompact(totalAssets)}. Diversify across asset types for better risk management.`, type: 'info' });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
          Insights
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Month selector */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16, paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, minWidth: 120, textAlign: 'center' }}>
            {format(selectedMonth, 'MMMM yyyy')}
          </Text>
          <TouchableOpacity onPress={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Monthly summary stats */}
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 16 }}>
          {[
            { label: 'Income', value: summary.income, color: theme.colors.income },
            { label: 'Expense', value: summary.expense, color: theme.colors.expense },
            { label: 'Savings', value: summary.savings, color: theme.colors.primary },
          ].map(item => (
            <View key={item.label} style={{
              flex: 1, backgroundColor: theme.colors.surface,
              borderRadius: 12, padding: 12,
              borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center',
            }}>
              <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold, color: item.color }}>
                {formatCurrencyCompact(Math.abs(item.value))}
              </Text>
              <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, marginTop: 2 }}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Income vs Expense Chart */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Card>
            <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 16 }}>
              Income vs Expense (6 months)
            </Text>
            <IncomeExpenseChart data={barData} />
          </Card>
        </View>

        {/* Spending Breakdown */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Card>
            <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 16 }}>
              Spending Breakdown
            </Text>
            <SpendingChart data={spendingData} />
          </Card>
        </View>

        {/* Net Worth Trend */}
        {snapshots.length >= 2 && (
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Card>
              <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 16 }}>
                Net Worth Trend
              </Text>
              <NetWorthTrend snapshots={snapshots} />
            </Card>
          </View>
        )}

        {/* Tips */}
        {tips.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 12 }}>
              💡 Insights & Tips
            </Text>
            {tips.map((tip, i) => (
              <InsightTip key={i} icon={tip.icon as any} title={tip.title} description={tip.description} type={tip.type} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


