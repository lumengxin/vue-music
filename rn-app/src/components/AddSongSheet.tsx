import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { PillButton } from '@/components/PillButton';
import { SongRow } from '@/components/SongRow';
import { musicApi } from '@/services/music-api';
import { useMusic } from '@/state/music-context';
import { colors } from '@/theme/colors';
import type { SearchSuggestion, Song } from '@/types/music';

export function AddSongSheet() {
  const { addSongVisible, setAddSongVisible, state, insertSong, saveSearch, deleteSearch } = useMusic();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'recent' | 'history'>('recent');
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const visibleList = useMemo(() => {
    if (query.trim()) {
      return results.filter((item): item is Extract<SearchSuggestion, { type: 'song' }> => item.type === 'song');
    }
    return tab === 'recent' ? state.playHistory : [];
  }, [query, results, tab, state.playHistory]);

  async function runSearch() {
    const keyword = query.trim();
    if (!keyword) return;
    setLoading(true);
    try {
      const data = await musicApi.searchSuggestions(keyword, { showSinger: false });
      setResults(data);
      await saveSearch(keyword);
    } catch {
      Alert.alert('搜索失败', '无法获取搜索结果');
    } finally {
      setLoading(false);
    }
  }

  async function addSong(song: Song) {
    await insertSong(song);
    Alert.alert('已添加', '歌曲已加入播放列表');
    setAddSongVisible(false);
  }

  return (
    <Modal visible={addSongVisible} transparent animationType="slide" onRequestClose={() => setAddSongVisible(false)}>
      <Pressable style={styles.mask} onPress={() => setAddSongVisible(false)}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>添加歌曲到列表</Text>
            <PillButton label="关闭" onPress={() => setAddSongVisible(false)} />
          </View>

          <View style={styles.searchRow}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="搜索歌曲..."
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={runSearch}
            />
            <PillButton label={loading ? '搜索中' : '搜索'} tone="accent" onPress={runSearch} />
          </View>

          {!query.trim() && (
            <>
              <View style={styles.tabs}>
                <PillButton label="最近播放" tone={tab === 'recent' ? 'accent' : 'default'} onPress={() => setTab('recent')} />
                <PillButton label="搜索历史" tone={tab === 'history' ? 'accent' : 'default'} onPress={() => setTab('history')} />
              </View>
              {tab === 'history' && (
                <View style={styles.historyWrap}>
                  {state.searchHistory.map((item) => (
                    <View key={item} style={styles.historyRow}>
                      <PillButton label={item} onPress={() => setQuery(item)} />
                      <PillButton label="删除" tone="danger" onPress={() => deleteSearch(item)} />
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 12 }}>
            {visibleList.map((song, index) => (
              <SongRow
                key={`${song.id}-${index}`}
                song={song}
                onPress={() => addSong(song)}
                trailing={<PillButton label="添加" tone="accent" onPress={() => addSong(song)} />}
              />
            ))}
            {!!query.trim() &&
              results
                .filter((item) => item.type === 'singer')
                .map((singer) => (
                  <View key={`singer-${singer.singerId}`} style={styles.singerHint}>
                    <Text style={styles.singerHintText}>搜索结果包含歌手：{singer.singerName}</Text>
                  </View>
                ))}
          </ScrollView>
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
    backgroundColor: '#0E1B26',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
    maxHeight: '86%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  title: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: colors.text,
    paddingHorizontal: 12
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10
  },
  historyWrap: {
    gap: 8,
    marginBottom: 10
  },
  historyRow: {
    flexDirection: 'row',
    gap: 8
  },
  list: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)'
  },
  singerHint: {
    paddingVertical: 10
  },
  singerHintText: {
    color: colors.textMuted,
    fontSize: 12
  }
});
