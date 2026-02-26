import React from 'react';
import { NavigationContainer, DarkTheme, type Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, Text } from 'react-native';

import { MiniPlayer } from '@/components/MiniPlayer';
import { LibraryScreen } from '@/screens/LibraryScreen';
import { PlayerScreen } from '@/screens/PlayerScreen';
import { RankScreen } from '@/screens/RankScreen';
import { RecommendScreen } from '@/screens/RecommendScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { SingerScreen } from '@/screens/SingerScreen';
import { SongCollectionScreen } from '@/screens/SongCollectionScreen';
import { VrScreen } from '@/screens/VrScreen';
import { colors } from '@/theme/colors';

type RootStackParamList = {
  MainTabs: undefined;
  Player: undefined;
  SongCollection: {
    kind: 'recommend' | 'rank' | 'singer';
    id: string;
    title: string;
    cover: string;
    singerMid?: string;
  };
  Vr: undefined;
};

type MainTabsParamList = {
  Recommend: undefined;
  Singer: undefined;
  Rank: undefined;
  Search: undefined;
  Library: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabsParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: '#0B141D',
    primary: colors.accent,
    text: colors.text,
    border: 'rgba(255,255,255,0.08)'
  }
};

function MainTabs({ openPlayer }: { openPlayer: () => void }) {
  return (
    <>
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.bg },
          tabBarStyle: {
            backgroundColor: '#0A121A',
            borderTopColor: 'rgba(255,255,255,0.08)',
            height: 66,
            paddingBottom: 8
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textMuted
        }}
      >
        <Tabs.Screen
          name="Recommend"
          component={RecommendScreen}
          options={{ title: '推荐', tabBarIcon: ({ color }) => <TabGlyph label="荐" color={color} /> }}
        />
        <Tabs.Screen
          name="Singer"
          component={SingerScreen}
          options={{ title: '歌手', tabBarIcon: ({ color }) => <TabGlyph label="歌" color={color} /> }}
        />
        <Tabs.Screen
          name="Rank"
          component={RankScreen}
          options={{ title: '排行', tabBarIcon: ({ color }) => <TabGlyph label="榜" color={color} /> }}
        />
        <Tabs.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: '搜索', tabBarIcon: ({ color }) => <TabGlyph label="搜" color={color} /> }}
        />
        <Tabs.Screen
          name="Library"
          component={LibraryScreen}
          options={{ title: '我的', tabBarIcon: ({ color }) => <TabGlyph label="我" color={color} /> }}
        />
      </Tabs.Navigator>
      <MiniPlayer onOpen={openPlayer} />
    </>
  );
}

function TabGlyph({ label, color }: { label: string; color: string }) {
  return <Text style={{ color, fontSize: 12, fontWeight: '800' }}>{label}</Text>;
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" options={{ headerShown: false }}>
          {({ navigation }) => <MainTabs openPlayer={() => navigation.navigate('Player')} />}
        </Stack.Screen>
        <Stack.Screen
          name="SongCollection"
          component={SongCollectionScreen}
          options={({ route }) => ({
            title: route.params.title || '详情',
            headerStyle: { backgroundColor: '#071018' },
            headerTintColor: colors.text
          })}
        />
        <Stack.Screen
          name="Vr"
          component={VrScreen}
          options={{
            title: 'VR',
            headerStyle: { backgroundColor: '#071018' },
            headerTintColor: colors.text
          }}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={({ navigation }) => ({
            presentation: 'modal',
            title: '播放器',
            headerStyle: { backgroundColor: '#071018' },
            headerTintColor: colors.text,
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()}>
                <Text style={{ color: colors.accent, fontWeight: '700' }}>关闭</Text>
              </Pressable>
            )
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
