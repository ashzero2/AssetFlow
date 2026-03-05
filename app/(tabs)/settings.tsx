import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import type { ThemeMode } from '../../src/theme';
import { IconButton } from '../../src/components/ui/IconButton';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const router = useRouter();

  const themeModes: { value: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'light', label: 'Light', icon: 'sunny-outline' },
    { value: 'dark', label: 'Dark', icon: 'moon-outline' },
    { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  ];

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={{
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.textSecondary,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginTop: 24,
      marginBottom: 8,
      paddingHorizontal: 4,
    }}>{title}</Text>
  );

  const SettingRow = ({
    icon, color, label, subtitle, right, onPress, last = false,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    label: string;
    subtitle?: string;
    right?: React.ReactNode;
    onPress?: () => void;
    last?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <View style={{
        width: 38, height: 38, borderRadius: 10,
        backgroundColor: `${color}18`,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 14,
      }}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: theme.fontSize.md,
          fontWeight: theme.fontWeight.medium,
          color: theme.colors.text,
        }}>{label}</Text>
        {subtitle && (
          <Text style={{
            fontSize: theme.fontSize.xs,
            color: theme.colors.textSecondary,
            marginTop: 1,
          }}>{subtitle}</Text>
        )}
      </View>
      {right}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: theme.colors.border,
      }}>
        <IconButton name="arrow-back" onPress={() => router.back()} />
        <Text style={{
          flex: 1, textAlign: 'center',
          fontSize: theme.fontSize.lg,
          fontWeight: theme.fontWeight.bold,
          color: theme.colors.text,
        }}>Settings</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        }}>
          <View style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
              <View style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: `${theme.colors.primary}18`,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 14,
              }}>
                <Ionicons name="color-palette-outline" size={19} color={theme.colors.primary} />
              </View>
              <Text style={{
                fontSize: theme.fontSize.md,
                fontWeight: theme.fontWeight.medium,
                color: theme.colors.text,
              }}>Theme</Text>
            </View>

            {/* Theme mode selector */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: theme.colors.surfaceAlt,
              borderRadius: 12,
              padding: 4,
              gap: 4,
            }}>
              {themeModes.map(m => {
                const isActive = themeMode === m.value;
                return (
                  <TouchableOpacity
                    key={m.value}
                    onPress={() => setThemeMode(m.value)}
                    activeOpacity={0.75}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderRadius: 9,
                      backgroundColor: isActive ? theme.colors.surface : 'transparent',
                      gap: 4,
                      shadowColor: isActive ? '#000' : 'transparent',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: isActive ? 0.08 : 0,
                      shadowRadius: 4,
                      elevation: isActive ? 2 : 0,
                    }}
                  >
                    <Ionicons
                      name={m.icon}
                      size={20}
                      color={isActive ? theme.colors.primary : theme.colors.textSecondary}
                    />
                    <Text style={{
                      fontSize: 11,
                      fontWeight: theme.fontWeight.semibold,
                      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                    }}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Profile */}
        <SectionHeader title="Profile" />
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        }}>
          <SettingRow
            icon="person-outline"
            color={theme.colors.primary}
            label="Display Name"
            subtitle="Personalise your greeting"
            right={
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: theme.colors.surfaceAlt, borderRadius: 99 }}>
                <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.semibold }}>Soon</Text>
              </View>
            }
          />
          <SettingRow
            icon="cash-outline"
            color="#B07D4A"
            label="Default Currency"
            subtitle="Currently: INR (₹)"
            last
            right={
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: theme.colors.surfaceAlt, borderRadius: 99 }}>
                <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.semibold }}>Soon</Text>
              </View>
            }
          />
        </View>

        {/* Data */}
        <SectionHeader title="Data" />
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        }}>
          <SettingRow
            icon="cloud-download-outline"
            color="#7A9BAA"
            label="Export Data"
            subtitle="Export as CSV or JSON"
            last
            right={
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, backgroundColor: theme.colors.surfaceAlt, borderRadius: 99 }}>
                <Text style={{ fontSize: 10, color: theme.colors.textSecondary, fontWeight: theme.fontWeight.semibold }}>Soon</Text>
              </View>
            }
          />
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        }}>
          <SettingRow
            icon="information-circle-outline"
            color="#9080A8"
            label="Version"
            subtitle="1.0.0"
            last
            right={null}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

