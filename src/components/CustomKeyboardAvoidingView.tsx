import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import React from 'react';

export function CustomKeyboardAvoidingView({children, style}: any) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();

  return (
    <KeyboardAvoidingView
      style={StyleSheet.compose(style, {marginBottom: insets.bottom})}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled={true}
      keyboardVerticalOffset={headerHeight + insets.bottom}>
      {children}
    </KeyboardAvoidingView>
  );
}
