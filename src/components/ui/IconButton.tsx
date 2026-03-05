import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
  variant?: 'default' | 'filled' | 'ghost';
}

export function IconButton({ name, onPress, size = 22, color, style, variant = 'default' }: IconButtonProps) {
  const { theme } = useTheme();
  const iconColor = color ?? theme.colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        {
          padding: 8,
          borderRadius: 10,
          ...(variant === 'filled' && { backgroundColor: theme.colors.primaryMuted }),
          ...(variant === 'ghost' && { backgroundColor: theme.colors.surfaceAlt }),
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={iconColor} />
    </TouchableOpacity>
  );
}

