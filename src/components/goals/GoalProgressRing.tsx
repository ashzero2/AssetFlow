import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../theme';

interface GoalProgressRingProps {
  progress: number; // 0–100
  color?: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
  icon?: string;
}

export function GoalProgressRing({
  progress,
  color,
  size = 80,
  strokeWidth = 7,
  label,
  icon,
}: GoalProgressRingProps) {
  const { theme } = useTheme();
  const ringColor = color ?? theme.colors.primary;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }], position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {icon ? (
          <Text style={{ fontSize: size * 0.3 }}>{icon}</Text>
        ) : (
          <Text style={{
            fontSize: size * 0.2,
            fontWeight: theme.fontWeight.bold,
            color: ringColor,
          }}>
            {Math.round(clampedProgress)}%
          </Text>
        )}
        {label && (
          <Text style={{
            fontSize: 9,
            color: theme.colors.textSecondary,
            textAlign: 'center',
          }} numberOfLines={1}>
            {label}
          </Text>
        )}
      </View>
    </View>
  );
}

