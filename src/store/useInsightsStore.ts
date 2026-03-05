import { create } from 'zustand';
import { Asset } from '../db/queries/assets';
import { Transaction } from '../db/queries/transactions';
import { Goal, GoalLink } from '../db/queries/goals';
import { Essential } from '../db/queries/essentials';
import { computeNetWorth, computeGoalProgress, computeMonthlySummary, computeSavingsRate } from '../utils/calculations';

interface InsightsState {
  /** Compute net worth from a list of assets */
  getNetWorth: (assets: Asset[]) => number;

  /** Compute monthly income/expense/savings */
  getMonthlySummary: (
    transactions: Transaction[],
    year: number,
    month: number
  ) => { income: number; expense: number; savings: number };

  /** Compute savings rate as a percentage */
  getSavingsRate: (income: number, expense: number) => number;

  /** Compute goal progress */
  getGoalProgress: (
    goal: Goal,
    links: GoalLink[],
    assets: Asset[],
    transactions: Transaction[]
  ) => { saved: number; progress: number };

  /** Spending breakdown by category for a given month */
  getSpendingByCategory: (
    transactions: Transaction[],
    year: number,
    month: number
  ) => { category: string; amount: number }[];

  /** Check whether essentials are healthy */
  getEssentialsHealth: (essentials: Essential[]) => {
    hasEmergencyFund: boolean;
    emergencyFundRatio: number;
    hasTermInsurance: boolean;
    hasHealthInsurance: boolean;
  };
}

export const useInsightsStore = create<InsightsState>(() => ({
  getNetWorth: (assets) => computeNetWorth(assets),

  getMonthlySummary: (transactions, year, month) =>
    computeMonthlySummary(transactions, year, month),

  getSavingsRate: (income, expense) => computeSavingsRate(income, expense),

  getGoalProgress: (goal, links, assets, transactions) =>
    computeGoalProgress(goal, links, assets, transactions),

  getSpendingByCategory: (transactions, year, month) => {
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const expenses = transactions.filter(
      (t) => t.type === 'EXPENSE' && t.date.startsWith(prefix)
    );
    const totals: Record<string, number> = {};
    expenses.forEach((t) => {
      totals[t.category] = (totals[t.category] ?? 0) + t.amount;
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  },

  getEssentialsHealth: (essentials) => {
    const efItems = essentials.filter((e) => e.type === 'EMERGENCY_FUND');
    const efCurrent = efItems.reduce((s, e) => s + e.current_amount, 0);
    const efTarget = efItems.reduce((s, e) => s + e.target_amount, 0);

    return {
      hasEmergencyFund: efCurrent > 0,
      emergencyFundRatio: efTarget > 0 ? (efCurrent / efTarget) * 100 : 0,
      hasTermInsurance: essentials.some(
        (e) => e.type === 'TERM_INSURANCE' && e.current_amount > 0
      ),
      hasHealthInsurance: essentials.some(
        (e) => e.type === 'HEALTH_INSURANCE' && e.current_amount > 0
      ),
    };
  },
}));

