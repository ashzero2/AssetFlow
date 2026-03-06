import React, { useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { Platform, TouchableOpacity, View } from 'react-native';
import { DrawerMenu } from '../../src/components/ui/DrawerMenu';

export default function TabsLayout() {
  const { theme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  // Wraps a tab button so tapping it always navigates to the tab's index,
  // resetting any nested stack (e.g. [id] screens) rather than resuming it.
  const resetTabButton = (indexRoute: string) => (props: any) => (
    <TouchableOpacity
      {...props}
      onPress={() => router.navigate(indexRoute as any)}
      style={[props.style, { alignItems: 'center', justifyContent: 'center' }]}
    />
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar,
            borderTopColor: theme.colors.tabBarBorder,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 28 : 10,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="assets"
          options={{
            title: 'Assets',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trending-up-outline" size={size} color={color} />
            ),
            tabBarButton: resetTabButton('/(tabs)/assets'),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: 'Transactions',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="swap-vertical-outline" size={size} color={color} />
            ),
            tabBarButton: resetTabButton('/(tabs)/transactions'),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="flag-outline" size={size} color={color} />
            ),
            tabBarButton: resetTabButton('/(tabs)/goals'),
          }}
        />

        <Tabs.Screen
          name="essentials"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="insights"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="settings"
          options={{ href: null }}
        />

        {/* Phantom "More" entry rendered as a custom tab button */}
        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ellipsis-horizontal-circle-outline" size={size} color={color} />
            ),
            tabBarButton: (props) => (
              <TouchableOpacity
                {...(props as any)}
                onPress={() => setDrawerOpen(true)}
                style={[
                  (props as any).style,
                  { alignItems: 'center', justifyContent: 'center' },
                ]}
              >
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
                  <Ionicons
                    name="ellipsis-horizontal-circle-outline"
                    size={24}
                    color={theme.colors.tabInactive}
                  />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
