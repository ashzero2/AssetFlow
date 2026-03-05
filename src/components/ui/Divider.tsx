import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme';

interface DividerProps {
  marginVertical?: number;
}

export function Divider({ marginVertical = 8 }: DividerProps) {
  const { theme } = useTheme();
  return (
    <View style={{
      height: 1,
      backgroundColor: theme.colors.border,
      marginVertical,
    }} />
  );
}

