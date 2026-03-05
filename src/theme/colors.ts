export const lightColors = {
  background: '#F7F5F0',       // warm cream
  surface: '#FDFCFA',          // off-white, not stark white
  surfaceAlt: '#F0EDE6',       // warm linen
  border: '#E5E0D8',           // soft warm gray
  primary: '#7C9885',          // sage green
  primaryMuted: '#E4EDE7',     // pale sage
  primaryDark: '#5A7A65',      // deep sage
  text: '#2C2825',             // warm near-black
  textSecondary: '#8A8278',    // warm taupe
  textInverse: '#FDFCFA',
  success: '#5A8A6A',          // muted green
  successMuted: '#E4EDE7',
  warning: '#B07D4A',          // warm amber
  warningMuted: '#F5EBE0',
  danger: '#A05C5C',           // dusty rose-red
  dangerMuted: '#F5E6E6',
  info: '#5C7EA0',             // dusty blue
  infoMuted: '#E4EDF5',
  income: '#5A8A6A',
  incomeMuted: '#E4EDE7',
  expense: '#A05C5C',
  expenseMuted: '#F5E6E6',
  // Asset type colors — all muted/pastel
  mutualFund: '#7C9885',       // sage
  etf: '#7A9BAA',              // dusty teal-blue
  stock: '#B07D4A',            // warm amber
  realEstate: '#9A8070',       // warm brown
  crypto: '#9080A8',           // soft lavender
  other: '#8A8A8A',            // warm gray
  // Tab bar
  tabActive: '#7C9885',
  tabInactive: '#B0A898',
  tabBar: '#FDFCFA',
  tabBarBorder: '#E5E0D8',
  // Overlay
  overlay: 'rgba(44,40,37,0.45)',
  shimmer: '#E5E0D8',
};

export const darkColors: typeof lightColors = {
  background: '#1C1A18',       // warm dark espresso
  surface: '#252220',          // slightly lighter espresso
  surfaceAlt: '#2E2B28',       // warm dark card
  border: '#3A3632',           // muted warm border
  primary: '#8FAF9A',          // soft sage (lighter for dark)
  primaryMuted: '#263029',     // very dark sage
  primaryDark: '#7C9885',
  text: '#EDE8E2',             // warm off-white
  textSecondary: '#9A9288',    // warm muted
  textInverse: '#1C1A18',
  success: '#7AAF8A',
  successMuted: '#1E2E22',
  warning: '#C49A6A',
  warningMuted: '#2E2218',
  danger: '#C07878',
  dangerMuted: '#2E1E1E',
  info: '#7A9EC0',
  infoMuted: '#1A2535',
  income: '#7AAF8A',
  incomeMuted: '#1E2E22',
  expense: '#C07878',
  expenseMuted: '#2E1E1E',
  // Asset type colors
  mutualFund: '#8FAF9A',
  etf: '#8AB0BF',
  stock: '#C49A6A',
  realEstate: '#B09888',
  crypto: '#A898C0',
  other: '#9A9A9A',
  // Tab bar
  tabActive: '#8FAF9A',
  tabInactive: '#5A5550',
  tabBar: '#252220',
  tabBarBorder: '#3A3632',
  // Overlay
  overlay: 'rgba(0,0,0,0.6)',
  shimmer: '#3A3632',
};

export type ColorPalette = typeof lightColors;
