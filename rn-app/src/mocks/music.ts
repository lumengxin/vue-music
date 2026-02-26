import type {
  Banner,
  PlaylistSummary,
  RankSummary,
  SearchSuggestion,
  SingerGroup,
  Song
} from '@/types/music';

const demoAudioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const demoLyric = `[00:00.00]Demo Lyric
[00:03.00]This is a React Native migration demo
[00:08.00]expo-av is connected to the player engine
[00:14.00]Switch proxy mode to use QQ proxy endpoints
[00:20.00]Enjoy coding`;

const demoSongs: Song[] = [
  {
    id: 's1',
    mid: 'demo001',
    singer: 'Nova River',
    name: 'Night Transit',
    album: 'City Signals',
    duration: 213,
    image: 'https://picsum.photos/seed/music-1/300/300',
    url: demoAudioUrl,
    lyric: demoLyric,
    fileName: 'C400demo001.m4a'
  },
  {
    id: 's2',
    mid: 'demo002',
    singer: 'Sunset Unit',
    name: 'Amber Lane',
    album: 'Golden Frames',
    duration: 188,
    image: 'https://picsum.photos/seed/music-2/300/300',
    url: demoAudioUrl,
    lyric: demoLyric,
    fileName: 'C400demo002.m4a'
  },
  {
    id: 's3',
    mid: 'demo003',
    singer: 'Polar Echo',
    name: 'Cold Neon',
    album: 'Midnight Glass',
    duration: 241,
    image: 'https://picsum.photos/seed/music-3/300/300',
    url: demoAudioUrl,
    lyric: demoLyric,
    fileName: 'C400demo003.m4a'
  },
  {
    id: 's4',
    mid: 'demo004',
    singer: 'Mira Park',
    name: 'Paper Moon',
    album: 'Soft Orbit',
    duration: 199,
    image: 'https://picsum.photos/seed/music-4/300/300',
    url: demoAudioUrl,
    lyric: demoLyric,
    fileName: 'C400demo004.m4a'
  }
];

export const mockBanners: Banner[] = [
  {
    id: 'b1',
    image: 'https://picsum.photos/seed/banner-1/900/420'
  },
  {
    id: 'b2',
    image: 'https://picsum.photos/seed/banner-2/900/420'
  },
  {
    id: 'b3',
    image: 'https://picsum.photos/seed/banner-3/900/420'
  }
];

export const mockRecommendPlaylists: PlaylistSummary[] = [
  {
    id: 'p1',
    title: '通勤提神',
    subtitle: '早高峰不困倦',
    cover: 'https://picsum.photos/seed/playlist-1/500/500',
    songs: demoSongs
  },
  {
    id: 'p2',
    title: '夜晚放空',
    subtitle: '适合戴耳机散步',
    cover: 'https://picsum.photos/seed/playlist-2/500/500',
    songs: demoSongs.slice().reverse()
  },
  {
    id: 'p3',
    title: '代码节奏',
    subtitle: '低干扰电子氛围',
    cover: 'https://picsum.photos/seed/playlist-3/500/500',
    songs: demoSongs
  }
];

export const mockRanks: RankSummary[] = [
  {
    id: 'r1',
    title: '热歌榜',
    cover: 'https://picsum.photos/seed/rank-1/500/500',
    updateTime: '每日更新',
    songs: demoSongs
  },
  {
    id: 'r2',
    title: '新歌榜',
    cover: 'https://picsum.photos/seed/rank-2/500/500',
    updateTime: '每周更新',
    songs: demoSongs.slice(0, 3)
  }
];

export const mockHotKeywords = ['周杰伦', '林俊杰', '陈奕迅', 'Taylor Swift', 'Billie Eilish'];

export const mockSingers: SingerGroup[] = [
  {
    title: '热门',
    items: [
      { id: 'jaychou', name: '周杰伦', avatar: 'https://picsum.photos/seed/singer-jay/300/300' },
      { id: 'jjlin', name: '林俊杰', avatar: 'https://picsum.photos/seed/singer-jj/300/300' },
      { id: 'eason', name: '陈奕迅', avatar: 'https://picsum.photos/seed/singer-eason/300/300' }
    ]
  },
  {
    title: 'A',
    items: [{ id: 'adele', name: 'Adele', avatar: 'https://picsum.photos/seed/singer-adele/300/300' }]
  },
  {
    title: 'T',
    items: [
      { id: 'taylorswift', name: 'Taylor Swift', avatar: 'https://picsum.photos/seed/singer-ts/300/300' }
    ]
  }
];

export const mockSingerSongsMap: Record<string, Song[]> = {
  jaychou: demoSongs,
  jjlin: demoSongs.slice().reverse(),
  eason: demoSongs.slice(0, 3),
  adele: demoSongs.slice(1),
  taylorswift: demoSongs
};

export function mockSearch(query: string): Song[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return demoSongs.filter(
    (song) =>
      song.name.toLowerCase().includes(lower) ||
      song.singer.toLowerCase().includes(lower) ||
      song.album.toLowerCase().includes(lower)
  );
}

export function mockSearchSuggestions(query: string): SearchSuggestion[] {
  const songs = mockSearch(query).map((song) => ({ type: 'song' as const, ...song }));
  const singerMatch = mockSingers.flatMap((g) => g.items).find((s) => s.name.includes(query));
  if (singerMatch) {
    return [
      {
        type: 'singer',
        singerId: singerMatch.id,
        singerMid: singerMatch.id,
        singerName: singerMatch.name,
        avatar: singerMatch.avatar
      },
      ...songs
    ];
  }
  return songs;
}
