import React from 'react';
import { View, Text } from 'react-native';
import { AssetType, ASSET_TYPES, ASSET_TYPE_COLORS } from '../../constants/assetTypes';
import { useTheme } from '../../theme';

export function AssetTypeBadge({ type }: { type: AssetType }) {
  const { theme } = useTheme();
  const info = ASSET_TYPES.find(a => a.value === type);
  const color = ASSET_TYPE_COLORS[type] ?? theme.colors.primary;

  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: `${color}20`,
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 99, alignSelf: 'flex-start',
      gap: 4,
    }}>
      <Text style={{ fontSize: 14 }}>{info?.icon}</Text>
      <Text style={{
        color, fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
      }}>{info?.label ?? type}</Text>
    </View>
  );
}

