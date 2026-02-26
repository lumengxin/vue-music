import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import type { Banner } from '@/types/music';

export function BannerStrip({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {banners.map((banner) => (
        <View key={banner.id} style={styles.card}>
          <Image source={{ uri: banner.image }} style={styles.image} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingBottom: 8
  },
  card: {
    width: 300,
    height: 150,
    marginRight: 12,
    borderRadius: 18,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  }
});
