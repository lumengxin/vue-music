import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function LoadingView({ text = '加载中...' }: { text?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.accent} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: colors.textMuted,
    marginTop: 10
  }
});
