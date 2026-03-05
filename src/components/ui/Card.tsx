import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface CardProps extends ViewProps {
  padding?: number;
  elevated?: boolean;
}

export function Card({ style, padding, elevated = true, ...props }: CardProps) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          padding: padding ?? theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...(elevated && {
            shadowColor: theme.isDark ? '#000' : '#4A5568',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme.isDark ? 0.4 : 0.08,
            shadowRadius: 8,
            elevation: 3,
          }),
        },
        style,
      ]}
      {...props}
    />
  );
}

