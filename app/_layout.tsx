import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../src/theme';
import { runMigrations } from '../src/db/migrations';
import { useAssetsStore } from '../src/store/useAssetsStore';
import { useTransactionsStore } from '../src/store/useTransactionsStore';
import { useGoalsStore } from '../src/store/useGoalsStore';
import { useEssentialsStore } from '../src/store/useEssentialsStore';

function AppInit() {
  const loadAssets = useAssetsStore(s => s.load);
  const loadTransactions = useTransactionsStore(s => s.load);
  const loadGoals = useGoalsStore(s => s.load);
  const loadEssentials = useEssentialsStore(s => s.load);
  const loadSnapshots = useEssentialsStore(s => s.loadSnapshots);
  const goals = useGoalsStore(s => s.goals);
  const loadLinks = useGoalsStore(s => s.loadLinks);
  const { theme } = useTheme();

  // Load all goal links whenever the goals list changes (covers cold-start + new goals)
  useEffect(() => {
    goals.forEach(g => loadLinks(g.id));
  }, [goals.length]);

  useEffect(() => {
    runMigrations();
    loadAssets();
    loadTransactions();
    loadGoals();
    loadEssentials();
    loadSnapshots();
  }, []);

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppInit />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

