import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/theme/colors';

export function PillButton({
  label,
  onPress,
  tone = 'default'
}: {
  label: string;
  onPress?: () => void;
  tone?: 'default' | 'accent' | 'danger';
}) {
  const bg =
    tone === 'accent'
      ? 'rgba(61,220,151,0.16)'
      : tone === 'danger'
        ? 'rgba(242,109,109,0.12)'
        : 'rgba(255,255,255,0.06)';
  const textColor = tone === 'danger' ? colors.danger : tone === 'accent' ? colors.accent : colors.text;

  return (
    <Pressable style={[styles.btn, { backgroundColor: bg }]} onPress={onPress}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999
  },
  label: {
    fontSize: 12,
    fontWeight: '600'
  }
});
