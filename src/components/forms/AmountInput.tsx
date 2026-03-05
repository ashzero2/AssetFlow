import React from 'react';
import { View, Text } from 'react-native';
import { FormTextInput } from './TextInput';
import { useTheme } from '../../theme';

interface AmountInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  currency?: string;
}

export function AmountInput({ label, value, onChangeText, error, currency = '₹' }: AmountInputProps) {
  const { theme } = useTheme();

  return (
    <FormTextInput
      label={label ?? 'Amount'}
      value={value}
      onChangeText={(text) => {
        // Allow only numbers and one decimal point
        const cleaned = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        onChangeText(cleaned);
      }}
      keyboardType="decimal-pad"
      placeholder="0.00"
      error={error}
      leftIcon={
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium }}>
          {currency}
        </Text>
      }
    />
  );
}

