import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { Song } from '@/types/music';

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function SongRow({
  song,
  trailing,
  onPress
}: {
  song: Song;
  trailing?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Image source={{ uri: song.image }} style={styles.cover} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {song.name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {song.singer || '未知歌手'} · {song.album || '未知专辑'}
        </Text>
      </View>
      <View style={styles.trailing}>
        {trailing ?? <Text style={styles.duration}>{formatDuration(song.duration)}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    gap: 10
  },
  cover: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: colors.panel
  },
  content: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2
  },
  trailing: {
    alignItems: 'flex-end',
    minWidth: 44
  },
  duration: {
    color: colors.textMuted,
    fontSize: 12
  }
});
