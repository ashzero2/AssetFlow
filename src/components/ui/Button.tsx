import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../theme';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  onPress, label, variant = 'primary', size = 'md',
  loading, disabled, style, textStyle, fullWidth,
}: ButtonProps) {
  const { theme } = useTheme();

  const bgColors = {
    primary: theme.colors.primary,
    secondary: theme.colors.primaryMuted,
    ghost: 'transparent',
    danger: theme.colors.danger,
  };

  const textColors = {
    primary: theme.colors.textInverse,
    secondary: theme.colors.primary,
    ghost: theme.colors.primary,
    danger: '#fff',
  };

  const paddings = { sm: 8, md: 12, lg: 16 };
  const fontSizes = { sm: theme.fontSize.sm, md: theme.fontSize.md, lg: theme.fontSize.lg };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        {
          backgroundColor: bgColors[variant],
          paddingVertical: paddings[size],
          paddingHorizontal: paddings[size] * 2,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: disabled ? 0.5 : 1,
          ...(fullWidth && { width: '100%' }),
          ...(variant === 'secondary' && {
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
          }),
          ...(variant === 'ghost' && {
            borderWidth: 1.5,
            borderColor: theme.colors.border,
          }),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <Text style={[{
          color: textColors[variant],
          fontSize: fontSizes[size],
          fontWeight: theme.fontWeight.semibold,
        }, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

