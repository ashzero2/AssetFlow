import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Goal } from '../../db/queries/goals';
import { useTheme } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { getDaysUntil } from '../../utils/date';

interface GoalCardProps {
  goal: Goal;
  saved: number;
  progress: number;
  onPress: () => void;
}

export function GoalCard({ goal, saved, progress, onPress }: GoalCardProps) {
  const { theme } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const daysLeft = goal.deadline ? getDaysUntil(goal.deadline) : null;

  const size = 56;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.isDark ? 0.3 : 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}>
        {/* Progress ring */}
        <View style={{ marginRight: 14, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={theme.colors.surfaceAlt}
              strokeWidth={strokeWidth} fill="none"
            />
            <Circle
              cx={size / 2} cy={size / 2} r={radius}
              stroke={goal.color ?? theme.colors.primary}
              strokeWidth={strokeWidth} fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </Svg>
          <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: goal.icon ? 18 : 12 }}>{goal.icon}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
            color: theme.colors.text, marginBottom: 3,
          }} numberOfLines={1}>{goal.name}</Text>
          <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
            {formatCurrency(saved)} of {formatCurrency(goal.target_amount)}
          </Text>
          {daysLeft !== null && (
            <Text style={{
              fontSize: theme.fontSize.xs,
              color: daysLeft < 30 ? theme.colors.warning : theme.colors.textSecondary,
              marginTop: 2,
            }}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Deadline passed'}
            </Text>
          )}
        </View>

        {/* Percentage */}
        <Text style={{
          fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold,
          color: goal.color ?? theme.colors.primary,
        }}>{Math.round(clampedProgress)}%</Text>
      </View>
    </TouchableOpacity>
  );
}


