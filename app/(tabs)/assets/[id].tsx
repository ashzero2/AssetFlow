import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
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
  const updateGroupPrice = useAssetsStore(s => s.updateGroupPrice);

  const [priceSheetVisible, setPriceSheetVisible] = useState(false);
  const [newPriceInput, setNewPriceInput] = useState('');

  const asset = assets.find(a => String(a.id) === id);

  if (!asset) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: theme.colors.textSecondary }}>Asset not found</Text>
      </SafeAreaView>
    );
  }

  const isTicker = !!(asset.ticker?.trim());
  const groupKey = isTicker
    ? asset.ticker!.trim().toUpperCase()
    : asset.name.trim().toLowerCase();

  // Count sibling lots
  const lotCount = assets.filter(a => {
    const key = a.ticker?.trim().toUpperCase() || a.name.trim().toLowerCase();
    return key === groupKey;
  }).length;

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

  const openPriceSheet = () => {
    setNewPriceInput(String(asset.current_price));
    setPriceSheetVisible(true);
  };

  const handleUpdatePrice = () => {
    const p = parseFloat(newPriceInput);
    if (!newPriceInput || isNaN(p) || p <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price greater than 0.');
      return;
    }
    const changed = updateGroupPrice(groupKey, isTicker, p);
    setPriceSheetVisible(false);
    Alert.alert(
      'Price Updated',
      `₹${p.toLocaleString('en-IN')} applied to ${changed} lot${changed !== 1 ? 's' : ''} of ${asset.name}.`
    );
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
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <AssetTypeBadge type={asset.type} />
                {lotCount > 1 && (
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    backgroundColor: theme.colors.surfaceAlt,
                    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
                  }}>
                    <Ionicons name="layers-outline" size={12} color={theme.colors.textSecondary} />
                    <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                      {lotCount} lots
                    </Text>
                  </View>
                )}
              </View>
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

        {/* Update Price card */}
        <TouchableOpacity onPress={openPriceSheet} activeOpacity={0.75}>
          <Card style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
                  Update Price
                </Text>
                <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary, marginTop: 2 }}>
                  {lotCount > 1
                    ? `Updates current price for all ${lotCount} lots of ${asset.name}`
                    : `Set new current price for ${asset.name}`}
                </Text>
              </View>
              <View style={{
                width: 36, height: 36, borderRadius: 10,
                backgroundColor: `${theme.colors.primary}18`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Ionicons name="refresh-outline" size={18} color={theme.colors.primary} />
              </View>
            </View>
          </Card>
        </TouchableOpacity>

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

      {/* Update Price bottom sheet */}
      <Modal
        visible={priceSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPriceSheetVisible(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: theme.colors.overlay }}
          activeOpacity={1}
          onPress={() => setPriceSheetVisible(false)}
        />
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? 40 : 28,
          shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12, shadowRadius: 16, elevation: 20,
        }}>
          {/* Handle */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
          </View>

          <Text style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.text, marginBottom: 4 }}>
            Update Price
          </Text>
          {lotCount > 1 && (
            <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary, marginBottom: 16 }}>
              Will apply to all {lotCount} lots of {asset.name}
            </Text>
          )}

          <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.text, marginBottom: 8, marginTop: lotCount <= 1 ? 12 : 0 }}>
            New price per unit (₹)
          </Text>
          <TextInput
            value={newPriceInput}
            onChangeText={setNewPriceInput}
            keyboardType="decimal-pad"
            autoFocus
            style={{
              borderWidth: 1, borderColor: theme.colors.border,
              borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14,
              fontSize: theme.fontSize.lg, color: theme.colors.text,
              backgroundColor: theme.colors.background, marginBottom: 20,
            }}
            placeholderTextColor={theme.colors.textSecondary}
            placeholder="0.00"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => setPriceSheetVisible(false)}
              style={{
                flex: 1, paddingVertical: 14, borderRadius: 12,
                borderWidth: 1, borderColor: theme.colors.border,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSecondary }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdatePrice}
              style={{
                flex: 2, paddingVertical: 14, borderRadius: 12,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: '#fff' }}>
                Update {lotCount > 1 ? `${lotCount} Lots` : 'Price'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

