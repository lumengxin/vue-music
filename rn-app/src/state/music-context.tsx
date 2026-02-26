import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';
import { Audio } from 'expo-av';
import type { AVPlaybackStatus } from 'expo-av';

import { musicApi } from '@/services/music-api';
import {
  clearSearchHistory as clearSearchHistoryCache,
  deleteFavoriteSong,
  deleteSearchHistoryItem,
  loadFavoriteList,
  loadPlayHistory,
  loadSearchHistory,
  saveFavoriteSong,
  savePlayHistory,
  saveSearchHistory
} from '@/storage/cache';
import type { LyricLine, MusicState, Song } from '@/types/music';
import { PlayMode } from '@/types/music';
import { shuffle } from '@/utils/array';

type MusicContextValue = {
  state: MusicState;
  currentSong: Song | null;
  positionMillis: number;
  durationMillis: number;
  buffering: boolean;
  loadingTrack: boolean;
  queueVisible: boolean;
  addSongVisible: boolean;
  setQueueVisible: (visible: boolean) => void;
  setAddSongVisible: (visible: boolean) => void;
  setFullScreen: (visible: boolean) => void;
  setPlayingState: (playing: boolean) => void;
  togglePlay: () => void;
  cyclePlayMode: () => void;
  seekToPercent: (percent: number) => Promise<void>;
  seekToMillis: (millis: number) => Promise<void>;
  selectPlay: (list: Song[], index: number) => Promise<void>;
  randomPlay: (list: Song[]) => Promise<void>;
  insertSong: (song: Song) => Promise<void>;
  deleteSong: (song: Song) => void;
  clearPlaylist: () => void;
  nextSong: () => Promise<void>;
  prevSong: () => Promise<void>;
  selectQueueSong: (song: Song) => void;
  saveSearch: (query: string) => Promise<void>;
  deleteSearch: (query: string) => Promise<void>;
  clearSearch: () => Promise<void>;
  toggleFavorite: (song: Song) => Promise<void>;
  isFavorite: (song: Song | null | undefined) => boolean;
};

type Action =
  | { type: 'hydrate'; payload: Partial<MusicState> }
  | { type: 'set_full_screen'; payload: boolean }
  | { type: 'set_playing'; payload: boolean }
  | { type: 'set_play_mode'; payload: PlayMode }
  | { type: 'set_current_index'; payload: number }
  | { type: 'set_playlist'; payload: Song[] }
  | { type: 'set_sequence_list'; payload: Song[] }
  | { type: 'set_search_history'; payload: string[] }
  | { type: 'set_play_history'; payload: Song[] }
  | { type: 'set_favorite_list'; payload: Song[] }
  | { type: 'set_lyric'; payload: { lines: LyricLine[]; text: string; index: number } }
  | { type: 'set_lyric_cursor'; payload: { text: string; index: number } };

const initialState: MusicState = {
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: PlayMode.Sequence,
  currentIndex: -1,
  searchHistory: [],
  playHistory: [],
  favoriteList: [],
  currentLyric: [],
  currentLyricText: '',
  currentLyricIndex: 0
};

function reducer(state: MusicState, action: Action): MusicState {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.payload };
    case 'set_full_screen':
      return { ...state, fullScreen: action.payload };
    case 'set_playing':
      return { ...state, playing: action.payload };
    case 'set_play_mode':
      return { ...state, mode: action.payload };
    case 'set_current_index':
      return { ...state, currentIndex: action.payload };
    case 'set_playlist':
      return { ...state, playlist: action.payload };
    case 'set_sequence_list':
      return { ...state, sequenceList: action.payload };
    case 'set_search_history':
      return { ...state, searchHistory: action.payload };
    case 'set_play_history':
      return { ...state, playHistory: action.payload };
    case 'set_favorite_list':
      return { ...state, favoriteList: action.payload };
    case 'set_lyric':
      return {
        ...state,
        currentLyric: action.payload.lines,
        currentLyricText: action.payload.text,
        currentLyricIndex: action.payload.index
      };
    case 'set_lyric_cursor':
      return {
        ...state,
        currentLyricText: action.payload.text,
        currentLyricIndex: action.payload.index
      };
    default:
      return state;
  }
}

function findIndex(list: Song[], song: Song) {
  return list.findIndex((item) => item.id === song.id);
}

function findLyricIndex(lines: LyricLine[], positionMillis: number) {
  if (!lines.length) return 0;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (positionMillis >= lines[i].time) return i;
  }
  return 0;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);
  const [buffering, setBuffering] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [queueVisible, setQueueVisible] = useState(false);
  const [addSongVisible, setAddSongVisible] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);
  const trackTokenRef = useRef(0);
  const stateRef = useRef(state);

  stateRef.current = state;

  useEffect(() => {
    let active = true;
    Promise.all([loadSearchHistory(), loadPlayHistory(), loadFavoriteList()]).then(
      ([searchHistory, playHistory, favoriteList]) => {
        if (!active) return;
        dispatch({
          type: 'hydrate',
          payload: { searchHistory, playHistory, favoriteList }
        });
      }
    );
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true
    }).catch(() => {});
    return () => {
      const sound = soundRef.current;
      soundRef.current = null;
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  const currentSong = state.playlist[state.currentIndex] ?? null;

  async function touchPlayHistory(song: Song) {
    const list = await savePlayHistory(song);
    dispatch({ type: 'set_play_history', payload: list });
  }

  async function unloadCurrentSound() {
    const sound = soundRef.current;
    if (!sound) return;
    soundRef.current = null;
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
  }

  async function playResolvedSound(sourceUri: string, autoPlay: boolean) {
    await unloadCurrentSound();
    const sound = new Audio.Sound();
    soundRef.current = sound;
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if ('error' in status && status.error) {
          setLoadingTrack(false);
          setBuffering(false);
        }
        return;
      }

      setLoadingTrack(false);
      setBuffering(Boolean(status.isBuffering));
      setPositionMillis(status.positionMillis ?? 0);
      setDurationMillis(status.durationMillis ?? 0);

      const lines = stateRef.current.currentLyric;
      if (lines.length) {
        const nextLyricIndex = findLyricIndex(lines, status.positionMillis ?? 0);
        if (nextLyricIndex !== stateRef.current.currentLyricIndex) {
          dispatch({
            type: 'set_lyric_cursor',
            payload: {
              index: nextLyricIndex,
              text: lines[nextLyricIndex]?.text ?? ''
            }
          });
        }
      }

      if (status.didJustFinish) {
        if (stateRef.current.mode === PlayMode.Loop) {
          sound.setPositionAsync(0).then(() => sound.playAsync()).catch(() => {});
        } else {
          void handleNext();
        }
      }
    });

    await sound.loadAsync(
      { uri: sourceUri },
      { shouldPlay: autoPlay, progressUpdateIntervalMillis: 500 },
      true
    );
  }

  async function seekSoundToMillis(millis: number) {
    const sound = soundRef.current;
    if (!sound) return;
    const target = Math.max(0, millis);
    await sound.setPositionAsync(target);
    setPositionMillis(target);
  }

  useEffect(() => {
    const song = currentSong;
    const token = ++trackTokenRef.current;

    if (!song) {
      setPositionMillis(0);
      setDurationMillis(0);
      setLoadingTrack(false);
      dispatch({
        type: 'set_lyric',
        payload: { lines: [], text: '', index: 0 }
      });
      void unloadCurrentSound();
      return;
    }

    setLoadingTrack(true);
    setPositionMillis(0);
    setDurationMillis((song.duration || 0) * 1000);
    dispatch({
      type: 'set_lyric',
      payload: { lines: [], text: '', index: 0 }
    });

    musicApi
      .getSongLyric(song.mid)
      .then(({ lines }) => {
        if (trackTokenRef.current !== token) return;
        dispatch({
          type: 'set_lyric',
          payload: { lines, text: lines[0]?.text ?? '', index: 0 }
        });
      })
      .catch(() => {});

    musicApi
      .getSongPlayableUrl(song)
      .then(async (url) => {
        if (trackTokenRef.current !== token) return;
        if (!url) {
          setLoadingTrack(false);
          dispatch({ type: 'set_playing', payload: false });
          return;
        }
        const nextSong = { ...song, url };
        const nextPlaylist = stateRef.current.playlist.slice();
        nextPlaylist[stateRef.current.currentIndex] = nextSong;
        dispatch({ type: 'set_playlist', payload: nextPlaylist });
        await playResolvedSound(url, stateRef.current.playing);
        await touchPlayHistory(nextSong);
      })
      .catch(() => {
        if (trackTokenRef.current !== token) return;
        setLoadingTrack(false);
      });
  }, [currentSong?.id]);

  useEffect(() => {
    const sound = soundRef.current;
    if (!sound) return;
    if (state.playing) {
      sound.playAsync().catch(() => {});
    } else {
      sound.pauseAsync().catch(() => {});
    }
  }, [state.playing]);

  async function handleNext() {
    if (!stateRef.current.playlist.length) return;
    if (stateRef.current.playlist.length === 1) {
          await seekSoundToMillis(0);
      dispatch({ type: 'set_playing', payload: true });
      return;
    }
    let nextIndex = stateRef.current.currentIndex + 1;
    if (nextIndex >= stateRef.current.playlist.length) nextIndex = 0;
    dispatch({ type: 'set_current_index', payload: nextIndex });
    dispatch({ type: 'set_playing', payload: true });
  }

  async function handlePrev() {
    if (!stateRef.current.playlist.length) return;
    if (stateRef.current.playlist.length === 1) {
      await seekSoundToMillis(0);
      dispatch({ type: 'set_playing', payload: true });
      return;
    }
    let nextIndex = stateRef.current.currentIndex - 1;
    if (nextIndex < 0) nextIndex = stateRef.current.playlist.length - 1;
    dispatch({ type: 'set_current_index', payload: nextIndex });
    dispatch({ type: 'set_playing', payload: true });
  }

  const value: MusicContextValue = useMemo(
    () => ({
      state,
      currentSong,
      positionMillis,
      durationMillis,
      buffering,
      loadingTrack,
      queueVisible,
      addSongVisible,
      setQueueVisible,
      setAddSongVisible,
      setFullScreen(visible) {
        dispatch({ type: 'set_full_screen', payload: visible });
      },
      setPlayingState(playing) {
        dispatch({ type: 'set_playing', payload: playing });
      },
      togglePlay() {
        if (!state.playlist.length) return;
        dispatch({ type: 'set_playing', payload: !state.playing });
      },
      cyclePlayMode() {
        const nextMode = ((state.mode + 1) % 3) as PlayMode;
        let nextPlaylist = state.playlist;
        let nextIndex = state.currentIndex;
        if (nextMode === PlayMode.Random) {
          nextPlaylist = shuffle(state.sequenceList);
          if (currentSong) nextIndex = findIndex(nextPlaylist, currentSong);
        } else {
          nextPlaylist = state.sequenceList.slice();
          if (currentSong) nextIndex = findIndex(nextPlaylist, currentSong);
        }
        dispatch({ type: 'set_play_mode', payload: nextMode });
        dispatch({ type: 'set_playlist', payload: nextPlaylist });
        dispatch({ type: 'set_current_index', payload: nextIndex });
      },
      async seekToPercent(percent) {
        const sound = soundRef.current;
        if (!sound) return;
        const target = Math.max(0, Math.min(1, percent)) * (durationMillis || (currentSong?.duration ?? 0) * 1000);
        await sound.setPositionAsync(target);
        setPositionMillis(target);
      },
      async seekToMillis(millis) {
        await seekSoundToMillis(millis);
      },
      async selectPlay(list, index) {
        dispatch({ type: 'set_sequence_list', payload: list });
        let playlist = list;
        let nextIndex = index;
        if (state.mode === PlayMode.Random) {
          playlist = shuffle(list);
          nextIndex = findIndex(playlist, list[index]);
        }
        dispatch({ type: 'set_playlist', payload: playlist });
        dispatch({ type: 'set_current_index', payload: nextIndex });
        dispatch({ type: 'set_playing', payload: true });
        dispatch({ type: 'set_full_screen', payload: true });
      },
      async randomPlay(list) {
        const playlist = shuffle(list);
        dispatch({ type: 'set_play_mode', payload: PlayMode.Random });
        dispatch({ type: 'set_sequence_list', payload: list });
        dispatch({ type: 'set_playlist', payload: playlist });
        dispatch({ type: 'set_current_index', payload: 0 });
        dispatch({ type: 'set_playing', payload: true });
        dispatch({ type: 'set_full_screen', payload: true });
      },
      async insertSong(song) {
        const playlist = state.playlist.slice();
        const sequenceList = state.sequenceList.slice();
        let currentIndex = state.currentIndex;
        const current = playlist[currentIndex];
        const fpIndex = findIndex(playlist, song);

        currentIndex += 1;
        playlist.splice(currentIndex, 0, song);
        if (fpIndex > -1) {
          if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex -= 1;
          } else {
            playlist.splice(fpIndex + 1, 1);
          }
        }

        const currentSIndex = current ? findIndex(sequenceList, current) + 1 : sequenceList.length;
        const fsIndex = findIndex(sequenceList, song);
        sequenceList.splice(currentSIndex, 0, song);
        if (fsIndex > -1) {
          if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1);
          } else {
            sequenceList.splice(fsIndex + 1, 1);
          }
        }

        dispatch({ type: 'set_playlist', payload: playlist });
        dispatch({ type: 'set_sequence_list', payload: sequenceList });
        dispatch({ type: 'set_current_index', payload: currentIndex });
        dispatch({ type: 'set_full_screen', payload: true });
        dispatch({ type: 'set_playing', payload: true });
      },
      deleteSong(song) {
        const playlist = state.playlist.slice();
        const sequenceList = state.sequenceList.slice();
        let currentIndex = state.currentIndex;
        const pIndex = findIndex(playlist, song);
        if (pIndex === -1) return;
        playlist.splice(pIndex, 1);
        const sIndex = findIndex(sequenceList, song);
        if (sIndex > -1) sequenceList.splice(sIndex, 1);
        if (currentIndex > pIndex || currentIndex === playlist.length) currentIndex -= 1;

        dispatch({ type: 'set_playlist', payload: playlist });
        dispatch({ type: 'set_sequence_list', payload: sequenceList });
        dispatch({ type: 'set_current_index', payload: currentIndex });
        dispatch({ type: 'set_playing', payload: playlist.length > 0 });
        if (!playlist.length) {
          setQueueVisible(false);
          setAddSongVisible(false);
        }
      },
      clearPlaylist() {
        dispatch({ type: 'set_playlist', payload: [] });
        dispatch({ type: 'set_sequence_list', payload: [] });
        dispatch({ type: 'set_current_index', payload: -1 });
        dispatch({ type: 'set_playing', payload: false });
        dispatch({ type: 'set_full_screen', payload: false });
        dispatch({ type: 'set_lyric', payload: { lines: [], text: '', index: 0 } });
        setPositionMillis(0);
        setDurationMillis(0);
        setQueueVisible(false);
        setAddSongVisible(false);
      },
      async nextSong() {
        await handleNext();
      },
      async prevSong() {
        await handlePrev();
      },
      selectQueueSong(song) {
        const list = state.sequenceList;
        const idxInSequence = findIndex(list, song);
        if (idxInSequence < 0) return;
        if (state.mode === PlayMode.Random) {
          const idxInPlaylist = findIndex(state.playlist, song);
          if (idxInPlaylist < 0) return;
          dispatch({ type: 'set_current_index', payload: idxInPlaylist });
        } else {
          dispatch({ type: 'set_current_index', payload: idxInSequence });
        }
        dispatch({ type: 'set_playing', payload: true });
      },
      async saveSearch(query) {
        const trimmed = query.trim();
        if (!trimmed) return;
        const list = await saveSearchHistory(trimmed);
        dispatch({ type: 'set_search_history', payload: list });
      },
      async deleteSearch(query) {
        const list = await deleteSearchHistoryItem(query);
        dispatch({ type: 'set_search_history', payload: list });
      },
      async clearSearch() {
        const list = await clearSearchHistoryCache();
        dispatch({ type: 'set_search_history', payload: list });
      },
      async toggleFavorite(song) {
        if (!song) return;
        const exists = state.favoriteList.some((item) => item.id === song.id);
        const list = exists ? await deleteFavoriteSong(song) : await saveFavoriteSong(song);
        dispatch({ type: 'set_favorite_list', payload: list });
      },
      isFavorite(song) {
        if (!song) return false;
        return state.favoriteList.some((item) => item.id === song.id);
      }
    }),
    [
      state,
      currentSong,
      positionMillis,
      durationMillis,
      buffering,
      loadingTrack,
      queueVisible,
      addSongVisible
    ]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
