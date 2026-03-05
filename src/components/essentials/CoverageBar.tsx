import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';

interface CoverageBarProps {
  current: number;
  target: number;
  color?: string;
  label?: string;
  showValues?: boolean;
}

export function CoverageBar({ current, target, color, label, showValues = true }: CoverageBarProps) {
  const { theme } = useTheme();
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  const barColor =
    color ??
    (progress >= 80
      ? theme.colors.success
      : progress >= 40
      ? theme.colors.warning
      : theme.colors.danger);

  return (
    <View>
      {(label || showValues) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          {label ? (
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>{label}</Text>
          ) : (
            <View />
          )}
          {showValues && (
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      )}

      {/* Track */}
      <View style={{
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.surfaceAlt,
        overflow: 'hidden',
      }}>
        {/* Fill */}
        <View style={{
          width: `${progress}%`,
          height: '100%',
          borderRadius: 5,
          backgroundColor: barColor,
        }} />
      </View>

      {/* Tick marks at 25%, 50%, 75% */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '25%',
        marginTop: 3,
      }}>
        {[25, 50, 75].map(tick => (
          <View
            key={tick}
            style={{
              width: 1,
              height: 4,
              backgroundColor: progress >= tick ? barColor : theme.colors.border,
            }}
          />
        ))}
      </View>
    </View>
  );
}

