import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';

interface ProgressBarProps {
  progress: number; // 0–100
  color?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  bgColor?: string;
}

export function ProgressBar({
  progress,
  color,
  height = 8,
  showLabel = false,
  label,
  bgColor,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const barColor = color ?? theme.colors.primary;
  const trackColor = bgColor ?? theme.colors.surfaceAlt;

  const getColor = () => {
    if (clampedProgress >= 100) return theme.colors.success;
    if (clampedProgress >= 60) return barColor;
    if (clampedProgress >= 30) return theme.colors.warning;
    return theme.colors.danger;
  };

  return (
    <View>
      {(showLabel || label) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          {label && <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>{label}</Text>}
          {showLabel && (
            <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      <View style={{ height, borderRadius: height, backgroundColor: trackColor, overflow: 'hidden' }}>
        <View style={{
          width: `${clampedProgress}%`,
          height: '100%',
          borderRadius: height,
          backgroundColor: color ?? getColor(),
        }} />
      </View>
    </View>
  );
}

