import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../ui/BottomSheet';
import { Asset } from '../../db/queries/assets';
import { useTheme } from '../../theme';
import { ASSET_TYPE_COLORS } from '../../constants/assetTypes';
import { formatCurrency } from '../../utils/currency';
import { GoalLink } from '../../db/queries/goals';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/transactionCategories';

interface LinkAssetSheetProps {
  visible: boolean;
  onClose: () => void;
  assets: Asset[];
  linkedAssetIds: number[];
  linkedCategories: string[];
  onLinkAsset: (assetId: number) => void;
  onUnlinkAsset: (assetId: number) => void;
  onLinkCategory: (cat: string) => void;
  onUnlinkCategory: (cat: string) => void;
}

export function LinkAssetSheet({
  visible, onClose, assets, linkedAssetIds, linkedCategories,
  onLinkAsset, onUnlinkAsset, onLinkCategory, onUnlinkCategory,
}: LinkAssetSheetProps) {
  const { theme } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Link to Goal" snapHeight="tall">
      <View style={{ padding: 16 }}>
        <Text style={{
          fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text, marginBottom: 12,
        }}>Assets</Text>
        {assets.length === 0 && (
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm, marginBottom: 16 }}>
            No assets added yet.
          </Text>
        )}
        {assets.map(asset => {
          const isLinked = linkedAssetIds.includes(asset.id);
          const color = ASSET_TYPE_COLORS[asset.type] ?? theme.colors.primary;
          return (
            <TouchableOpacity
              key={asset.id}
              onPress={() => isLinked ? onUnlinkAsset(asset.id) : onLinkAsset(asset.id)}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 12, paddingHorizontal: 4,
                borderBottomWidth: 1, borderBottomColor: theme.colors.border,
              }}
            >
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: `${color}22`,
                alignItems: 'center', justifyContent: 'center', marginRight: 10,
              }}>
                <Text style={{ fontSize: 10, fontWeight: theme.fontWeight.bold, color }}>{asset.type.slice(0, 3)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.text, fontWeight: theme.fontWeight.medium }}>{asset.name}</Text>
                <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>{formatCurrency(asset.current_value)}</Text>
              </View>
              <Ionicons
                name={isLinked ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isLinked ? theme.colors.primary : theme.colors.border}
              />
            </TouchableOpacity>
          );
        })}

        <Text style={{
          fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text, marginTop: 20, marginBottom: 12,
        }}>Income Categories</Text>
        {INCOME_CATEGORIES.map(cat => {
          const isLinked = linkedCategories.includes(cat.value);
          return (
            <TouchableOpacity
              key={cat.value}
              onPress={() => isLinked ? onUnlinkCategory(cat.value) : onLinkCategory(cat.value)}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
              }}
            >
              <Text style={{ fontSize: 20, marginRight: 12 }}>{cat.icon}</Text>
              <Text style={{ flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.text }}>{cat.label}</Text>
              <Ionicons
                name={isLinked ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isLinked ? theme.colors.primary : theme.colors.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

