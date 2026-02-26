import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { BannerStrip } from '@/components/BannerStrip';
import { EmptyView } from '@/components/EmptyView';
import { LoadingView } from '@/components/LoadingView';
import { PlaylistCard } from '@/components/PlaylistCard';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionTitle } from '@/components/SectionTitle';
import { musicApi } from '@/services/music-api';
import { colors } from '@/theme/colors';
import type { Banner, PlaylistSummary } from '@/types/music';

export function RecommendScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([musicApi.getRecommendBanners(), musicApi.getRecommendPlaylists()])
      .then(([nextBanners, nextPlaylists]) => {
        if (!mounted) return;
        setBanners(nextBanners);
        setPlaylists(nextPlaylists);
      })
      .catch(() => Alert.alert('加载失败', '推荐内容加载失败'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  function openPlaylist(item: PlaylistSummary) {
    navigation.navigate('SongCollection', {
      kind: 'recommend',
      id: item.id,
      title: item.title,
      cover: item.cover
    });
  }

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>推荐</Text>
          <Text style={styles.heroTitle}>热门歌单与轮播</Text>
          <Text style={styles.heroDesc}>已迁移 Vue 推荐页（轮播图 + 歌单详情页跳转）。</Text>
        </View>

        <SectionTitle title="轮播推荐" />
        {loading ? <LoadingView /> : <BannerStrip banners={banners} />}

        <View style={styles.sectionSpacing} />
        <SectionTitle title="热门歌单推荐" />
        {loading ? (
          <LoadingView />
        ) : !playlists.length ? (
          <EmptyView text="暂无推荐歌单" />
        ) : (
          <FlatList
            horizontal
            data={playlists}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <PlaylistCard
                cover={item.cover}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => openPlaylist(item)}
              />
            )}
          />
        )}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 140 },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 16,
    marginBottom: 18
  },
  heroEyebrow: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 8
  },
  heroTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800'
  },
  heroDesc: {
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: 8,
    fontSize: 13
  },
  sectionSpacing: { height: 18 }
});
