import { Asset } from '../db/queries/assets';
import { Transaction } from '../db/queries/transactions';
import { Goal, GoalLink } from '../db/queries/goals';
import { AssetType } from '../constants/assetTypes';

export function computeNetWorth(assets: Asset[]): number {
  return assets.reduce((sum, a) => sum + (a.current_value ?? 0), 0);
}

// ─── Asset Grouping ──────────────────────────────────────────────────────────

export interface AssetGroup {
  groupKey: string;
  name: string;
  type: AssetType;
  ticker?: string;
  lots: Asset[];
  totalUnits: number;
  avgBuyPrice: number;      // weighted: Σ(units × buyPrice) / Σ(units)
  currentPrice: number;
  totalCurrentValue: number;
  totalInvested: number;    // Σ(units × buyPrice)
  pnlAmount: number;
  pnlPercent: number;
}

export function getGroupKey(asset: Asset): string {
  return asset.ticker?.trim() ? asset.ticker.trim().toUpperCase() : asset.name.trim().toLowerCase();
}

export function groupAssets(assets: Asset[]): AssetGroup[] {
  const map = new Map<string, Asset[]>();
  for (const a of assets) {
    const key = getGroupKey(a);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  }

  const groups: AssetGroup[] = [];
  for (const [groupKey, lots] of map.entries()) {
    const representative = lots[0];
    const totalUnits = lots.reduce((s, a) => s + a.units, 0);
    const totalInvested = lots.reduce((s, a) => s + a.units * a.buy_price, 0);
    const totalCurrentValue = lots.reduce((s, a) => s + a.current_value, 0);
    const avgBuyPrice = totalUnits > 0 ? totalInvested / totalUnits : 0;
    const currentPrice = representative.current_price;
    const pnlAmount = totalCurrentValue - totalInvested;
    const pnlPercent = totalInvested > 0 ? (pnlAmount / totalInvested) * 100 : 0;

    groups.push({
      groupKey,
      name: representative.name,
      type: representative.type,
      ticker: representative.ticker,
      lots,
      totalUnits,
      avgBuyPrice,
      currentPrice,
      totalCurrentValue,
      totalInvested,
      pnlAmount,
      pnlPercent,
    });
  }

  return groups.sort((a, b) => b.totalCurrentValue - a.totalCurrentValue);
}

// ─── Goal Progress ───────────────────────────────────────────────────────────

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
    } else if (link.link_type === 'ASSET_GROUP' && link.group_key) {
      // Sum current_value of ALL assets whose groupKey matches — new lots auto-count
      saved += assets
        .filter(a => getGroupKey(a) === link.group_key)
        .reduce((s, a) => s + (a.current_value ?? 0), 0);
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

