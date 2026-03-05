import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { IconButton } from '../../../src/components/ui/IconButton';
import { Card } from '../../../src/components/ui/Card';
import { AssetTypeBadge } from '../../../src/components/assets/AssetTypeBadge';
import { formatCurrency, formatPercentage } from '../../../src/utils/currency';
import { formatDate } from '../../../src/utils/date';
import { computePnL } from '../../../src/utils/calculations';
import { AssetDetailChart } from '../../../src/components/assets/AssetDetailChart';

export default function AssetDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const assets = useAssetsStore(s => s.assets);
  const removeAsset = useAssetsStore(s => s.remove);

  const asset = assets.find(a => String(a.id) === id);

  if (!asset) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.colors.textSecondary }}>Asset not found</Text>
      </SafeAreaView>
    );
  }

  const { pnlAmount, pnlPercent } = computePnL(asset.buy_price, asset.current_price, asset.units);
  const isPositive = pnlAmount >= 0;

  const handleDelete = () => {
    Alert.alert('Delete Asset', `Remove "${asset.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => { removeAsset(asset.id); router.back(); },
      },
    ]);
  };

  const row = (label: string, value: string) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium }}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
      }}>
        <IconButton name="arrow-back" onPress={() => router.back()} />
        <Text style={{ flex: 1, textAlign: 'center', fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
          Asset Details
        </Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <IconButton name="pencil-outline" onPress={() => router.push({ pathname: '/(tabs)/assets/add', params: { edit: String(asset.id) } })} />
          <IconButton name="trash-outline" onPress={handleDelete} color={theme.colors.danger} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Hero card */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text, marginBottom: 6 }}>
                {asset.name}
              </Text>
              <AssetTypeBadge type={asset.type} />
            </View>
          </View>
          <Text style={{ fontSize: theme.fontSize['3xl'], fontWeight: theme.fontWeight.bold, color: theme.colors.text, marginBottom: 6 }}>
            {formatCurrency(asset.current_value)}
          </Text>
          {asset.units > 0 && asset.buy_price > 0 && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: isPositive ? theme.colors.incomeMuted : theme.colors.expenseMuted,
              borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start',
            }}>
              <Ionicons
                name={isPositive ? 'trending-up' : 'trending-down'}
                size={16}
                color={isPositive ? theme.colors.income : theme.colors.expense}
              />
              <Text style={{
                color: isPositive ? theme.colors.income : theme.colors.expense,
                fontWeight: theme.fontWeight.semibold, fontSize: theme.fontSize.sm,
              }}>
                {formatCurrency(Math.abs(pnlAmount))} ({formatPercentage(pnlPercent)})
              </Text>
            </View>
          )}
        </Card>

        {/* P&L Chart */}
        {asset.units > 0 && asset.buy_price > 0 && (
          <Card style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 12 }}>
              Performance
            </Text>
            <AssetDetailChart asset={asset} />
          </Card>
        )}

        {/* Details */}
        <Card style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 4 }}>
            Details
          </Text>
          {asset.ticker && row('Ticker', asset.ticker)}
          {asset.units > 0 && row('Units', String(asset.units))}
          {asset.buy_price > 0 && row('Avg Buy Price', formatCurrency(asset.buy_price))}
          {asset.current_price > 0 && row('Current Price', formatCurrency(asset.current_price))}
          {row('Currency', asset.currency)}
          {row('Added on', formatDate(asset.created_at))}
          {asset.notes && (
            <View style={{ paddingTop: 10 }}>
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>{asset.notes}</Text>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

