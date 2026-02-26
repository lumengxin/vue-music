export enum PlayMode {
  Sequence = 0,
  Loop = 1,
  Random = 2
}

export type Song = {
  id: string | number;
  mid: string;
  singer: string;
  name: string;
  album: string;
  duration: number;
  image: string;
  url?: string;
  lyric?: string;
  fileName?: string;
};

export type PlaylistSummary = {
  id: string;
  title: string;
  cover: string;
  subtitle?: string;
  songs?: Song[];
};

export type RankSummary = {
  id: string;
  title: string;
  cover: string;
  updateTime?: string;
  topId?: string;
  songs?: Song[];
};

export type Banner = {
  id: string;
  image: string;
  link?: string;
};

export type SingerItem = {
  id: string;
  name: string;
  avatar: string;
};

export type SingerGroup = {
  title: string;
  items: SingerItem[];
};

export type SearchSuggestion =
  | {
      type: 'singer';
      singerId: string;
      singerMid: string;
      singerName: string;
      avatar: string;
    }
  | ({
      type: 'song';
    } & Song);

export type LyricLine = {
  time: number;
  text: string;
};

export type MusicState = {
  playing: boolean;
  fullScreen: boolean;
  playlist: Song[];
  sequenceList: Song[];
  mode: PlayMode;
  currentIndex: number;
  searchHistory: string[];
  playHistory: Song[];
  favoriteList: Song[];
  currentLyric: LyricLine[];
  currentLyricText: string;
  currentLyricIndex: number;
};
