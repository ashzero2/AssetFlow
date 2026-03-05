import React from 'react';
import {
  View, Text, TouchableOpacity, Modal, Animated,
  useWindowDimensions, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../theme';

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
}

interface NavItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  route: string;
  color: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: 'shield-checkmark-outline',
    label: 'Essentials',
    description: 'Emergency fund & insurance',
    route: '/(tabs)/essentials',
    color: '#7A9BAA',
  },
  {
    icon: 'bar-chart-outline',
    label: 'Insights',
    description: 'Charts & smart tips',
    route: '/(tabs)/insights',
    color: '#9080A8',
  },
  {
    icon: 'settings-outline',
    label: 'Settings',
    description: 'Theme, profile & preferences',
    route: '/(tabs)/settings',
    color: '#9A8070',
  },
];

export function DrawerMenu({ visible, onClose }: DrawerMenuProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const { height } = useWindowDimensions();
  const slideAnim = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 70,
        friction: 12,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const navigate = (route: string) => {
    onClose();
    setTimeout(() => router.push(route as any), 220);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ flex: 1, backgroundColor: theme.colors.overlay }}
      />

      {/* Bottom sheet panel */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: Platform.OS === 'ios' ? 36 : 24,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 20,
        }}
      >
        {/* Handle */}
        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
        </View>

        {/* Title */}
        <View style={{
          paddingHorizontal: 20, paddingVertical: 12,
          borderBottomWidth: 1, borderBottomColor: theme.colors.border,
        }}>
          <Text style={{
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.bold,
            color: theme.colors.text,
          }}>More</Text>
        </View>

        {/* Nav items */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {NAV_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.route}
              onPress={() => navigate(item.route)}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 4,
                borderBottomWidth: idx < NAV_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: theme.colors.border,
              }}
            >
              <View style={{
                width: 42, height: 42, borderRadius: 12,
                backgroundColor: `${item.color}18`,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 14,
              }}>
                <Ionicons name={item.icon} size={21} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: theme.fontSize.md,
                  fontWeight: theme.fontWeight.semibold,
                  color: theme.colors.text,
                }}>{item.label}</Text>
                <Text style={{
                  fontSize: theme.fontSize.xs,
                  color: theme.colors.textSecondary,
                  marginTop: 1,
                }}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

