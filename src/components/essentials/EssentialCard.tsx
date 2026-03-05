import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Essential } from '../../db/queries/essentials';
import { ESSENTIAL_TYPES } from '../../constants/essentialTypes';
import { useTheme } from '../../theme';
import { formatCurrency } from '../../utils/currency';
import { getDaysUntil } from '../../utils/date';
import { CoverageBar } from './CoverageBar';

interface EssentialCardProps {
  essential: Essential;
  onEdit: () => void;
  onDelete: () => void;
}

export function EssentialCard({ essential, onEdit, onDelete }: EssentialCardProps) {
  const { theme } = useTheme();
  const typeInfo = ESSENTIAL_TYPES.find(t => t.value === essential.type);
  const progress = essential.target_amount > 0
    ? (essential.current_amount / essential.target_amount) * 100 : 0;
  const daysToRenewal = essential.renewal_date ? getDaysUntil(essential.renewal_date) : null;
  const isGood = progress >= 80;
  const isMid = progress >= 40 && progress < 80;

  const statusColor = isGood ? theme.colors.success : isMid ? theme.colors.warning : theme.colors.danger;
  const statusLabel = isGood ? 'Good' : isMid ? 'Partial' : 'Low';

  return (
    <View style={{
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.isDark ? 0.3 : 0.06,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{
          width: 44, height: 44, borderRadius: 12,
          backgroundColor: `${statusColor}20`,
          alignItems: 'center', justifyContent: 'center', marginRight: 12,
        }}>
          <Text style={{ fontSize: 22 }}>{typeInfo?.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
            color: theme.colors.text,
          }}>{essential.label || typeInfo?.label}</Text>
          {essential.provider && (
            <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, marginTop: 1 }}>
              {essential.provider}
            </Text>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity onPress={onEdit} style={{ padding: 4 }}>
            <Ionicons name="pencil-outline" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={{ padding: 4 }}>
            <Ionicons name="trash-outline" size={16} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Amounts */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary }}>Coverage</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
            {formatCurrency(essential.current_amount)}
          </Text>
          <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary }}>
            / {formatCurrency(essential.target_amount)}
          </Text>
        </View>
      </View>

      <CoverageBar current={essential.current_amount} target={essential.target_amount} color={statusColor} showValues={false} />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          backgroundColor: `${statusColor}20`,
          paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99,
        }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusColor }} />
          <Text style={{ fontSize: theme.fontSize.xs, color: statusColor, fontWeight: theme.fontWeight.semibold }}>
            {statusLabel}
          </Text>
        </View>
        {daysToRenewal !== null && (
          <Text style={{
            fontSize: theme.fontSize.xs,
            color: daysToRenewal < 30 ? theme.colors.warning : theme.colors.textSecondary,
          }}>
            {daysToRenewal > 0
              ? `Renews in ${daysToRenewal}d`
              : `Renewal overdue`}
          </Text>
        )}
        {essential.premium ? (
          <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
            Premium: {formatCurrency(essential.premium)}/yr
          </Text>
        ) : null}
      </View>
    </View>
  );
}

