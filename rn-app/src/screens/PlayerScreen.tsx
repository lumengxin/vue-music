import React, { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddSongSheet } from '@/components/AddSongSheet';
import { EmptyView } from '@/components/EmptyView';
import { PillButton } from '@/components/PillButton';
import { ProgressSeekBar } from '@/components/ProgressSeekBar';
import { QueueSheet } from '@/components/QueueSheet';
import { useMusic } from '@/state/music-context';
import { colors } from '@/theme/colors';
import { PlayMode } from '@/types/music';

function modeLabel(mode: PlayMode) {
  if (mode === PlayMode.Random) return '随机';
  if (mode === PlayMode.Loop) return '单曲循环';
  return '顺序';
}

export function PlayerScreen() {
  const [view, setView] = useState<'cd' | 'lyric'>('cd');
  const {
    state,
    currentSong,
    positionMillis,
    durationMillis,
    buffering,
    loadingTrack,
    setPlayingState,
    togglePlay,
    nextSong,
    prevSong,
    cyclePlayMode,
    toggleFavorite,
    isFavorite,
    seekToPercent,
    setQueueVisible,
    setAddSongVisible
  } = useMusic();

  const lyricWindow = useMemo(() => {
    const start = Math.max(0, state.currentLyricIndex - 4);
    return state.currentLyric.slice(start, start + 10);
  }, [state.currentLyric, state.currentLyricIndex]);

  if (!currentSong) {
    return (
      <SafeAreaView style={styles.wrap}>
        <View style={styles.inner}>
          <Text style={styles.title}>播放器</Text>
          <EmptyView text="当前没有正在播放的歌曲" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrap}>
      <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>正在播放</Text>
        <View style={styles.card}>
          <Image source={{ uri: currentSong.image }} style={styles.cover} />
          <Text style={styles.songName}>{currentSong.name}</Text>
          <Text style={styles.songMeta}>
            {currentSong.singer || '未知歌手'} · {currentSong.album || '未知专辑'}
          </Text>

          <View style={styles.viewSwitch}>
            <PillButton label="唱片" tone={view === 'cd' ? 'accent' : 'default'} onPress={() => setView('cd')} />
            <PillButton label="歌词" tone={view === 'lyric' ? 'accent' : 'default'} onPress={() => setView('lyric')} />
            <PillButton label={`模式: ${modeLabel(state.mode)}`} onPress={cyclePlayMode} />
          </View>

          {view === 'cd' ? (
            <View style={styles.cdPane}>
              <Text style={styles.centerLyric} numberOfLines={2}>
                {state.currentLyricText || '暂无歌词'}
              </Text>
            </View>
          ) : (
            <View style={styles.lyricPane}>
              {lyricWindow.length ? (
                lyricWindow.map((line) => {
                  const active = line.time === state.currentLyric[state.currentLyricIndex]?.time;
                  return (
                    <Text key={`${line.time}-${line.text}`} style={[styles.lyricLine, active && styles.lyricLineActive]}>
                      {line.text || '...'}
                    </Text>
                  );
                })
              ) : (
                <Text style={styles.lyricLine}>暂无歌词</Text>
              )}
            </View>
          )}

          <View style={styles.statusRow}>
            <Text style={styles.statusText}>{loadingTrack ? '加载音频中...' : buffering ? '缓冲中...' : '已就绪'}</Text>
            <Text style={styles.statusText}>{state.playing ? '播放中' : '已暂停'}</Text>
          </View>

          <ProgressSeekBar
            positionMillis={positionMillis}
            durationMillis={durationMillis || currentSong.duration * 1000}
            onSeek={(percent) => void seekToPercent(percent)}
          />

          <View style={styles.controls}>
            <PillButton label="-10s" onPress={() => void seekToPercent(Math.max(0, (positionMillis - 10000) / Math.max(durationMillis || 1, 1)))} />
            <PillButton label="上一首" onPress={() => void prevSong()} />
            <PillButton label={state.playing ? '暂停' : '播放'} tone="accent" onPress={togglePlay} />
            <PillButton label="下一首" onPress={() => void nextSong()} />
            <PillButton label="+10s" onPress={() => void seekToPercent(Math.min(1, (positionMillis + 10000) / Math.max(durationMillis || 1, 1)))} />
          </View>

          <View style={styles.controls}>
            <PillButton
              label={isFavorite(currentSong) ? '取消收藏' : '收藏'}
              onPress={() => void toggleFavorite(currentSong)}
            />
            <PillButton label="播放列表" onPress={() => setQueueVisible(true)} />
            <PillButton label="添加歌曲" onPress={() => setAddSongVisible(true)} />
            <PillButton label="停止" tone="danger" onPress={() => setPlayingState(false)} />
          </View>
        </View>
      </ScrollView>

      <QueueSheet />
      <AddSongSheet />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#071018' },
  inner: { padding: 16, paddingBottom: 24 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16
  },
  cover: { width: '100%', aspectRatio: 1, borderRadius: 16, backgroundColor: colors.panel },
  songName: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 14 },
  songMeta: { color: colors.textMuted, marginTop: 4 },
  viewSwitch: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  cdPane: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    minHeight: 90,
    justifyContent: 'center'
  },
  centerLyric: {
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14
  },
  lyricPane: {
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    minHeight: 180,
    justifyContent: 'center'
  },
  lyricLine: {
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 13
  },
  lyricLineActive: {
    color: colors.accent,
    fontWeight: '700'
  },
  statusRow: {
    marginTop: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statusText: { color: colors.textMuted, fontSize: 12 },
  controls: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }
});
