import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function EmptyView({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center'
  },
  text: {
    color: colors.textMuted,
    fontSize: 13
  }
});
