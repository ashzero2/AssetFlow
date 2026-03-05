import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface PickerOption {
  value: string;
  label: string;
  icon?: string;
}

interface PickerProps {
  label?: string;
  value: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export function Picker({ label, value, options, onSelect, placeholder = 'Select...', error }: PickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
          color: theme.colors.text,
          marginBottom: 6,
        }}>{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: error ? theme.colors.danger : theme.colors.border,
          paddingHorizontal: 14,
          paddingVertical: 12,
        }}
      >
        {selected?.icon && <Text style={{ marginRight: 8, fontSize: 18 }}>{selected.icon}</Text>}
        <Text style={{
          flex: 1,
          fontSize: theme.fontSize.md,
          color: selected ? theme.colors.text : theme.colors.textSecondary,
        }}>
          {selected?.label ?? placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      {error && (
        <Text style={{ color: theme.colors.danger, fontSize: theme.fontSize.xs, marginTop: 4 }}>{error}</Text>
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: theme.colors.overlay }} onPress={() => setOpen(false)} />
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          maxHeight: '60%', paddingBottom: 32,
        }}>
          <View style={{ alignItems: 'center', padding: 12 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
          </View>
          {label && (
            <Text style={{
              textAlign: 'center', fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.semibold, color: theme.colors.text, marginBottom: 8,
            }}>{label}</Text>
          )}
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onSelect(item.value); setOpen(false); }}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 20, paddingVertical: 14,
                  backgroundColor: item.value === value ? theme.colors.primaryMuted : 'transparent',
                }}
              >
                {item.icon && <Text style={{ fontSize: 22, marginRight: 12 }}>{item.icon}</Text>}
                <Text style={{
                  flex: 1, fontSize: theme.fontSize.md, color: theme.colors.text,
                  fontWeight: item.value === value ? theme.fontWeight.semibold : theme.fontWeight.regular,
                }}>{item.label}</Text>
                {item.value === value && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

