export type AssetType = 'MUTUAL_FUND' | 'ETF' | 'STOCK' | 'REAL_ESTATE' | 'CRYPTO' | 'OTHER';

export const ASSET_TYPES: { value: AssetType; label: string; icon: string }[] = [
  { value: 'MUTUAL_FUND', label: 'Mutual Fund', icon: '📈' },
  { value: 'ETF', label: 'ETF', icon: '📊' },
  { value: 'STOCK', label: 'Stock', icon: '💹' },
  { value: 'REAL_ESTATE', label: 'Real Estate', icon: '🏠' },
  { value: 'CRYPTO', label: 'Crypto', icon: '₿' },
  { value: 'OTHER', label: 'Other', icon: '💰' },
];

export const ASSET_TYPE_COLORS: Record<AssetType, string> = {
  MUTUAL_FUND: '#7C9885',
  ETF: '#7A9BAA',
  STOCK: '#B07D4A',
  REAL_ESTATE: '#9A8070',
  CRYPTO: '#9080A8',
  OTHER: '#8A8A8A',
};

export const ASSET_TYPE_SHORT: Record<AssetType, string> = {
  MUTUAL_FUND: 'MF',
  ETF: 'ETF',
  STOCK: 'STK',
  REAL_ESTATE: 'RE',
  CRYPTO: 'CRYPTO',
  OTHER: 'OTH',
};
