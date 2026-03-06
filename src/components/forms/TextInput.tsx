import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, TextInputProps, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface FormTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function FormTextInput({
  label, error, hint, containerStyle, leftIcon, rightIcon, style,
  onFocus, onBlur, ...props
}: FormTextInputProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={[{ marginBottom: 16 }, containerStyle]}>
      {label && (
        <Text style={{
          fontSize: theme.fontSize.sm,
          fontWeight: theme.fontWeight.medium,
          color: theme.colors.text,
          marginBottom: 6,
        }}>{label}</Text>
      )}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surfaceAlt,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: error ? theme.colors.danger : focused ? theme.colors.primary : theme.colors.border,
        paddingHorizontal: 14,
      }}>
        {leftIcon && <View style={{ marginRight: 8 }}>{leftIcon}</View>}
        <RNTextInput
          style={[{
            flex: 1,
            paddingVertical: 12,
            fontSize: theme.fontSize.md,
            color: theme.colors.text,
          }, style]}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />
        {rightIcon && <View style={{ marginLeft: 8 }}>{rightIcon}</View>}
      </View>
      {error && (
        <Text style={{ color: theme.colors.danger, fontSize: theme.fontSize.xs, marginTop: 4 }}>{error}</Text>
      )}
      {hint && !error && (
        <Text style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.xs, marginTop: 4 }}>{hint}</Text>
      )}
    </View>
  );
}

