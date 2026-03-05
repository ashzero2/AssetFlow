import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';
import { Asset } from '../../db/queries/assets';
import { formatCurrencyCompact } from '../../utils/currency';
import { ASSET_TYPE_COLORS, ASSET_TYPE_SHORT } from '../../constants/assetTypes';

export function AssetsMiniList({ assets }: { assets: Asset[] }) {
  const { theme } = useTheme();
  const router = useRouter();
  const top3 = assets.slice(0, 3);

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
          Assets
        </Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/assets')}>
          <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.medium }}>
            View all →
          </Text>
        </TouchableOpacity>
      </View>
      {top3.length === 0 ? (
        <TouchableOpacity onPress={() => router.push('/(tabs)/assets/add')}
          style={{
            backgroundColor: theme.colors.surface, borderRadius: 14,
            padding: 16, alignItems: 'center', borderWidth: 1,
            borderColor: theme.colors.border, borderStyle: 'dashed',
          }}>
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>+ Add your first asset</Text>
        </TouchableOpacity>
      ) : (
        top3.map(asset => {
          const color = ASSET_TYPE_COLORS[asset.type] ?? theme.colors.primary;
          return (
            <TouchableOpacity key={asset.id} onPress={() => router.push(`/(tabs)/assets/${asset.id}`)} activeOpacity={0.8}>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: theme.colors.surface,
                borderRadius: 12, padding: 12,
                marginBottom: 8, borderWidth: 1, borderColor: theme.colors.border,
              }}>
                <View style={{
                  width: 36, height: 36, borderRadius: 10,
                  backgroundColor: `${color}20`,
                  alignItems: 'center', justifyContent: 'center', marginRight: 10,
                }}>
                  <Text style={{ fontSize: 9, fontWeight: theme.fontWeight.bold, color }}>{ASSET_TYPE_SHORT[asset.type]}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.text }} numberOfLines={1}>
                  {asset.name}
                </Text>
                <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
                  {formatCurrencyCompact(asset.current_value)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

