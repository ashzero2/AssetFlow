import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme';
import { formatCurrencyCompact } from '../../utils/currency';

interface NetWorthCardProps {
  netWorth: number;
  totalAssets: number;
  onPress?: () => void;
}

export function NetWorthCard({ netWorth, totalAssets, onPress }: NetWorthCardProps) {
  const { theme } = useTheme();

  const gradientColors: [string, string, string] = theme.isDark
    ? ['#3A5445', '#4A6B5A', '#5A7A65']
    : ['#5A7A65', '#7C9885', '#9AB5A5'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={onPress ? 0.85 : 1} style={{ marginHorizontal: 16, marginVertical: 8 }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: 24,
          shadowColor: '#5A7A65',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 14,
          elevation: 8,
        }}
      >
        <Text style={{
          color: 'rgba(255,255,255,0.75)',
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.medium,
          marginBottom: 6,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}>Net Worth</Text>

        <Text style={{
          color: '#fff',
          fontSize: theme.fontSize['4xl'],
          fontWeight: theme.fontWeight.bold,
          letterSpacing: -1,
          marginBottom: 20,
        }}>{formatCurrencyCompact(netWorth)}</Text>

        <View style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 14,
          padding: 14,
          gap: 20,
        }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: theme.fontSize.xs, marginBottom: 4, letterSpacing: 0.4 }}>
              TOTAL ASSETS
            </Text>
            <Text style={{ color: '#fff', fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold }}>
              {formatCurrencyCompact(totalAssets)}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: theme.fontSize.xs, marginBottom: 4, letterSpacing: 0.4 }}>
              LIABILITIES
            </Text>
            <Text style={{ color: '#fff', fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold }}>
              ₹0
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
