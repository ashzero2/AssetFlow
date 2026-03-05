import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../src/theme';
import { useEssentialsStore } from '../../../src/store/useEssentialsStore';
import { EssentialCard } from '../../../src/components/essentials/EssentialCard';
import { BottomSheet } from '../../../src/components/ui/BottomSheet';
import { FormTextInput } from '../../../src/components/forms/TextInput';
import { AmountInput } from '../../../src/components/forms/AmountInput';
import { DatePicker } from '../../../src/components/forms/DatePicker';
import { Button } from '../../../src/components/ui/Button';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ESSENTIAL_TYPES, EssentialType } from '../../../src/constants/essentialTypes';
import { Essential } from '../../../src/db/queries/essentials';

type EditState = Partial<Essential> & { type: EssentialType };

const defaultState = (type: EssentialType): EditState => ({
  type, label: '', target_amount: 0, current_amount: 0, provider: '', renewal_date: '', premium: 0, notes: '',
});

export default function EssentialsScreen() {
  const { theme } = useTheme();
  const essentials = useEssentialsStore(s => s.essentials);
  const addEssential = useEssentialsStore(s => s.add);
  const updateEssential = useEssentialsStore(s => s.update);
  const removeEssential = useEssentialsStore(s => s.remove);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EditState>(defaultState('EMERGENCY_FUND'));

  const openAdd = (type: EssentialType) => {
    setEditingId(null);
    setForm(defaultState(type));
    setSheetOpen(true);
  };

  const openEdit = (e: Essential) => {
    setEditingId(e.id);
    setForm({ ...e });
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (editingId !== null) {
      updateEssential(editingId, {
        type: form.type, label: form.label, target_amount: form.target_amount ?? 0,
        current_amount: form.current_amount ?? 0, provider: form.provider,
        renewal_date: form.renewal_date, premium: form.premium, notes: form.notes,
      });
    } else {
      addEssential({
        type: form.type, label: form.label, target_amount: form.target_amount ?? 0,
        current_amount: form.current_amount ?? 0, provider: form.provider,
        renewal_date: form.renewal_date, premium: form.premium, notes: form.notes,
      });
    }
    setSheetOpen(false);
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert('Delete', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeEssential(id) },
    ]);
  };

  const byType = (type: EssentialType) => essentials.filter(e => e.type === type);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
        <Text style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.text }}>
          Essentials
        </Text>
        <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.textSecondary }}>
          Your financial safety net
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}>
        {ESSENTIAL_TYPES.map(typeInfo => {
          const items = byType(typeInfo.value);
          return (
            <View key={typeInfo.value} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 22 }}>{typeInfo.icon}</Text>
                  <View>
                    <Text style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
                      {typeInfo.label}
                    </Text>
                    <Text style={{ fontSize: theme.fontSize.xs, color: theme.colors.textSecondary }}>
                      {typeInfo.description}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => openAdd(typeInfo.value)}
                  style={{
                    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                    backgroundColor: theme.colors.primaryMuted,
                  }}>
                  <Text style={{ fontSize: theme.fontSize.sm, color: theme.colors.primary, fontWeight: theme.fontWeight.semibold }}>
                    + Add
                  </Text>
                </TouchableOpacity>
              </View>

              {items.length === 0 ? (
                <TouchableOpacity
                  onPress={() => openAdd(typeInfo.value)}
                  style={{
                    borderRadius: 14, padding: 16, alignItems: 'center',
                    borderWidth: 1, borderColor: theme.colors.border, borderStyle: 'dashed',
                    backgroundColor: theme.colors.surface,
                  }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
                    Tap to set up {typeInfo.label}
                  </Text>
                </TouchableOpacity>
              ) : (
                items.map(e => (
                  <EssentialCard
                    key={e.id}
                    essential={e}
                    onEdit={() => openEdit(e)}
                    onDelete={() => handleDelete(e.id, e.label || typeInfo.label)}
                  />
                ))
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Edit / Add sheet */}
      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} title={editingId ? 'Edit' : 'Add ' + ESSENTIAL_TYPES.find(t => t.value === form.type)?.label} snapHeight="tall">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={{ padding: 20 }}>
            <FormTextInput
              label="Label (optional)"
              value={form.label ?? ''}
              onChangeText={v => setForm(f => ({ ...f, label: v }))}
              placeholder={ESSENTIAL_TYPES.find(t => t.value === form.type)?.label}
            />
            <AmountInput
              label={form.type === 'EMERGENCY_FUND' ? 'Current Amount' : 'Current Coverage'}
              value={String(form.current_amount ?? '')}
              onChangeText={v => setForm(f => ({ ...f, current_amount: parseFloat(v) || 0 }))}
            />
            <AmountInput
              label={form.type === 'EMERGENCY_FUND' ? 'Target Amount' : 'Target Coverage'}
              value={String(form.target_amount ?? '')}
              onChangeText={v => setForm(f => ({ ...f, target_amount: parseFloat(v) || 0 }))}
            />
            <FormTextInput
              label={form.type === 'EMERGENCY_FUND' ? 'Bank / Account' : 'Insurance Provider'}
              value={form.provider ?? ''}
              onChangeText={v => setForm(f => ({ ...f, provider: v }))}
              placeholder="e.g. HDFC Bank"
            />
            {form.type !== 'EMERGENCY_FUND' && (
              <>
                <DatePicker
                  label="Renewal Date"
                  value={form.renewal_date ?? ''}
                  onChange={v => setForm(f => ({ ...f, renewal_date: v }))}
                />
                <AmountInput
                  label="Annual Premium"
                  value={String(form.premium ?? '')}
                  onChangeText={v => setForm(f => ({ ...f, premium: parseFloat(v) || 0 }))}
                />
              </>
            )}
            <FormTextInput
              label="Notes"
              value={form.notes ?? ''}
              onChangeText={v => setForm(f => ({ ...f, notes: v }))}
              multiline numberOfLines={2}
            />
            <Button label={editingId ? 'Save Changes' : 'Add'} onPress={handleSave} fullWidth />
          </View>
        </KeyboardAvoidingView>
      </BottomSheet>
    </SafeAreaView>
  );
}

