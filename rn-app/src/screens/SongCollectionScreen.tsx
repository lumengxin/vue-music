import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import { EmptyView } from '@/components/EmptyView';
import { LoadingView } from '@/components/LoadingView';
import { PillButton } from '@/components/PillButton';
import { SongRow } from '@/components/SongRow';
import { musicApi } from '@/services/music-api';
import { useMusic } from '@/state/music-context';
import { colors } from '@/theme/colors';
import type { Song } from '@/types/music';

type Params = {
  SongCollection: {
    kind: 'recommend' | 'rank' | 'singer';
    id: string;
    title: string;
    cover: string;
    singerMid?: string;
  };
};

export function SongCollectionScreen() {
  const route = useRoute<RouteProp<Params, 'SongCollection'>>();
  const { kind, id, title, cover, singerMid } = route.params;
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const { selectPlay, randomPlay, insertSong } = useMusic();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        let list: Song[] = [];
        if (kind === 'recommend') list = await musicApi.getRecommendSongs(id);
        if (kind === 'rank') list = await musicApi.getRankSongs(id);
        if (kind === 'singer') list = await musicApi.getSingerSongs({ id, singerMid: singerMid ?? id });
        if (mounted) setSongs(list);
      } catch {
        Alert.alert('加载失败', '曲目列表加载失败');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, [kind, id, singerMid]);

  return (
    <ScrollView style={styles.wrap} contentContainerStyle={styles.content}>
      <ImageBackground source={{ uri: cover }} style={styles.hero} imageStyle={styles.heroImg}>
        <View style={styles.mask} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.heroSub}>{kind === 'singer' ? '歌手详情' : '歌单详情'}</Text>
          <View style={styles.actions}>
            <PillButton label="随机播放" tone="accent" onPress={() => songs.length && randomPlay(songs)} />
            <PillButton label="顺序播放" onPress={() => songs.length && selectPlay(songs, 0)} />
          </View>
        </View>
      </ImageBackground>

      {loading ? (
        <LoadingView text="加载曲目..." />
      ) : !songs.length ? (
        <EmptyView text="暂无曲目" />
      ) : (
        <View style={styles.list}>
          {songs.map((song, index) => (
            <SongRow
              key={`${song.id}-${index}`}
              song={song}
              onPress={() => selectPlay(songs, index)}
              trailing={<PillButton label="插队" onPress={() => insertSong(song)} />}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#071018' },
  content: { paddingBottom: 24 },
  hero: { height: 280, justifyContent: 'flex-end' },
  heroImg: { resizeMode: 'cover' },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7,16,24,0.55)'
  },
  heroContent: { padding: 16 },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  heroSub: { color: '#C8D8E6', marginTop: 6 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  list: {
    margin: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 12
  }
});
