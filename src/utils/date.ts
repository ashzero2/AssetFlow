import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function formatDate(dateStr: string, fmt = 'dd MMM yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  return formatDate(dateStr, 'dd MMM');
}

export function formatMonthYear(dateStr: string): string {
  return formatDate(dateStr, 'MMM yyyy');
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function groupByMonth<T extends { date: string }>(
  items: T[]
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    const key = formatDate(item.date, 'yyyy-MM');
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function groupByDate<T extends { date: string }>(
  items: T[]
): { date: string; displayDate: string; items: T[] }[] {
  const map: Record<string, T[]> = {};
  for (const item of items) {
    const key = item.date.substring(0, 10);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  }
  return Object.entries(map)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({
      date,
      displayDate: formatDate(date),
      items,
    }));
}

export function getDaysUntil(dateStr: string): number {
  const target = parseISO(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

