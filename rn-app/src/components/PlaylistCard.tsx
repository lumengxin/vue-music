import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

export function PlaylistCard({
  cover,
  title,
  subtitle,
  onPress
}: {
  cover: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: cover }} style={styles.cover} />
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    marginRight: 12
  },
  cover: {
    width: 180,
    height: 180,
    borderRadius: 18,
    backgroundColor: colors.panel
  },
  meta: {
    marginTop: 8
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2
  }
});
