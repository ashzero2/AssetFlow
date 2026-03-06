import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/theme';
import { useGoalsStore } from '../../../src/store/useGoalsStore';
import { FormTextInput } from '../../../src/components/forms/TextInput';
import { AmountInput } from '../../../src/components/forms/AmountInput';
import { DatePicker } from '../../../src/components/forms/DatePicker';
import { Button } from '../../../src/components/ui/Button';
import { IconButton } from '../../../src/components/ui/IconButton';

const PRESET_ICONS = ['🎯', '🏠', '🚗', '✈️', '💍', '🎓', '💻', '🏥', '👶', '🌴', '💰', '🏦'];
const PRESET_COLORS = ['#5C6BC0', '#00897B', '#F57C00', '#E53935', '#8E24AA', '#0288D1', '#43A047', '#6D4C41', '#546E7A', '#D81B60'];

export default function AddGoalScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const goals = useGoalsStore(s => s.goals);
  const addGoal = useGoalsStore(s => s.add);
  const updateGoal = useGoalsStore(s => s.update);

  const editing = edit ? goals.find(g => String(g.id) === edit) : null;

  const [name, setName] = useState(editing?.name ?? '');
  const [targetAmount, setTargetAmount] = useState(editing ? String(editing.target_amount) : '');
  const [deadline, setDeadline] = useState(editing?.deadline ?? '');
  const [color, setColor] = useState(editing?.color ?? '#5C6BC0');
  const [icon, setIcon] = useState(editing?.icon ?? '🎯');
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Goal name is required';
    if (!targetAmount || parseFloat(targetAmount) <= 0) e.target = 'Enter a valid target amount';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      updateGoal(editing.id, { name, target_amount: parseFloat(targetAmount), deadline: deadline || undefined, color, icon, notes });
    } else {
      addGoal({ name, target_amount: parseFloat(targetAmount), deadline: deadline || undefined, color, icon, notes });
    }
    // Always land on the goals list, regardless of where we came from
    router.navigate('/(tabs)/goals' as any);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
          paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        }}>
          <IconButton name="arrow-back" onPress={() => router.navigate('/(tabs)/goals' as any)} />
          <Text style={{
            flex: 1, textAlign: 'center',
            fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text,
          }}>{editing ? 'Edit Goal' : 'New Goal'}</Text>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          {/* Icon & preview */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <View style={{
              width: 72, height: 72, borderRadius: 20,
              backgroundColor: `${color}25`,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 36 }}>{icon}</Text>
            </View>
          </View>

          <FormTextInput
            label="Goal Name *"
            value={name}
            onChangeText={setName}
            placeholder="e.g. House Down Payment"
            error={errors.name}
          />
          <AmountInput
            label="Target Amount *"
            value={targetAmount}
            onChangeText={setTargetAmount}
            error={errors.target}
          />
          <DatePicker label="Target Date (optional)" value={deadline} onChange={setDeadline} />

          {/* Icon picker */}
          <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.text, marginBottom: 8 }}>
            Icon
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
            {PRESET_ICONS.map(i => (
              <TouchableOpacity
                key={i}
                onPress={() => setIcon(i)}
                style={{
                  width: 44, height: 44, borderRadius: 10,
                  backgroundColor: icon === i ? `${color}30` : theme.colors.surfaceAlt,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: icon === i ? 2 : 0,
                  borderColor: color,
                }}>
                <Text style={{ fontSize: 22 }}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Color picker */}
          <Text style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: theme.colors.text, marginBottom: 8 }}>
            Color
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
            {PRESET_COLORS.map(c => (
              <TouchableOpacity
                key={c}
                onPress={() => setColor(c)}
                style={{
                  width: 32, height: 32, borderRadius: 16,
                  backgroundColor: c,
                  borderWidth: color === c ? 3 : 0,
                  borderColor: theme.colors.text,
                  transform: [{ scale: color === c ? 1.15 : 1 }],
                }}
              />
            ))}
          </View>

          <FormTextInput label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes..." multiline numberOfLines={3} />
          <Button label={editing ? 'Save Changes' : 'Create Goal'} onPress={handleSave} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

