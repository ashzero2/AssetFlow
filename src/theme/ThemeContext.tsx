import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorPalette } from './colors';
import { fontSize, fontWeight, lineHeight, letterSpacing } from './typography';
import spacing from './spacing';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: ColorPalette;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
  letterSpacing: typeof letterSpacing;
  spacing: typeof spacing;
  isDark: boolean;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function buildTheme(isDark: boolean): Theme {
  return {
    colors: isDark ? darkColors : lightColors,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    spacing,
    isDark,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemScheme === 'dark');

  const theme = buildTheme(isDark);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
}

