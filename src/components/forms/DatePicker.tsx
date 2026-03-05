import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addMonths, subMonths, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { useTheme } from '../../theme';

interface DatePickerProps {
  label?: string;
  value: string; // ISO date string YYYY-MM-DD
  onChange: (date: string) => void;
  error?: string;
}

export function DatePicker({ label, value, onChange, error }: DatePickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());

  const selected = value ? new Date(value) : null;
  const displayValue = selected ? format(selected, 'dd MMM yyyy') : 'Select date';

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDayOfMonth = getDay(startOfMonth(viewDate));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const selectDay = (day: number) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(format(d, 'yyyy-MM-dd'));
    setOpen(false);
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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
        style={{
          flexDirection: 'row', alignItems: 'center',
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: error ? theme.colors.danger : theme.colors.border,
          paddingHorizontal: 14, paddingVertical: 12,
        }}
      >
        <Ionicons name="calendar-outline" size={18} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
        <Text style={{
          flex: 1, fontSize: theme.fontSize.md,
          color: selected ? theme.colors.text : theme.colors.textSecondary,
        }}>{displayValue}</Text>
        <Ionicons name="chevron-down" size={18} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      {error && <Text style={{ color: theme.colors.danger, fontSize: theme.fontSize.xs, marginTop: 4 }}>{error}</Text>}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: theme.colors.overlay }} onPress={() => setOpen(false)} />
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: 20, paddingBottom: 36,
        }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
          </View>
          {/* Month Nav */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => setViewDate(subMonths(viewDate, 1))}>
              <Ionicons name="chevron-back" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
            <Text style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text }}>
              {format(viewDate, 'MMMM yyyy')}
            </Text>
            <TouchableOpacity onPress={() => setViewDate(addMonths(viewDate, 1))}>
              <Ionicons name="chevron-forward" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          {/* Week days header */}
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {weekDays.map(d => (
              <Text key={d} style={{ flex: 1, textAlign: 'center', color: theme.colors.textSecondary, fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.medium }}>{d}</Text>
            ))}
          </View>
          {/* Days grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {days.map((day, index) => {
              if (!day) return <View key={`empty-${index}`} style={{ width: '14.28%', padding: 4 }} />;
              const isSelected = selected &&
                selected.getDate() === day &&
                selected.getMonth() === viewDate.getMonth() &&
                selected.getFullYear() === viewDate.getFullYear();
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => selectDay(day)}
                  style={{
                    width: '14.28%', aspectRatio: 1,
                    alignItems: 'center', justifyContent: 'center',
                    borderRadius: 20,
                    backgroundColor: isSelected ? theme.colors.primary : 'transparent',
                  }}
                >
                  <Text style={{
                    color: isSelected ? '#fff' : theme.colors.text,
                    fontSize: theme.fontSize.sm,
                    fontWeight: isSelected ? theme.fontWeight.bold : theme.fontWeight.regular,
                  }}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

