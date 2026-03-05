import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { AssetCard } from '../../../src/components/assets/AssetCard';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { formatCurrencyCompact } from '../../../src/utils/currency';
import { ASSET_TYPES, AssetType } from '../../../src/constants/assetTypes';

export default function AssetsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const assets = useAssetsStore(s => s.assets);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<AssetType | 'ALL'>('ALL');

  const filtered = assets.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.ticker ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'ALL' || a.type === filterType;
    return matchSearch && matchType;
  });

  const totalValue = assets.reduce((s, a) => s + a.current_value, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <View>
          <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>Assets</Text>
          <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary }}>
            Total: {formatCurrencyCompact(totalValue)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/assets/add')}
          style={{
            width: 42, height: 42, borderRadius: 12,
            backgroundColor: theme.colors.primary,
            alignItems: 'center', justifyContent: 'center',
          }}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={{
        marginHorizontal: 16, marginBottom: 10,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: 12, paddingHorizontal: 12,
        borderWidth: 1, borderColor: theme.colors.border,
      }}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textSecondary} />
        <TextInput
          style={{ flex: 1, paddingVertical: 10, marginLeft: 8, color: theme.colors.text, fontSize: theme.fontSize.md }}
          placeholder="Search assets..."
          placeholderTextColor={theme.colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Type filter — pill strip */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ value: 'ALL', label: 'All', icon: '📊' }, ...ASSET_TYPES]}
        keyExtractor={item => item.value}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10, paddingTop: 2, gap: 6, alignItems: 'center' }}
        renderItem={({ item }) => {
          const isActive = filterType === item.value;
          return (
            <TouchableOpacity
              onPress={() => setFilterType(item.value as AssetType | 'ALL')}
              activeOpacity={0.75}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                alignSelf: 'flex-start',
                gap: 5,
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderRadius: 99,
                backgroundColor: isActive ? theme.colors.primary : theme.colors.surfaceAlt,
              }}>
              <Text style={{ fontSize: 12, lineHeight: 16 }}>{item.icon}</Text>
              <Text style={{
                fontSize: theme.fontSize.sm,
                lineHeight: 16,
                color: isActive ? theme.colors.textInverse : theme.colors.textSecondary,
                fontWeight: theme.fontWeight.semibold,
              }}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Assets list */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <EmptyState
            emoji="📈"
            title="No assets yet"
            description="Start tracking your mutual funds, ETFs, stocks, and more"
            actionLabel="Add Asset"
            onAction={() => router.push('/(tabs)/assets/add')}
          />
        }
        renderItem={({ item }) => (
          <AssetCard asset={item} onPress={() => router.push(`/(tabs)/assets/${item.id}`)} />
        )}
      />
    </SafeAreaView>
  );
}

