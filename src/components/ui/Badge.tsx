import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../theme';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
}

export function Badge({ label, color, size = 'md' }: BadgeProps) {
  const { theme } = useTheme();
  const bgColor = color ? `${color}22` : theme.colors.primaryMuted;
  const textColor = color ?? theme.colors.primary;

  return (
    <View style={{
      backgroundColor: bgColor,
      paddingHorizontal: size === 'sm' ? 6 : 10,
      paddingVertical: size === 'sm' ? 2 : 4,
      borderRadius: 99,
      alignSelf: 'flex-start',
    }}>
      <Text style={{
        color: textColor,
        fontSize: size === 'sm' ? theme.fontSize.xs : theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        letterSpacing: 0.3,
      }}>
        {label}
      </Text>
    </View>
  );
}

