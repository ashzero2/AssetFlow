import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/theme';
import { useAssetsStore } from '../../../src/store/useAssetsStore';
import { FormTextInput } from '../../../src/components/forms/TextInput';
import { AmountInput } from '../../../src/components/forms/AmountInput';
import { Picker } from '../../../src/components/forms/Picker';
import { Button } from '../../../src/components/ui/Button';
import { IconButton } from '../../../src/components/ui/IconButton';
import { ASSET_TYPES } from '../../../src/constants/assetTypes';
import { todayISO } from '../../../src/utils/date';

export default function AddAssetScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const assets = useAssetsStore(s => s.assets);
  const addAsset = useAssetsStore(s => s.add);
  const updateAsset = useAssetsStore(s => s.update);

  const editing = edit ? assets.find(a => String(a.id) === edit) : null;

  const [name, setName] = useState(editing?.name ?? '');
  const [type, setType] = useState(editing?.type ?? '');
  const [ticker, setTicker] = useState(editing?.ticker ?? '');
  const [units, setUnits] = useState(editing ? String(editing.units) : '');
  const [buyPrice, setBuyPrice] = useState(editing ? String(editing.buy_price) : '');
  const [currentPrice, setCurrentPrice] = useState(editing ? String(editing.current_price) : '');
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!type) e.type = 'Type is required';
    if (!currentPrice) e.currentPrice = 'Current value is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const unitsNum = parseFloat(units) || 0;
    const buyPriceNum = parseFloat(buyPrice) || 0;
    const currentPriceNum = parseFloat(currentPrice) || 0;
    const currentValue = unitsNum > 0 ? unitsNum * currentPriceNum : currentPriceNum;

    if (editing) {
      updateAsset(editing.id, { name, type: type as any, ticker, units: unitsNum, buy_price: buyPriceNum, current_price: currentPriceNum, current_value: currentValue, notes });
    } else {
      addAsset({ name, type: type as any, ticker, units: unitsNum, buy_price: buyPriceNum, current_price: currentPriceNum, current_value: currentValue, currency: 'INR', notes });
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

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <FormTextInput
            label="Asset Name *"
            value={name}
            onChangeText={setName}
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
          <FormTextInput
            label="Ticker / Symbol"
            value={ticker}
            onChangeText={setTicker}
            placeholder="e.g. HDFCMID"
            autoCapitalize="characters"
          />
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
          <AmountInput
            label="Current Price / Total Value *"
            value={currentPrice}
            onChangeText={setCurrentPrice}
            error={errors.currentPrice}
          />
          {units && currentPrice && parseFloat(units) > 0 && (
            <Text style={{
              color: theme.colors.primary, fontSize: theme.fontSize.sm,
              marginTop: -8, marginBottom: 16,
            }}>
              Total value: ₹{(parseFloat(units) * parseFloat(currentPrice)).toLocaleString('en-IN')}
            </Text>
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

