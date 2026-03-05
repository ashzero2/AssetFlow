import { getDb } from '../client';
import { nowISO, todayISO } from '../../utils/date';
import { TransactionCategory } from '../../constants/transactionCategories';

export interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string;
  asset_id?: number;
  created_at: string;
}

export type NewTransaction = Omit<Transaction, 'id' | 'created_at'>;

export function getAllTransactions(): Transaction[] {
  const db = getDb();
  return db.getAllSync('SELECT * FROM transactions ORDER BY date DESC, id DESC') as Transaction[];
}

export function getTransactionById(id: number): Transaction | null {
  const db = getDb();
  return db.getFirstSync('SELECT * FROM transactions WHERE id = ?', [id]) as Transaction | null;
}

export function insertTransaction(tx: NewTransaction): number {
  const db = getDb();
  const now = nowISO();
  const result = db.runSync(
    `INSERT INTO transactions (type, amount, category, description, date, asset_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [tx.type, tx.amount, tx.category, tx.description ?? null, tx.date, tx.asset_id ?? null, now]
  );
  return result.lastInsertRowId;
}

export function updateTransaction(id: number, tx: Partial<NewTransaction>): void {
  const db = getDb();
  const existing = getTransactionById(id);
  if (!existing) return;
  const merged = { ...existing, ...tx };
  db.runSync(
    `UPDATE transactions SET type=?, amount=?, category=?, description=?, date=?, asset_id=? WHERE id=?`,
    [merged.type, merged.amount, merged.category, merged.description ?? null,
     merged.date, merged.asset_id ?? null, id]
  );
}

export function deleteTransaction(id: number): void {
  const db = getDb();
  db.runSync('DELETE FROM transactions WHERE id = ?', [id]);
}

