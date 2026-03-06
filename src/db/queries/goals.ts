import { getDb } from '../client';
import { nowISO } from '../../utils/date';

export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  deadline?: string;
  color: string;
  icon: string;
  notes?: string;
  created_at: string;
}

export interface GoalLink {
  id: number;
  goal_id: number;
  link_type: 'ASSET' | 'TRANSACTION_CATEGORY' | 'MANUAL' | 'ASSET_GROUP';
  asset_id?: number;
  category?: string;
  manual_amount?: number;
  group_key?: string;
}

export type NewGoal = Omit<Goal, 'id' | 'created_at'>;
export type NewGoalLink = Omit<GoalLink, 'id'>;

export function getAllGoals(): Goal[] {
  const db = getDb();
  return db.getAllSync('SELECT * FROM goals ORDER BY created_at DESC') as Goal[];
}

export function getGoalById(id: number): Goal | null {
  const db = getDb();
  return db.getFirstSync('SELECT * FROM goals WHERE id = ?', [id]) as Goal | null;
}

export function insertGoal(goal: NewGoal): number {
  const db = getDb();
  const now = nowISO();
  const result = db.runSync(
    `INSERT INTO goals (name, target_amount, deadline, color, icon, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [goal.name, goal.target_amount, goal.deadline ?? null, goal.color, goal.icon, goal.notes ?? null, now]
  );
  return result.lastInsertRowId;
}

export function updateGoal(id: number, goal: Partial<NewGoal>): void {
  const db = getDb();
  const existing = getGoalById(id);
  if (!existing) return;
  const merged = { ...existing, ...goal };
  db.runSync(
    `UPDATE goals SET name=?, target_amount=?, deadline=?, color=?, icon=?, notes=? WHERE id=?`,
    [merged.name, merged.target_amount, merged.deadline ?? null, merged.color, merged.icon, merged.notes ?? null, id]
  );
}

export function deleteGoal(id: number): void {
  const db = getDb();
  db.runSync('DELETE FROM goals WHERE id = ?', [id]);
}

// Goal Links
export function getGoalLinks(goalId: number): GoalLink[] {
  const db = getDb();
  return db.getAllSync('SELECT * FROM goal_links WHERE goal_id = ?', [goalId]) as GoalLink[];
}

export function insertGoalLink(link: NewGoalLink): number {
  const db = getDb();
  const result = db.runSync(
    `INSERT INTO goal_links (goal_id, link_type, asset_id, category, manual_amount, group_key)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [link.goal_id, link.link_type, link.asset_id ?? null, link.category ?? null, link.manual_amount ?? 0, link.group_key ?? null]
  );
  return result.lastInsertRowId;
}

export function deleteGoalLink(id: number): void {
  const db = getDb();
  db.runSync('DELETE FROM goal_links WHERE id = ?', [id]);
}

export function deleteAllGoalLinks(goalId: number): void {
  const db = getDb();
  db.runSync('DELETE FROM goal_links WHERE goal_id = ?', [goalId]);
}

