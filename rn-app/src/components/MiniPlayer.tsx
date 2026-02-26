import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';
import { useMusic } from '@/state/music-context';

export function MiniPlayer({ onOpen }: { onOpen: () => void }) {
  const { currentSong, state, togglePlay } = useMusic();
  const insets = useSafeAreaInsets();

  if (!currentSong) return null;

  return (
    <View style={[styles.wrap, { bottom: 72 + Math.max(insets.bottom, 8) }]}>
      <Pressable style={styles.card} onPress={onOpen}>
        <Image source={{ uri: currentSong.image }} style={styles.cover} />
        <View style={styles.meta}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.name}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {currentSong.singer || '未知歌手'}
          </Text>
        </View>
        <Pressable style={styles.ctrl} onPress={togglePlay}>
          <Text style={styles.ctrlText}>{state.playing ? '暂停' : '播放'}</Text>
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12
  },
  card: {
    backgroundColor: '#112130',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  cover: {
    width: 42,
    height: 42,
    borderRadius: 10
  },
  meta: {
    flex: 1,
    marginHorizontal: 10
  },
  title: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 13
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2
  },
  ctrl: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(61,220,151,0.16)'
  },
  ctrlText: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 12
  }
});
