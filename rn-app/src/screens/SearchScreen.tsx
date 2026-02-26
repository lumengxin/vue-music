import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { EmptyView } from '@/components/EmptyView';
import { LoadingView } from '@/components/LoadingView';
import { PillButton } from '@/components/PillButton';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionTitle } from '@/components/SectionTitle';
import { SongRow } from '@/components/SongRow';
import { musicApi } from '@/services/music-api';
import { useMusic } from '@/state/music-context';
import { colors } from '@/theme/colors';
import type { SearchSuggestion } from '@/types/music';

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotKeywords, setHotKeywords] = useState<string[]>([]);
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const { state, saveSearch, deleteSearch, clearSearch, selectPlay, insertSong } = useMusic();

  useEffect(() => {
    musicApi.getHotKeywords().then(setHotKeywords).catch(() => {});
  }, []);

  const songResults = useMemo(
    () => results.filter((item): item is Extract<SearchSuggestion, { type: 'song' }> => item.type === 'song'),
    [results]
  );
  const singerResults = useMemo(
    () => results.filter((item): item is Extract<SearchSuggestion, { type: 'singer' }> => item.type === 'singer'),
    [results]
  );

  async function handleSearch(nextQuery = query) {
    const keyword = nextQuery.trim();
    if (!keyword) return;
    setQuery(keyword);
    setLoading(true);
    try {
      const list = await musicApi.searchSuggestions(keyword, { showSinger: true });
      setResults(list);
      await saveSearch(keyword);
    } catch {
      Alert.alert('搜索失败', '请检查网络或代理配置');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionTitle title="搜索" />
        <View style={styles.searchBar}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="搜索歌曲 / 歌手 / 专辑"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch()}
          />
          <Pressable style={styles.searchBtn} onPress={() => handleSearch()}>
            <Text style={styles.searchBtnText}>搜索</Text>
          </Pressable>
        </View>

        <SectionTitle title="热门搜索" />
        <View style={styles.wrap}>
          {hotKeywords.map((item) => (
            <PillButton key={item} label={item} onPress={() => handleSearch(item)} />
          ))}
        </View>

        <View style={styles.sectionSpacing} />
        <SectionTitle
          title="搜索历史"
          action={
            state.searchHistory.length ? (
              <PillButton label="清空" tone="danger" onPress={clearSearch} />
            ) : null
          }
        />
        {!state.searchHistory.length ? (
          <EmptyView text="暂无搜索历史" />
        ) : (
          <View style={styles.wrap}>
            {state.searchHistory.map((item) => (
              <View key={item} style={styles.historyRow}>
                <PillButton label={item} onPress={() => handleSearch(item)} />
                <PillButton label="删除" tone="danger" onPress={() => deleteSearch(item)} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.sectionSpacing} />
        <SectionTitle title="歌手建议" />
        {loading ? (
          <LoadingView text="搜索中..." />
        ) : !singerResults.length ? (
          <EmptyView text="暂无歌手建议" />
        ) : (
          <View style={styles.panel}>
            {singerResults.map((singer) => (
              <Pressable
                key={singer.singerId}
                style={styles.singerRow}
                onPress={() =>
                  navigation.navigate('SongCollection', {
                    kind: 'singer',
                    id: singer.singerId || singer.singerMid,
                    singerMid: singer.singerMid,
                    title: singer.singerName,
                    cover: singer.avatar
                  })
                }
              >
                <Image source={{ uri: singer.avatar }} style={styles.singerAvatar} />
                <Text style={styles.singerName}>{singer.singerName}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.sectionSpacing} />
        <SectionTitle title="歌曲结果" />
        {loading ? (
          <LoadingView text="搜索中..." />
        ) : !songResults.length ? (
          <EmptyView text="输入关键词开始搜索" />
        ) : (
          <View style={styles.panel}>
            {songResults.map((song, index) => (
              <SongRow
                key={`${song.id}-${index}`}
                song={song}
                onPress={() => selectPlay(songResults, index)}
                trailing={<PillButton label="插队" onPress={() => insertSong(song)} />}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 140 },
  searchBar: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(255,255,255,0.04)',
    color: colors.text,
    paddingHorizontal: 14
  },
  searchBtn: {
    paddingHorizontal: 14,
    borderRadius: 14,
    justifyContent: 'center',
    backgroundColor: 'rgba(61,220,151,0.16)'
  },
  searchBtnText: { color: colors.accent, fontWeight: '700' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  sectionSpacing: { height: 18 },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12
  },
  singerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  singerAvatar: { width: 42, height: 42, borderRadius: 999 },
  singerName: { color: colors.text, fontWeight: '600' }
});
