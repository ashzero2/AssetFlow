import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface ThemedTextProps extends TextProps {
  variant?: 'body' | 'caption' | 'label' | 'title' | 'heading' | 'hero' | 'secondary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
}

export function ThemedText({
  style,
  variant = 'body',
  size,
  weight,
  color,
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();

  const variantStyles: Record<string, object> = {
    body: { fontSize: theme.fontSize.md, color: theme.colors.text, fontWeight: theme.fontWeight.regular },
    caption: { fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.regular },
    label: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.medium },
    title: { fontSize: theme.fontSize.lg, color: theme.colors.text, fontWeight: theme.fontWeight.semibold },
    heading: { fontSize: theme.fontSize['2xl'], color: theme.colors.text, fontWeight: theme.fontWeight.bold },
    hero: { fontSize: theme.fontSize['3xl'], color: theme.colors.text, fontWeight: theme.fontWeight.bold },
    secondary: { fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.regular },
  };

  const sizeStyle = size ? { fontSize: theme.fontSize[size] } : {};
  const weightStyle = weight ? { fontWeight: theme.fontWeight[weight] } : {};
  const colorStyle = color ? { color } : {};

  return (
    <Text
      style={[variantStyles[variant], sizeStyle, weightStyle, colorStyle, style]}
      {...props}
    />
  );
}

