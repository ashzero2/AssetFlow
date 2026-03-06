import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useGoalsStore } from '../../../src/store/useGoalsStore';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { useTransactionsStore } from '../../../src/store/useTransactionsStore';
import { GoalCard } from '../../../src/components/goals/GoalCard';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { computeGoalProgress } from '../../../src/utils/calculations';

export default function GoalsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const goals = useGoalsStore(s => s.goals);
  const links = useGoalsStore(s => s.links);
  const loadGoals = useGoalsStore(s => s.load);
  const loadLinks = useGoalsStore(s => s.loadLinks);
  const assets = useAssetsStore(s => s.assets);
  const transactions = useTransactionsStore(s => s.transactions);

  // Reload goals every time this screen is focused (e.g. after adding from dashboard)
  useFocusEffect(
    React.useCallback(() => {
      loadGoals();
    }, [])
  );

  useEffect(() => {
    goals.forEach(g => loadLinks(g.id));
  }, [goals.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
      }}>
        <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
          Goals
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/goals/add')}
          style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: theme.colors.primary,
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            emoji="🎯"
            title="No goals yet"
            description="Set a savings goal and track your progress"
            actionLabel="Create Goal"
            onAction={() => router.push('/(tabs)/goals/add')}
          />
        }
        renderItem={({ item }) => {
          const goalLinks = links[item.id] ?? [];
          const { saved, progress } = computeGoalProgress(item, goalLinks, assets, transactions);
          return (
            <GoalCard
              goal={item}
              saved={saved}
              progress={progress}
              onPress={() => router.push(`/(tabs)/goals/${item.id}`)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

