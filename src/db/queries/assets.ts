import { getDb } from '../client';
import { nowISO } from '../../utils/date';
import { AssetType } from '../../constants/assetTypes';

export interface Asset {
  id: number;
  name: string;
  type: AssetType;
  ticker?: string;
  units: number;
  buy_price: number;
  current_price: number;
  current_value: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type NewAsset = Omit<Asset, 'id' | 'created_at' | 'updated_at'>;

export function getAllAssets(): Asset[] {
  const db = getDb();
  return db.getAllSync('SELECT * FROM assets ORDER BY current_value DESC') as Asset[];
}

export function getAssetById(id: number): Asset | null {
  const db = getDb();
  return db.getFirstSync('SELECT * FROM assets WHERE id = ?', [id]) as Asset | null;
}

export function insertAsset(asset: NewAsset): number {
  const db = getDb();
  const now = nowISO();
  const result = db.runSync(
    `INSERT INTO assets (name, type, ticker, units, buy_price, current_price, current_value, currency, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [asset.name, asset.type, asset.ticker ?? null, asset.units, asset.buy_price,
     asset.current_price, asset.current_value, asset.currency, asset.notes ?? null, now, now]
  );
  return result.lastInsertRowId;
}

export function updateAsset(id: number, asset: Partial<NewAsset>): void {
  const db = getDb();
  const now = nowISO();
  const existing = getAssetById(id);
  if (!existing) return;
  const merged = { ...existing, ...asset };
  db.runSync(
    `UPDATE assets SET name=?, type=?, ticker=?, units=?, buy_price=?, current_price=?, current_value=?, currency=?, notes=?, updated_at=? WHERE id=?`,
    [merged.name, merged.type, merged.ticker ?? null, merged.units, merged.buy_price,
     merged.current_price, merged.current_value, merged.currency, merged.notes ?? null, now, id]
  );
}

export function deleteAsset(id: number): void {
  const db = getDb();
  db.runSync('DELETE FROM assets WHERE id = ?', [id]);
}

/**
 * Updates current_price and recalculates current_value (units * newPrice)
 * for every asset row sharing the same ticker. One call covers all lots.
 */
export function updatePriceByTicker(ticker: string, newPrice: number): number {
  const db = getDb();
  const now = nowISO();
  const result = db.runSync(
    `UPDATE assets
     SET current_price = ?,
         current_value = CASE WHEN units > 0 THEN units * ? ELSE ? END,
         updated_at = ?
     WHERE UPPER(TRIM(ticker)) = UPPER(TRIM(?))`,
    [newPrice, newPrice, newPrice, now, ticker]
  );
  return result.changes;
}

/**
 * Same as updatePriceByTicker but matches on name — for assets without a ticker.
 */
export function updatePriceByName(name: string, newPrice: number): number {
  const db = getDb();
  const now = nowISO();
  const result = db.runSync(
    `UPDATE assets
     SET current_price = ?,
         current_value = CASE WHEN units > 0 THEN units * ? ELSE ? END,
         updated_at = ?
     WHERE (ticker IS NULL OR TRIM(ticker) = '')
       AND LOWER(TRIM(name)) = LOWER(TRIM(?))`,
    [newPrice, newPrice, newPrice, now, name]
  );
  return result.changes;
}

