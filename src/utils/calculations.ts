import { Asset } from '../db/queries/assets';
import { Transaction } from '../db/queries/transactions';
import { Goal, GoalLink } from '../db/queries/goals';

export function computeNetWorth(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + (a.current_value ?? 0), 0);
}

export function computeGoalProgress(
  goal: Goal,
  links: GoalLink[],
  assets: Asset[],
  transactions: Transaction[]
): { saved: number; progress: number } {
  let saved = 0;

  for (const link of links) {
    if (link.link_type === 'ASSET' && link.asset_id) {
      const asset = assets.find(a => a.id === link.asset_id);
      if (asset) saved += asset.current_value ?? 0;
    } else if (link.link_type === 'TRANSACTION_CATEGORY' && link.category) {
      const total = transactions
        .filter(t => t.category === link.category && t.type === 'INCOME')
        .reduce((s, t) => s + t.amount, 0);
      saved += total;
    } else if (link.link_type === 'MANUAL') {
      saved += link.manual_amount ?? 0;
    }
  }

  const progress = goal.target_amount > 0 ? Math.min((saved / goal.target_amount) * 100, 100) : 0;
  return { saved, progress };
}

export function computeMonthlySummary(
  transactions: Transaction[],
  year: number,
  month: number // 1-based
): { income: number; expense: number; savings: number } {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const filtered = transactions.filter(t => t.date.startsWith(prefix));
  const income = filtered.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0);
  return { income, expense, savings: income - expense };
}

export function computeSavingsRate(income: number, expense: number): number {
  if (income === 0) return 0;
  return Math.round(((income - expense) / income) * 100);
}

export function computePnL(
  buyPrice: number,
  currentPrice: number,
  units: number
): { pnlAmount: number; pnlPercent: number } {
  const invested = buyPrice * units;
  const current = currentPrice * units;
  const pnlAmount = current - invested;
  const pnlPercent = invested > 0 ? (pnlAmount / invested) * 100 : 0;
  return { pnlAmount, pnlPercent };
}

