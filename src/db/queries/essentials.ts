import { getDb } from '../client';
import { nowISO } from '../../utils/date';
import { EssentialType } from '../../constants/essentialTypes';

export interface Essential {
  id: number;
  type: EssentialType;
  label?: string;
  target_amount: number;
  current_amount: number;
  provider?: string;
  renewal_date?: string;
  premium?: number;
  notes?: string;
  updated_at: string;
}

export type NewEssential = Omit<Essential, 'id' | 'updated_at'>;

export function getAllEssentials(): Essential[] {
  const db = getDb();
  return db.getAllSync('SELECT * FROM essentials ORDER BY type, id') as Essential[];
}

export function getEssentialById(id: number): Essential | null {
  const db = getDb();
  return db.getFirstSync('SELECT * FROM essentials WHERE id = ?', [id]) as Essential | null;
}

export function insertEssential(e: NewEssential): number {
  const db = getDb();
  const now = nowISO();
  const result = db.runSync(
    `INSERT INTO essentials (type, label, target_amount, current_amount, provider, renewal_date, premium, notes, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [e.type, e.label ?? null, e.target_amount, e.current_amount, e.provider ?? null,
     e.renewal_date ?? null, e.premium ?? 0, e.notes ?? null, now]
  );
  return result.lastInsertRowId;
}

export function updateEssential(id: number, e: Partial<NewEssential>): void {
  const db = getDb();
  const existing = getEssentialById(id);
  if (!existing) return;
  const merged = { ...existing, ...e };
  const now = nowISO();
  db.runSync(
    `UPDATE essentials SET type=?, label=?, target_amount=?, current_amount=?, provider=?, renewal_date=?, premium=?, notes=?, updated_at=? WHERE id=?`,
    [merged.type, merged.label ?? null, merged.target_amount, merged.current_amount,
     merged.provider ?? null, merged.renewal_date ?? null, merged.premium ?? 0,
     merged.notes ?? null, now, id]
  );
}

export function deleteEssential(id: number): void {
  const db = getDb();
  db.runSync('DELETE FROM essentials WHERE id = ?', [id]);
}

// Net worth snapshots
export interface NetWorthSnapshot {
  id: number;
  snapshot_date: string;
  net_worth: number;
  total_assets: number;
  total_liabilities: number;
}

export function getNetWorthSnapshots(limit = 12): NetWorthSnapshot[] {
  const db = getDb();
  return db.getAllSync(
    'SELECT * FROM net_worth_snapshots ORDER BY snapshot_date DESC LIMIT ?', [limit]
  ) as NetWorthSnapshot[];
}

export function upsertNetWorthSnapshot(date: string, netWorth: number, totalAssets: number): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO net_worth_snapshots (snapshot_date, net_worth, total_assets)
     VALUES (?, ?, ?)
     ON CONFLICT(snapshot_date) DO UPDATE SET net_worth=excluded.net_worth, total_assets=excluded.total_assets`,
    [date, netWorth, totalAssets]
  );
}

