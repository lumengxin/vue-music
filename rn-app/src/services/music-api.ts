import { APP_CONFIG } from '@/config/env';
import { Base64 } from 'js-base64';

import {
  mockBanners,
  mockHotKeywords,
  mockRanks,
  mockRecommendPlaylists,
  mockSearch,
  mockSearchSuggestions,
  mockSingerSongsMap,
  mockSingers
} from '@/mocks/music';
import { http } from '@/services/http';
import {
  parseLyricLines,
  parseRankList,
  parseRankSongs,
  parseRecommendBanners,
  parseRecommendPlaylists,
  parseRecommendSongs,
  parseSearchSuggestions,
  parseSearchSongs,
  parseSingerGroups,
  parseSingerSongs
} from '@/services/music-parsers';
import type {
  Banner,
  LyricLine,
  PlaylistSummary,
  RankSummary,
  SearchSuggestion,
  SingerGroup,
  SingerItem,
  Song
} from '@/types/music';

type SearchOptions = {
  page?: number;
  perPage?: number;
  showSinger?: boolean;
};

const commonParams = {
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'json'
};

async function proxyGet<T = any>(path: string, params?: Record<string, unknown>) {
  const normalized = path.replace(/^\//, '');
  const { data } = await http.get<T>(normalized, { params });
  return data;
}

async function getRecommendPlaylistsProxy(): Promise<PlaylistSummary[]> {
  const payload = await proxyGet('/getDiscList', {
    ...commonParams,
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
  });
  return parseRecommendPlaylists(payload);
}

async function getRecommendBannersProxy(): Promise<Banner[]> {
  const payload = await proxyGet('/getRecommend', {
    ...commonParams,
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });
  return parseRecommendBanners(payload);
}

async function getRecommendSongsProxy(disstid: string): Promise<Song[]> {
  const payload = await proxyGet('/getRecSongInfo', {
    ...commonParams,
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });
  return parseRecommendSongs(payload);
}

async function getSingerListProxy(): Promise<SingerGroup[]> {
  const payload = await proxyGet('/getSingerList', {
    ...commonParams,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    g_tk: 1664029744
  });
  return parseSingerGroups(payload);
}

async function getSingerSongsProxy(singerMid: string): Promise<Song[]> {
  const payload = await proxyGet('/getSingerDetail', {
    ...commonParams,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerMid
  });
  return parseSingerSongs(payload);
}

async function getRankListProxy(): Promise<RankSummary[]> {
  const payload = await proxyGet('/getTopList', {
    ...commonParams,
    platform: 'h5',
    needNewCode: 1
  });
  return parseRankList(payload);
}

async function getRankSongsProxy(topid: string): Promise<Song[]> {
  const payload = await proxyGet('/getRankSongList', {
    ...commonParams,
    topid,
    page: 'detail',
    type: 'top',
    tpl: 3,
    platform: 'h5',
    needNewCode: 1
  });
  return parseRankSongs(payload);
}

async function searchSongsProxy(query: string, options?: SearchOptions): Promise<Song[]> {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const payload = await proxyGet('/getSearchInfo', {
    ...commonParams,
    w: query,
    p: page,
    perpage: perPage,
    n: perPage,
    catZhida: 1,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });
  return parseSearchSongs(payload);
}

async function searchSuggestionsProxy(query: string, options?: SearchOptions): Promise<SearchSuggestion[]> {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 20;
  const showSinger = options?.showSinger ?? true;
  const payload = await proxyGet('/getSearchInfo', {
    ...commonParams,
    w: query,
    p: page,
    perpage: perPage,
    n: perPage,
    catZhida: showSinger ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });
  return parseSearchSuggestions(payload, showSinger);
}

let _uid = 0;
function getUid() {
  if (_uid) return _uid;
  const t = new Date().getUTCMilliseconds();
  _uid = (Math.round(2147483647 * Math.random()) * t) % 1e10;
  return _uid;
}

async function getVKeyProxy(song: Song) {
  const filename = song.fileName || `C400${song.mid}.m4a`;
  const payload = await proxyGet('/getVKey', {
    ...commonParams,
    cid: 205361747,
    format: 'json',
    platfrom: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid: song.mid,
    filename,
    guid: getUid(),
    callback: 'callback'
  });
  const vkey = payload?.data?.items?.[0]?.vkey;
  if (!vkey) return undefined;
  return `https://dl.stream.qqmusic.qq.com/${filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`;
}

async function getLyricProxy(songMid: string) {
  const payload = await proxyGet('/lyric', {
    ...commonParams,
    songmid: songMid,
    pcachetime: Date.now(),
    platfrom: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    g_tk: 67232076,
    format: 'json'
  });
  return payload;
}

export const musicApi = {
  async getRecommendBanners(): Promise<Banner[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockBanners;
    try {
      const list = await getRecommendBannersProxy();
      return list.length ? list : mockBanners;
    } catch {
      return mockBanners;
    }
  },

  async getRecommendPlaylists(): Promise<PlaylistSummary[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockRecommendPlaylists;
    try {
      const list = await getRecommendPlaylistsProxy();
      return list.length ? list : mockRecommendPlaylists;
    } catch {
      return mockRecommendPlaylists;
    }
  },

  async getRecommendSongs(disstid: string): Promise<Song[]> {
    if (APP_CONFIG.apiMode === 'mock') {
      return mockRecommendPlaylists.find((item) => item.id === disstid)?.songs ?? [];
    }
    try {
      return await getRecommendSongsProxy(disstid);
    } catch {
      return mockRecommendPlaylists.find((item) => item.id === disstid)?.songs ?? [];
    }
  },

  async getSingerGroups(): Promise<SingerGroup[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockSingers;
    try {
      const list = await getSingerListProxy();
      return list.length ? list : mockSingers;
    } catch {
      return mockSingers;
    }
  },

  async getSingerSongs(singer: Pick<SingerItem, 'id'> | { id: string; singerMid?: string }): Promise<Song[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockSingerSongsMap[singer.id] ?? mockRecommendPlaylists[0]?.songs ?? [];
    try {
      return await getSingerSongsProxy((singer as any).singerMid ?? singer.id);
    } catch {
      return mockSingerSongsMap[singer.id] ?? [];
    }
  },

  async getRankList(): Promise<RankSummary[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockRanks;
    try {
      const list = await getRankListProxy();
      return list.length ? list : mockRanks;
    } catch {
      return mockRanks;
    }
  },

  async getRankSongs(topid: string): Promise<Song[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockRanks.find((item) => item.id === topid)?.songs ?? [];
    try {
      return await getRankSongsProxy(topid);
    } catch {
      return mockRanks.find((item) => item.id === topid)?.songs ?? [];
    }
  },

  async searchSongs(query: string, options?: SearchOptions): Promise<Song[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockSearch(query);
    try {
      return await searchSongsProxy(query, options);
    } catch {
      return mockSearch(query);
    }
  },

  async searchSuggestions(query: string, options?: SearchOptions): Promise<SearchSuggestion[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockSearchSuggestions(query);
    try {
      return await searchSuggestionsProxy(query, options);
    } catch {
      return mockSearchSuggestions(query);
    }
  },

  async getHotKeywords(): Promise<string[]> {
    if (APP_CONFIG.apiMode === 'mock') return mockHotKeywords;
    try {
      const payload = await proxyGet('/getHotKey', {
        ...commonParams,
        uin: 0,
        platform: 'h5',
        needNewCode: 1
      });
      const hotkey = payload?.data?.hotkey ?? [];
      return hotkey.map((item: any) => item?.k).filter(Boolean);
    } catch {
      return mockHotKeywords;
    }
  },

  async getSongPlayableUrl(song: Song): Promise<string | undefined> {
    if (!song) return undefined;
    if (song.url) return song.url;
    if (APP_CONFIG.apiMode === 'mock') return song.url;
    try {
      return await getVKeyProxy(song);
    } catch {
      return song.url;
    }
  },

  async getSongLyric(songMid: string): Promise<{ raw: string; lines: LyricLine[] }> {
    if (APP_CONFIG.apiMode === 'mock') {
      const raw = mockRecommendPlaylists.flatMap((p) => p.songs ?? []).find((s) => s.mid === songMid)?.lyric ?? '';
      return { raw, lines: parseLyricLines(raw) };
    }
    try {
      const payload = await getLyricProxy(songMid);
      const base64Lyric = payload?.lyric ?? '';
      const raw = base64Lyric ? Base64.decode(base64Lyric) : '';
      return { raw, lines: parseLyricLines(raw) };
    } catch {
      return { raw: '', lines: [] };
    }
  }
};
