import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface InsightTipProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  type?: 'info' | 'warning' | 'success' | 'danger';
}

export function InsightTip({ icon, title, description, type = 'info' }: InsightTipProps) {
  const { theme } = useTheme();

  const colorMap = {
    info: theme.colors.primary,
    warning: theme.colors.warning,
    success: theme.colors.success,
    danger: theme.colors.danger,
  };
  const bgMap = {
    info: theme.colors.primaryMuted,
    warning: theme.colors.warningMuted,
    success: theme.colors.successMuted,
    danger: theme.colors.dangerMuted,
  };

  const color = colorMap[type];
  const bg = bgMap[type];

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderLeftWidth: 4,
      borderLeftColor: color,
    }}>
      <View style={{
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: bg,
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
        flexShrink: 0,
      }}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text, marginBottom: 3,
        }}>{title}</Text>
        <Text style={{
          fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, lineHeight: 18,
        }}>{description}</Text>
      </View>
    </View>
  );
}

