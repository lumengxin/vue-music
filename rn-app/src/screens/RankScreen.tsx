import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { EmptyView } from '@/components/EmptyView';
import { LoadingView } from '@/components/LoadingView';
import { PlaylistCard } from '@/components/PlaylistCard';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionTitle } from '@/components/SectionTitle';
import { musicApi } from '@/services/music-api';
import type { RankSummary } from '@/types/music';

export function RankScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [ranks, setRanks] = useState<RankSummary[]>([]);

  useEffect(() => {
    let mounted = true;
    musicApi
      .getRankList()
      .then((list) => mounted && setRanks(list))
      .catch(() => Alert.alert('加载失败', '排行榜加载失败'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionTitle title="排行榜" />
        {loading ? (
          <LoadingView />
        ) : !ranks.length ? (
          <EmptyView text="暂无榜单" />
        ) : (
          <View style={styles.grid}>
            {ranks.map((rank) => (
              <PlaylistCard
                key={rank.id}
                cover={rank.cover}
                title={rank.title}
                subtitle={rank.updateTime}
                onPress={() =>
                  navigation.navigate('SongCollection', {
                    kind: 'rank',
                    id: rank.topId ?? rank.id,
                    title: rank.title,
                    cover: rank.cover
                  })
                }
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  }
});
