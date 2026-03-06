import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../ui/BottomSheet';
import { Asset } from '../../db/queries/assets';
import { useTheme } from '../../theme';
import { ASSET_TYPE_COLORS } from '../../constants/assetTypes';
import { formatCurrency } from '../../utils/currency';
import { INCOME_CATEGORIES } from '../../constants/transactionCategories';
import { AssetGroup, getGroupKey } from '../../utils/calculations';

interface LinkAssetSheetProps {
  visible: boolean;
  onClose: () => void;
  assets: Asset[];
  assetGroups: AssetGroup[];
  linkedAssetIds: number[];
  linkedGroupKeys: string[];
  linkedCategories: string[];
  onLinkAsset: (assetId: number) => void;
  onUnlinkAsset: (assetId: number) => void;
  onLinkGroup: (groupKey: string) => void;
  onUnlinkGroup: (groupKey: string) => void;
  onLinkCategory: (cat: string) => void;
  onUnlinkCategory: (cat: string) => void;
}

export function LinkAssetSheet({
  visible, onClose, assets, assetGroups, linkedAssetIds, linkedGroupKeys, linkedCategories,
  onLinkAsset, onUnlinkAsset, onLinkGroup, onUnlinkGroup, onLinkCategory, onUnlinkCategory,
}: LinkAssetSheetProps) {
  const { theme } = useTheme();

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Link to Goal" snapHeight="tall">
      <View style={{ padding: 16 }}>

        {/* ── Asset Groups ── */}
        <Text style={{
          fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text, marginBottom: 4,
        }}>Asset Groups</Text>
        <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, marginBottom: 12 }}>
          New lots you add are automatically counted
        </Text>
        {assetGroups.length === 0 && (
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm, marginBottom: 16 }}>
            No assets added yet.
          </Text>
        )}
        {assetGroups.map(group => {
          const isLinked = linkedGroupKeys.includes(group.groupKey);
          const color = ASSET_TYPE_COLORS[group.type] ?? theme.colors.primary;
          return (
            <TouchableOpacity
              key={group.groupKey}
              onPress={() => isLinked ? onUnlinkGroup(group.groupKey) : onLinkGroup(group.groupKey)}
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
                <Ionicons name="layers-outline" size={16} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.text, fontWeight: theme.fontWeight.medium }}>
                  {group.name}
                </Text>
                <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                  {group.lots.length} lot{group.lots.length !== 1 ? 's' : ''} · {formatCurrency(group.totalCurrentValue)}
                </Text>
              </View>
              <Ionicons
                name={isLinked ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={isLinked ? theme.colors.primary : theme.colors.border}
              />
            </TouchableOpacity>
          );
        })}

        {/* ── Individual Assets ── */}
        <Text style={{
          fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold,
          color: theme.colors.text, marginTop: 20, marginBottom: 4,
        }}>Individual Assets</Text>
        <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, marginBottom: 12 }}>
          Link a specific lot only
        </Text>
        {assets.length === 0 && (
          <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm, marginBottom: 16 }}>
            No assets added yet.
          </Text>
        )}
        {assets.map(asset => {
          const isLinked = linkedAssetIds.includes(asset.id);
          const color = ASSET_TYPE_COLORS[asset.type] ?? theme.colors.primary;
          const assetGroupKey = getGroupKey(asset);
          const groupAlreadyLinked = linkedGroupKeys.includes(assetGroupKey);

          const handlePress = () => {
            if (isLinked) {
              onUnlinkAsset(asset.id);
              return;
            }
            if (groupAlreadyLinked) {
              Alert.alert(
                'Already counted via group',
                `"${asset.name}" is already included through the Asset Group link above. Adding it individually will double-count it.\n\nAre you sure?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Link anyway', style: 'destructive', onPress: () => onLinkAsset(asset.id) },
                ]
              );
              return;
            }
            onLinkAsset(asset.id);
          };

          return (
            <TouchableOpacity
              key={asset.id}
              onPress={handlePress}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingVertical: 12, paddingHorizontal: 4,
                borderBottomWidth: 1, borderBottomColor: theme.colors.border,
                opacity: groupAlreadyLinked && !isLinked ? 0.5 : 1,
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
                <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.text, fontWeight: theme.fontWeight.medium }}>
                  {asset.name}
                </Text>
                <Text style={{ fontSize: theme.fontSize.xs, color: groupAlreadyLinked ? theme.colors.danger : theme.colors.textSecondary }}>
                  {groupAlreadyLinked && !isLinked ? '⚠ counted via group' : formatCurrency(asset.current_value)}
                </Text>
              </View>
              <Ionicons
                name={isLinked ? 'checkmark-circle' : groupAlreadyLinked ? 'warning-outline' : 'ellipse-outline'}
                size={22}
                color={isLinked ? theme.colors.primary : groupAlreadyLinked ? theme.colors.danger : theme.colors.border}
              />
            </TouchableOpacity>
          );
        })}

        {/* ── Income Categories ── */}
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
