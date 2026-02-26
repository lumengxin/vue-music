import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './src/navigation/RootNavigator';
import { MusicProvider } from './src/state/music-context';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <MusicProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </MusicProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
