import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../theme';

interface ToggleOption {
  value: string;
  label: string;
  icon?: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  activeColor?: string;
}

export function ToggleGroup({ options, value, onChange, activeColor }: ToggleGroupProps) {
  const { theme } = useTheme();
  const activeCol = activeColor ?? theme.colors.primary;

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceAlt,
      borderRadius: 12,
      padding: 4,
    }}>
      {options.map(opt => {
        const isActive = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: isActive ? activeCol : 'transparent',
              gap: 6,
            }}
          >
            {opt.icon && (
              <Text style={{ fontSize: 16 }}>{opt.icon}</Text>
            )}
            <Text style={{
              color: isActive ? '#fff' : theme.colors.textSecondary,
              fontWeight: isActive ? theme.fontWeight.semibold : theme.fontWeight.regular,
              fontSize: theme.fontSize.sm,
            }}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

