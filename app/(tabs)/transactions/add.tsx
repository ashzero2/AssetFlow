import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/theme';
import { useTransactionsStore } from '../../../src/store/useTransactionsStore';
import { FormTextInput } from '../../../src/components/forms/TextInput';
import { AmountInput } from '../../../src/components/forms/AmountInput';
import { Picker } from '../../../src/components/forms/Picker';
import { DatePicker } from '../../../src/components/forms/DatePicker';
import { ToggleGroup } from '../../../src/components/forms/ToggleGroup';
import { Button } from '../../../src/components/ui/Button';
import { IconButton } from '../../../src/components/ui/IconButton';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../../../src/constants/transactionCategories';
import { todayISO } from '../../../src/utils/date';

export default function AddTransactionScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const transactions = useTransactionsStore(s => s.transactions);
  const addTransaction = useTransactionsStore(s => s.add);
  const updateTransaction = useTransactionsStore(s => s.update);
  const removeTransaction = useTransactionsStore(s => s.remove);

  const editing = edit ? transactions.find(t => String(t.id) === edit) : null;

  const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>(editing?.type ?? 'EXPENSE');
  const [amount, setAmount] = useState(editing ? String(editing.amount) : '');
  const [category, setCategory] = useState(editing?.category ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = txType === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!amount || parseFloat(amount) <= 0) e.amount = 'Enter a valid amount';
    if (!category) e.category = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      updateTransaction(editing.id, { type: txType, amount: parseFloat(amount), category: category as any, description, date });
    } else {
      addTransaction({ type: txType, amount: parseFloat(amount), category: category as any, description, date });
    }
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Remove this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { removeTransaction(editing!.id); router.back(); } },
    ]);
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
          }}>{editing ? 'Edit Transaction' : 'Add Transaction'}</Text>
          {editing ? (
            <IconButton name="trash-outline" onPress={handleDelete} color={theme.colors.danger} />
          ) : (
            <View style={{ width: 38 }} />
          )}
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          {/* Type toggle */}
          <View style={{ marginBottom: 20 }}>
            <ToggleGroup
              options={[
                { value: 'EXPENSE', label: 'Expense', icon: '↓' },
                { value: 'INCOME', label: 'Income', icon: '↑' },
              ]}
              value={txType}
              onChange={(v) => { setTxType(v as 'INCOME' | 'EXPENSE'); setCategory(''); }}
              activeColor={txType === 'INCOME' ? theme.colors.income : theme.colors.expense}
            />
          </View>

          <AmountInput
            label="Amount *"
            value={amount}
            onChangeText={setAmount}
            error={errors.amount}
          />
          <Picker
            label="Category *"
            value={category}
            options={categories.map(c => ({ value: c.value, label: c.label, icon: c.icon }))}
            onSelect={setCategory}
            placeholder="Select category"
            error={errors.category}
          />
          <FormTextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
          />
          <DatePicker label="Date" value={date} onChange={setDate} />

          <Button label={editing ? 'Save Changes' : 'Add Transaction'} onPress={handleSave} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

