import React from 'react';
import {
  Modal, View, TouchableOpacity, Text, StyleSheet,
  TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapHeight?: 'half' | 'tall' | 'auto';
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

export function BottomSheet({ visible, onClose, title, children, snapHeight = 'auto' }: BottomSheetProps) {
  const { theme } = useTheme();

  const maxHeight =
    snapHeight === 'half' ? SCREEN_HEIGHT * 0.5 :
    snapHeight === 'tall' ? SCREEN_HEIGHT * 0.85 :
    SCREEN_HEIGHT * 0.9;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: theme.colors.overlay }} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <View style={{
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight,
          paddingBottom: 32,
        }}>
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: theme.colors.border }} />
          </View>
          {title && (
            <View style={{
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
              <Text style={{
                fontSize: theme.fontSize.lg,
                fontWeight: theme.fontWeight.semibold,
                color: theme.colors.text,
                textAlign: 'center',
              }}>{title}</Text>
            </View>
          )}
          <ScrollView keyboardShouldPersistTaps="handled">
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}


