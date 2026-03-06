import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from '../../db/queries/assets';
import { useTheme } from '../../theme';
import { formatCurrency, formatPercentage } from '../../utils/currency';
import { ASSET_TYPE_COLORS, ASSET_TYPE_SHORT } from '../../constants/assetTypes';
import { computePnL } from '../../utils/calculations';

interface AssetCardProps {
  asset: Asset;
  onPress: () => void;
  lotsCount?: number;
}

export function AssetCard({ asset, onPress, lotsCount = 1 }: AssetCardProps) {
  const { theme } = useTheme();
  const { pnlAmount, pnlPercent } = computePnL(asset.buy_price, asset.current_price, asset.units);
  const typeColor = ASSET_TYPE_COLORS[asset.type] ?? theme.colors.primary;
  const isPositive = pnlAmount >= 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.isDark ? 0.3 : 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}>
        {/* Type indicator */}
        <View style={{
          width: 44, height: 44,
          borderRadius: 12,
          backgroundColor: `${typeColor}22`,
          alignItems: 'center', justifyContent: 'center',
          marginRight: 12,
        }}>
          <Text style={{ fontSize: 10, fontWeight: theme.fontWeight.bold, color: typeColor }}>
            {ASSET_TYPE_SHORT[asset.type]}
          </Text>
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
            color: theme.colors.text, marginBottom: 2,
          }} numberOfLines={1}>{asset.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {asset.ticker && (
              <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                {asset.ticker} · {asset.units} units
              </Text>
            )}
            {lotsCount > 1 && (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 3,
                backgroundColor: theme.colors.surfaceAlt,
                borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
              }}>
                <Ionicons name="layers-outline" size={10} color={theme.colors.textSecondary} />
                <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.medium }}>
                  {lotsCount} lots
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Value & P&L */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold,
            color: theme.colors.text,
          }}>{formatCurrency(asset.current_value)}</Text>
          {asset.units > 0 && asset.buy_price > 0 && (
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: isPositive ? theme.colors.incomeMuted : theme.colors.expenseMuted,
              paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 3,
            }}>
              <Text style={{
                fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold,
                color: isPositive ? theme.colors.income : theme.colors.expense,
              }}>{formatPercentage(pnlPercent)}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

