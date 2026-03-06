import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorPalette } from './colors';
import { fontSize, fontWeight, lineHeight, letterSpacing } from './typography';
import spacing from './spacing';
import { getDb } from '../db/client';

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

function loadSavedThemeMode(): ThemeMode {
  try {
    const db = getDb();
    const row = db.getFirstSync<{ value: string }>(
      `SELECT value FROM settings WHERE key = ?`,
      ['theme_mode']
    );
    if (row && (row.value === 'light' || row.value === 'dark' || row.value === 'system')) {
      return row.value as ThemeMode;
    }
  } catch {
    // Table may not exist yet on first launch — fall back to system
  }
  return 'system';
}

function saveThemeMode(mode: ThemeMode) {
  try {
    const db = getDb();
    db.runSync(
      `INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`,
      ['theme_mode', mode]
    );
  } catch {
    // Silently fail — non-critical
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => loadSavedThemeMode());

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemeMode(mode);
  }, []);

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

