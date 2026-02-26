import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { AddSongSheet } from '@/components/AddSongSheet';
import { EmptyView } from '@/components/EmptyView';
import { PillButton } from '@/components/PillButton';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionTitle } from '@/components/SectionTitle';
import { SongRow } from '@/components/SongRow';
import { useMusic } from '@/state/music-context';
import { colors } from '@/theme/colors';

export function LibraryScreen() {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'favorite' | 'history'>('favorite');
  const { state, selectPlay, toggleFavorite, randomPlay, setAddSongVisible } = useMusic();

  const list = useMemo(
    () => (tab === 'favorite' ? state.favoriteList : state.playHistory),
    [tab, state.favoriteList, state.playHistory]
  );

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.statsPanel}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{state.favoriteList.length}</Text>
            <Text style={styles.statLabel}>收藏</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{state.playHistory.length}</Text>
            <Text style={styles.statLabel}>最近播放</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{state.searchHistory.length}</Text>
            <Text style={styles.statLabel}>搜索历史</Text>
          </View>
        </View>

        <SectionTitle title="用户中心" />
        <View style={styles.actions}>
          <PillButton label="我喜欢的" tone={tab === 'favorite' ? 'accent' : 'default'} onPress={() => setTab('favorite')} />
          <PillButton label="最近听的" tone={tab === 'history' ? 'accent' : 'default'} onPress={() => setTab('history')} />
          <PillButton label="随机播放" onPress={() => list.length && randomPlay(list)} />
          <PillButton label="添加歌曲" onPress={() => setAddSongVisible(true)} />
          <PillButton label="VR" onPress={() => navigation.navigate('Vr')} />
        </View>

        <View style={styles.sectionSpacing} />
        <SectionTitle title={tab === 'favorite' ? '我喜欢的' : '最近听的'} />
        {!list.length ? (
          <EmptyView text={tab === 'favorite' ? '暂无收藏歌曲' : '暂无播放记录'} />
        ) : (
          <View style={styles.songPanel}>
            {list.map((song, index) => (
              <SongRow
                key={`${song.id}-${index}`}
                song={song}
                onPress={() => selectPlay(list, index)}
                trailing={
                  tab === 'favorite' ? (
                    <PillButton label="取消收藏" tone="danger" onPress={() => toggleFavorite(song)} />
                  ) : undefined
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
      <AddSongSheet />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 140 },
  statsPanel: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)'
  },
  statValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sectionSpacing: { height: 18 },
  songPanel: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12
  }
});
