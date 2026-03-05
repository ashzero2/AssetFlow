import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Goal } from '../../db/queries/goals';
import { ProgressBar } from '../ui/ProgressBar';

interface GoalWithProgress {
  goal: Goal;
  progress: number;
}

export function GoalsMiniList({ goals }: { goals: GoalWithProgress[] }) {
  const { theme } = useTheme();
  const router = useRouter();
  const top3 = goals.slice(0, 3);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
          Goals
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
          <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.medium }}>
            View all →
          </Text>
        </TouchableOpacity>
      </View>
      {top3.length === 0 ? (
        <TouchableOpacity onPress={() => router.push('/(tabs)/goals/add')}
          style={{
            backgroundColor: theme.colors.surface, borderRadius: 14,
            padding: 16, alignItems: 'center', borderWidth: 1,
            borderColor: theme.colors.border, borderStyle: 'dashed',
          }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>+ Set your first goal</Text>
        </TouchableOpacity>
      ) : (
        top3.map(({ goal, progress }) => (
          <TouchableOpacity key={goal.id} onPress={() => router.push(`/(tabs)/goals/${goal.id}`)} activeOpacity={0.8}>
            <View style={{
              backgroundColor: theme.colors.surface, borderRadius: 12,
              padding: 12, marginBottom: 8, borderWidth: 1, borderColor: theme.colors.border,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>{goal.icon}</Text>
                <Text style={{ flex: 1, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.text }}>
                  {goal.name}
                </Text>
                <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold, color: goal.color ?? theme.colors.primary }}>
                  {Math.round(progress)}%
                </Text>
              </View>
              <ProgressBar progress={progress} color={goal.color ?? theme.colors.primary} height={5} />
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

