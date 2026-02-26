import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/PillButton';
import { useMusic } from '@/state/music-context';
import { colors } from '@/theme/colors';
import { PlayMode } from '@/types/music';

function modeText(mode: PlayMode) {
  if (mode === PlayMode.Random) return '随机播放';
  if (mode === PlayMode.Loop) return '单曲循环';
  return '顺序播放';
}

export function QueueSheet() {
  const {
    queueVisible,
    setQueueVisible,
    setAddSongVisible,
    state,
    currentSong,
    cyclePlayMode,
    selectQueueSong,
    deleteSong,
    clearPlaylist,
    isFavorite,
    toggleFavorite
  } = useMusic();

  return (
    <Modal visible={queueVisible} transparent animationType="fade" onRequestClose={() => setQueueVisible(false)}>
      <Pressable style={styles.mask} onPress={() => setQueueVisible(false)}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{modeText(state.mode)}</Text>
            <View style={styles.headerActions}>
              <PillButton label="切换模式" onPress={cyclePlayMode} />
              <PillButton label="清空" tone="danger" onPress={clearPlaylist} />
            </View>
          </View>

          <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 8 }}>
            {state.sequenceList.map((song, index) => {
              const current = currentSong?.id === song.id;
              return (
                <Pressable key={`${song.id}-${index}`} style={styles.item} onPress={() => selectQueueSong(song)}>
                  <Text style={[styles.itemText, current && styles.current]} numberOfLines={1}>
                    {index + 1}. {song.name}
                  </Text>
                  <View style={styles.itemActions}>
                    <PillButton
                      label={isFavorite(song) ? '取消收藏' : '收藏'}
                      onPress={() => toggleFavorite(song)}
                    />
                    <PillButton label="删除" tone="danger" onPress={() => deleteSong(song)} />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <PillButton label="添加歌曲到列表" tone="accent" onPress={() => setAddSongVisible(true)} />
            <PillButton label="关闭" onPress={() => setQueueVisible(false)} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end'
  },
  panel: {
    maxHeight: '82%',
    backgroundColor: '#0E1B26',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14
  },
  header: {
    gap: 10,
    marginBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  list: {
    maxHeight: 320
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  itemText: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 8
  },
  current: {
    color: colors.accent
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8
  }
});
