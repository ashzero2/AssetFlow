import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface ThemedViewProps extends ViewProps {
  variant?: 'background' | 'surface' | 'surfaceAlt';
}

export function ThemedView({ style, variant = 'background', ...props }: ThemedViewProps) {
  const { theme } = useTheme();
  const bgColor =
    variant === 'surface' ? theme.colors.surface :
    variant === 'surfaceAlt' ? theme.colors.surfaceAlt :
    theme.colors.background;

  return <View style={[{ backgroundColor: bgColor }, style]} {...props} />;
}

