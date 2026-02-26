import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function ProgressSeekBar({
  positionMillis,
  durationMillis,
  onSeek
}: {
  positionMillis: number;
  durationMillis: number;
  onSeek: (percent: number) => void;
}) {
  const [trackWidth, setTrackWidth] = useState(0);
  const percent = useMemo(() => {
    if (!durationMillis) return 0;
    return Math.max(0, Math.min(1, positionMillis / durationMillis));
  }, [positionMillis, durationMillis]);

  function onLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  function handlePress(x: number) {
    if (!trackWidth) return;
    onSeek(Math.max(0, Math.min(1, x / trackWidth)));
  }

  return (
    <View>
      <View style={styles.labels}>
        <Text style={styles.label}>{formatTime(positionMillis)}</Text>
        <Text style={styles.label}>{formatTime(durationMillis)}</Text>
      </View>
      <Pressable
        onLayout={onLayout}
        onPress={(e) => handlePress(e.nativeEvent.locationX)}
        style={styles.track}
      >
        <View style={[styles.fill, { width: `${percent * 100}%` }]} />
        <View style={[styles.thumb, { left: `${percent * 100}%` }]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  label: {
    color: colors.textMuted,
    fontSize: 12
  },
  track: {
    position: 'relative',
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center'
  },
  fill: {
    position: 'absolute',
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.accent
  },
  thumb: {
    position: 'absolute',
    marginLeft: -6,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.accent
  }
});
