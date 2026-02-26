import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { EmptyView } from '@/components/EmptyView';
import { LoadingView } from '@/components/LoadingView';
import { ScreenShell } from '@/components/ScreenShell';
import { SectionTitle } from '@/components/SectionTitle';
import { musicApi } from '@/services/music-api';
import { colors } from '@/theme/colors';
import type { SingerGroup } from '@/types/music';

export function SingerScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<SingerGroup[]>([]);

  useEffect(() => {
    let mounted = true;
    musicApi
      .getSingerGroups()
      .then((list) => mounted && setGroups(list))
      .catch(() => Alert.alert('加载失败', '歌手列表加载失败'))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionTitle title="歌手" />
        {loading ? (
          <LoadingView />
        ) : !groups.length ? (
          <EmptyView text="暂无歌手数据" />
        ) : (
          groups.map((group) => (
            <View key={group.title} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.list}>
                {group.items.map((singer) => (
                  <Pressable
                    key={singer.id}
                    style={styles.row}
                    onPress={() =>
                      navigation.navigate('SongCollection', {
                        kind: 'singer',
                        id: singer.id,
                        singerMid: singer.id,
                        title: singer.name,
                        cover: singer.avatar
                      })
                    }
                  >
                    <Image source={{ uri: singer.avatar }} style={styles.avatar} />
                    <Text style={styles.name}>{singer.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 140 },
  group: {
    marginBottom: 16
  },
  groupTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8
  },
  list: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 999,
    marginRight: 10
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600'
  }
});
