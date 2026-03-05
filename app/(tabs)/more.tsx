// This file exists only so expo-router recognises the "more" segment.
// The More tab never navigates here — its tabBarButton opens the DrawerMenu instead.
import React from 'react';
import { View } from 'react-native';

export default function MorePlaceholder() {
  return <View style={{ flex: 1 }} />;
}

