import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Song } from '@/types/music';
import { deleteFromArray, insertArray } from '@/utils/array';

const SEARCH_KEY = '__search__';
const PLAY_KEY = '__play__';
const FAVORITE_KEY = '__favorite__';

const SEARCH_MAX_LENGTH = 15;
const PLAY_MAX_LENGTH = 200;
const FAVORITE_MAX_LENGTH = 200;

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadSearchHistory() {
  return getJSON<string[]>(SEARCH_KEY, []);
}

export async function saveSearchHistory(query: string) {
  const list = await getJSON<string[]>(SEARCH_KEY, []);
  insertArray(list, query, (item) => item === query, SEARCH_MAX_LENGTH);
  await setJSON(SEARCH_KEY, list);
  return list;
}

export async function deleteSearchHistoryItem(query: string) {
  const list = await getJSON<string[]>(SEARCH_KEY, []);
  deleteFromArray(list, (item) => item === query);
  await setJSON(SEARCH_KEY, list);
  return list;
}

export async function clearSearchHistory() {
  await AsyncStorage.removeItem(SEARCH_KEY);
  return [];
}

export async function loadPlayHistory() {
  return getJSON<Song[]>(PLAY_KEY, []);
}

export async function savePlayHistory(song: Song) {
  const list = await getJSON<Song[]>(PLAY_KEY, []);
  insertArray(list, song, (item) => item.id === song.id, PLAY_MAX_LENGTH);
  await setJSON(PLAY_KEY, list);
  return list;
}

export async function loadFavoriteList() {
  return getJSON<Song[]>(FAVORITE_KEY, []);
}

export async function saveFavoriteSong(song: Song) {
  const list = await getJSON<Song[]>(FAVORITE_KEY, []);
  insertArray(list, song, (item) => item.id === song.id, FAVORITE_MAX_LENGTH);
  await setJSON(FAVORITE_KEY, list);
  return list;
}

export async function deleteFavoriteSong(song: Song) {
  const list = await getJSON<Song[]>(FAVORITE_KEY, []);
  deleteFromArray(list, (item) => item.id === song.id);
  await setJSON(FAVORITE_KEY, list);
  return list;
}
