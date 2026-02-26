import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/PillButton';
import { colors } from '@/theme/colors';

export function VrScreen() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>VR 模型页</Text>
      <Text style={styles.desc}>
        原 Vue 项目使用 A-Frame Web 方案。RN 版本已保留页面入口，建议后续使用 `WebView` 或 `react-three-fiber/native`
        接入 3D/VR 交互。
      </Text>
      <PillButton label="当前版本为占位实现" />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#071018',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10
  },
  desc: {
    color: colors.textMuted,
    lineHeight: 22,
    marginBottom: 14
  }
});
