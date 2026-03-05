import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, emoji, title, description, actionLabel, onAction }: EmptyStateProps) {
  const { theme } = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 }}>
      {emoji ? (
        <Text style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</Text>
      ) : icon ? (
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: theme.colors.primaryMuted,
          alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <Ionicons name={icon} size={32} color={theme.colors.primary} />
        </View>
      ) : null}
      <Text style={{
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 8,
      }}>{title}</Text>
      {description && (
        <Text style={{
          fontSize: theme.fontSize.sm,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
          marginBottom: 24,
        }}>{description}</Text>
      )}
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

