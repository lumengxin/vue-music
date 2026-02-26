import type {
  Banner,
  LyricLine,
  PlaylistSummary,
  RankSummary,
  SearchSuggestion,
  SingerGroup,
  Song
} from '@/types/music';

function filterSinger(singer: Array<{ name?: string }> | undefined) {
  if (!Array.isArray(singer)) return '';
  return singer.map((item) => item?.name).filter(Boolean).join('/');
}

export function createSongFromQQ(musicData: any): Song | null {
  if (!musicData) return null;
  const songmid = musicData.songmid ?? musicData.mid;
  const songid = musicData.songid ?? musicData.id;
  const songname = musicData.songname ?? musicData.name;
  if (!songmid || !songid || !songname) return null;

  const albummid = musicData.albummid ?? musicData.album?.mid ?? '';
  return {
    id: songid,
    mid: String(songmid),
    singer: filterSinger(musicData.singer),
    name: songname,
    album: musicData.albumname ?? musicData.album?.name ?? '',
    duration: Number(musicData.interval ?? musicData.duration ?? 0),
    fileName: `C400${songmid}.m4a`,
    image: albummid
      ? `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`
      : 'https://picsum.photos/seed/fallback-song/300/300'
  };
}

export function parseRecommendBanners(payload: any): Banner[] {
  const list = payload?.data?.slider ?? payload?.slider ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((item: any, index: number) => ({
    id: String(item?.id ?? item?.linkUrl ?? index),
    image: item?.picUrl ?? item?.picurl ?? item?.image ?? 'https://picsum.photos/seed/banner-fallback/800/400',
    link: item?.linkUrl ?? item?.url ?? undefined
  }));
}

export function parseRecommendPlaylists(payload: any): PlaylistSummary[] {
  const list = payload?.data?.list ?? payload?.list ?? [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any) => ({
      id: String(item?.dissid ?? item?.disstid ?? item?.id ?? ''),
      title: item?.dissname ?? item?.title ?? '未命名歌单',
      cover: item?.imgurl ?? item?.cover ?? 'https://picsum.photos/seed/playlist-fallback/500/500',
      subtitle: item?.creator?.name ?? item?.creator?.nick ?? undefined
    }))
    .filter((item: PlaylistSummary) => item.id);
}

export function parseRecommendSongs(payload: any): Song[] {
  const songs = payload?.cdlist?.[0]?.songlist ?? payload?.songlist ?? [];
  if (!Array.isArray(songs)) return [];
  return songs.map(createSongFromQQ).filter(Boolean) as Song[];
}

export function parseRankList(payload: any): RankSummary[] {
  const list = payload?.data?.topList ?? payload?.topList ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((item: any) => ({
    id: String(item?.id ?? item?.topId ?? item?.topid ?? ''),
    topId: String(item?.id ?? item?.topId ?? item?.topid ?? ''),
    title: item?.topTitle ?? item?.title ?? '未命名榜单',
    cover:
      item?.picUrl ??
      item?.cover ??
      item?.headPicUrl ??
      'https://picsum.photos/seed/rank-fallback/500/500',
    updateTime: item?.period ?? item?.listenCount ? `${item?.period ?? ''}` : undefined
  }));
}

export function parseRankSongs(payload: any): Song[] {
  const list = payload?.songlist ?? payload?.data?.songlist ?? [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any) => createSongFromQQ(item?.data ?? item))
    .filter(Boolean) as Song[];
}

export function parseSearchSongs(payload: any): Song[] {
  const list = payload?.data?.song?.list ?? payload?.data?.list ?? payload?.song?.list ?? [];
  if (!Array.isArray(list)) return [];
  return list.map(createSongFromQQ).filter(Boolean) as Song[];
}

export function parseSingerGroups(payload: any): SingerGroup[] {
  const source = payload?.data?.list ?? payload?.list ?? [];
  if (!Array.isArray(source)) return [];
  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;
  const map: Record<string, SingerGroup> = {
    hot: { title: HOT_NAME, items: [] }
  };

  source.forEach((item: any, index: number) => {
    const singerId = item?.Fsinger_mid ?? item?.singer_mid;
    const singerName = item?.Fsinger_name ?? item?.singer_name;
    const key = item?.Findex ?? item?.findex;
    if (!singerId || !singerName) return;
    const singer = {
      id: String(singerId),
      name: String(singerName),
      avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singerId}.jpg?max_age=2592000`
    };
    if (index < HOT_SINGER_LEN) map.hot.items.push(singer);
    if (!map[key]) map[key] = { title: String(key ?? '#'), items: [] };
    map[key].items.push(singer);
  });

  const hot: SingerGroup[] = [];
  const ret: SingerGroup[] = [];
  Object.keys(map).forEach((key) => {
    const val = map[key];
    if (!val?.title) return;
    if (val.title === HOT_NAME) hot.push(val);
    else if (/^[a-zA-Z]$/.test(val.title)) ret.push(val);
  });
  ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));
  return hot.concat(ret);
}

export function parseSingerSongs(payload: any): Song[] {
  const list = payload?.data?.list ?? payload?.list ?? [];
  if (!Array.isArray(list)) return [];
  return list
    .map((item: any) => createSongFromQQ(item?.musicData ?? item?.data ?? item))
    .filter(Boolean) as Song[];
}

export function parseSearchSuggestions(payload: any, showSinger = true): SearchSuggestion[] {
  const data = payload?.data ?? payload;
  const ret: SearchSuggestion[] = [];
  const zhida = data?.zhida;
  if (showSinger && zhida?.singerid) {
    const singerMid = String(zhida?.singermid ?? zhida?.singerMID ?? '');
    ret.push({
      type: 'singer',
      singerId: String(zhida.singerid),
      singerMid,
      singerName: String(zhida.singername ?? ''),
      avatar: singerMid
        ? `https://y.gtimg.cn/music/photo_new/T001R300x300M000${singerMid}.jpg?max_age=2592000`
        : 'https://picsum.photos/seed/singer-fallback/300/300'
    });
  }
  const songs = parseSearchSongs(payload);
  songs.forEach((song) => ret.push({ type: 'song', ...song }));
  return ret;
}

export function parseLyricLines(lrcText: string): LyricLine[] {
  if (!lrcText) return [];
  return lrcText
    .split(/\r?\n/)
    .map((line) => {
      const match = line.match(/\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\](.*)/);
      if (!match) return null;
      const min = Number(match[1]);
      const sec = Number(match[2]);
      const ms = Number((match[3] ?? '0').padEnd(3, '0'));
      const text = (match[4] ?? '').trim();
      return {
        time: min * 60 * 1000 + sec * 1000 + ms,
        text
      } as LyricLine;
    })
    .filter((item): item is LyricLine => !!item)
    .sort((a, b) => a.time - b.time);
}
