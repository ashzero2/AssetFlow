import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { FormTextInput } from '../../../src/components/forms/TextInput';
import { AmountInput } from '../../../src/components/forms/AmountInput';
import { Picker } from '../../../src/components/forms/Picker';
import { Button } from '../../../src/components/ui/Button';
import { IconButton } from '../../../src/components/ui/IconButton';
import { ASSET_TYPES, ASSET_TYPE_SHORT, ASSET_TYPE_COLORS } from '../../../src/constants/assetTypes';

export default function AddAssetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const assets = useAssetsStore(s => s.assets);
  const addAsset = useAssetsStore(s => s.add);
  const updateAsset = useAssetsStore(s => s.update);
  const updateGroupPrice = useAssetsStore(s => s.updateGroupPrice);

  const editing = edit ? assets.find(a => String(a.id) === edit) : null;

  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState(editing?.type ?? '');
  const [ticker, setTicker] = useState(editing?.ticker ?? '');
  const [units, setUnits] = useState(editing ? String(editing.units) : '');
  const [buyPrice, setBuyPrice] = useState(editing ? String(editing.buy_price) : '');
  const [currentPrice, setCurrentPrice] = useState(editing ? String(editing.current_price) : '');
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Track the linked group: { key, isTicker, canonicalTicker } so we can enforce the ticker on save
  const [linkedGroup, setLinkedGroup] = useState<{
    key: string;
    isTicker: boolean;
    canonicalTicker: string;
  } | null>(null);

  // Deduplicated representative asset per group key for autocomplete
  const uniqueAssets = useMemo(() => {
    if (editing) return [];
    const seen = new Set<string>();
    return assets.filter(a => {
      // Always use ticker as group key when ticker exists
      const key = a.ticker?.trim() ? a.ticker.trim().toUpperCase() : a.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [assets, editing]);

  const suggestions = useMemo(() => {
    const q = name.trim().toLowerCase();
    if (q.length < 1) return [];          // show after 1 char (was 2 — lowered)
    return uniqueAssets
      .filter(a =>
        a.name.toLowerCase().includes(q) ||
        (a.ticker ?? '').toLowerCase().includes(q)
      )
      .slice(0, 4);
  }, [name, uniqueAssets]);

  // Count how many lots share the linked group key
  const linkedLotCount = useMemo(() => {
    if (!linkedGroup) return 0;
    return assets.filter(a => {
      const key = a.ticker?.trim() ? a.ticker.trim().toUpperCase() : a.name.trim().toLowerCase();
      return key === linkedGroup.key;
    }).length;
  }, [linkedGroup, assets]);

  const applySuggestion = (suggestion: typeof assets[0]) => {
    const canonicalTicker = suggestion.ticker?.trim() ?? '';
    const key = canonicalTicker
      ? canonicalTicker.toUpperCase()
      : suggestion.name.trim().toLowerCase();
    setName(suggestion.name);
    setType(suggestion.type);
    setTicker(canonicalTicker);   // enforce the exact same ticker
    setLinkedGroup({ key, isTicker: !!canonicalTicker, canonicalTicker });
    setUnits('');
    setBuyPrice('');
    setCurrentPrice('');
    setShowSuggestions(false);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!type) e.type = 'Type is required';
    // For linked lots, current price is hidden — inherited from the group automatically
    if (!linkedGroup && !editing && !currentPrice) e.currentPrice = 'Current value is required';
    // Edit mode always requires current price
    if (editing && !currentPrice) e.currentPrice = 'Current value is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const unitsNum = parseFloat(units) || 0;
    const buyPriceNum = parseFloat(buyPrice) || 0;

    const isLinkedLot = !!linkedGroup && !editing;

    // For linked lots: use buy price as placeholder — will be overwritten below
    const currentPriceNum = isLinkedLot
      ? buyPriceNum
      : (parseFloat(currentPrice) || 0);
    const currentValue = unitsNum > 0 ? unitsNum * currentPriceNum : currentPriceNum;
    const finalTicker = linkedGroup ? linkedGroup.canonicalTicker : ticker;

    if (editing) {
      updateAsset(editing.id, {
        name, type: type as any, ticker: finalTicker,
        units: unitsNum, buy_price: buyPriceNum,
        current_price: currentPriceNum, current_value: currentValue, notes,
      });
    } else {
      addAsset({
        name, type: type as any, ticker: finalTicker,
        units: unitsNum, buy_price: buyPriceNum,
        current_price: currentPriceNum, current_value: currentValue,
        currency: 'INR', notes,
      });

      // The buy price of the new lot IS the current market price —
      // sync ALL lots in the group to this new price.
      if (isLinkedLot && buyPriceNum > 0) {
        updateGroupPrice(linkedGroup!.key, linkedGroup!.isTicker, buyPriceNum);
      }
    }
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
          paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        }}>
          <IconButton name="arrow-back" onPress={() => router.back()} />
          <Text style={{
            flex: 1, textAlign: 'center',
            fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold,
            color: theme.colors.text,
          }}>{editing ? 'Edit Asset' : 'Add Asset'}</Text>
          <View style={{ width: 38 }} />
        </View>

        {/* Suggestion dropdown rendered OUTSIDE ScrollView to avoid clipping */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={{
            position: 'absolute',
            // header ~57px + safearea + padding 20 + label ~22 + input ~48 = ~160 from top
            top: 160,
            left: 20, right: 20,
            backgroundColor: theme.colors.surface,
            borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15, shadowRadius: 10, elevation: 12,
            zIndex: 999,
          }}>
            {suggestions.map((s, i) => {
              const typeColor = ASSET_TYPE_COLORS[s.type] ?? theme.colors.primary;
              const groupKey = s.ticker?.trim() ? s.ticker.trim().toUpperCase() : s.name.trim().toLowerCase();
              const totalUnits = assets
                .filter(a => {
                  const k = a.ticker?.trim() ? a.ticker.trim().toUpperCase() : a.name.trim().toLowerCase();
                  return k === groupKey;
                })
                .reduce((sum, a) => sum + a.units, 0);
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => applySuggestion(s)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: 14, paddingVertical: 12,
                    borderBottomWidth: i < suggestions.length - 1 ? 1 : 0,
                    borderBottomColor: theme.colors.border,
                  }}
                >
                  <View style={{
                    width: 34, height: 34, borderRadius: 8,
                    backgroundColor: `${typeColor}22`,
                    alignItems: 'center', justifyContent: 'center', marginRight: 10,
                  }}>
                    <Text style={{ fontSize: 9, fontWeight: theme.fontWeight.bold, color: typeColor }}>
                      {ASSET_TYPE_SHORT[s.type]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
                      {s.name}
                    </Text>
                    <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                      {s.ticker ? `${s.ticker} · ` : ''}{totalUnits} units held
                    </Text>
                  </View>
                  <Ionicons name="add-circle-outline" size={18} color={theme.colors.primary} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
          // Dismiss suggestions when user scrolls
          onScrollBeginDrag={() => setShowSuggestions(false)}
        >
          {/* Linked-lot banner */}
          {linkedGroup && linkedLotCount > 0 && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: `${theme.colors.primary}18`,
              borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16,
            }}>
              <Ionicons name="layers-outline" size={16} color={theme.colors.primary} />
              <Text style={{ flex: 1, fontSize: theme.fontSize.sm, color: theme.colors.primary }}>
                New lot of <Text style={{ fontWeight: theme.fontWeight.semibold }}>{name}</Text>
                {' · '}price update will apply to all {linkedLotCount} lot{linkedLotCount !== 1 ? 's' : ''}
              </Text>
              <TouchableOpacity onPress={() => { setLinkedGroup(null); setTicker(''); }}>
                <Ionicons name="close" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Name field */}
          <FormTextInput
            label="Asset Name *"
            value={name}
            onChangeText={(v) => {
              setName(v);
              setLinkedGroup(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Short delay so tapping a suggestion registers before hiding
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="e.g. HDFC Mid Cap Fund"
            error={errors.name}
          />

          <Picker
            label="Asset Type *"
            value={type}
            options={ASSET_TYPES.map(t => ({ value: t.value, label: t.label, icon: t.icon }))}
            onSelect={setType}
            error={errors.type}
          />

          {/* Ticker field with hint */}
          <FormTextInput
            label="Ticker / Symbol"
            value={ticker}
            onChangeText={setTicker}
            placeholder="e.g. GOLDBEES.NS · AAPL · BTC-USD"
            autoCapitalize="characters"
          />
          <Text style={{
            fontSize: theme.fontSize.xs, color: theme.colors.textSecondary,
            marginTop: -10, marginBottom: 16, paddingHorizontal: 2,
          }}>
            NSE: SYMBOL.NS · BSE: SYMBOL.BO · Crypto: SYMBOL-USD
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <AmountInput
                label="Units Held"
                value={units}
                onChangeText={setUnits}
                currency=""
              />
            </View>
            <View style={{ flex: 1 }}>
              <AmountInput
                label="Buy Price / Unit"
                value={buyPrice}
                onChangeText={setBuyPrice}
              />
            </View>
          </View>

          {/* Current price — hidden for linked lots (auto-synced from group) */}
          {(!linkedGroup || editing) ? (
            <>
              <AmountInput
                label={editing ? 'Current Price / Unit *' : 'Current Price / Total Value *'}
                value={currentPrice}
                onChangeText={setCurrentPrice}
                error={errors.currentPrice}
              />
              {!linkedGroup && !editing && units && currentPrice && parseFloat(units) > 0 && (
                <Text style={{
                  color: theme.colors.primary, fontSize: theme.fontSize.sm,
                  marginTop: -8, marginBottom: 16,
                }}>
                  Total value: ₹{(parseFloat(units) * parseFloat(currentPrice)).toLocaleString('en-IN')}
                </Text>
              )}
            </>
          ) : (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              backgroundColor: `${theme.colors.primary}12`,
              borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16,
            }}>
              <Ionicons name="sync-outline" size={15} color={theme.colors.primary} />
              <Text style={{ flex: 1, fontSize: theme.fontSize.xs, color: theme.colors.primary, lineHeight: 18 }}>
                Your buy price will become the new current price for{' '}
                <Text style={{ fontWeight: theme.fontWeight.semibold }}>all {linkedLotCount} lot{linkedLotCount !== 1 ? 's' : ''}</Text>
                {buyPrice && parseFloat(buyPrice) > 0
                  ? ` · ₹${parseFloat(buyPrice).toLocaleString('en-IN')}/unit`
                  : ''}
              </Text>
            </View>
          )}

          <FormTextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional notes..."
            multiline
            numberOfLines={3}
          />
          <Button label={editing ? 'Save Changes' : 'Add Asset'} onPress={handleSave} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

