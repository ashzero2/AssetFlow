export function formatCurrency(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    const absAmount = Math.abs(amount);
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(absAmount);
    return `₹${formatted}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (absAmount >= 10000000) {
    return `${sign}₹${(absAmount / 10000000).toFixed(2)}Cr`;
  }
  if (absAmount >= 100000) {
    return `${sign}₹${(absAmount / 100000).toFixed(2)}L`;
  }
  if (absAmount >= 1000) {
    return `${sign}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  return `${sign}₹${absAmount.toFixed(0)}`;
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}

export function formatPercentage(value: number, decimals = 1): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

