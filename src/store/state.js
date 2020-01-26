import { playMode } from 'assets/js/config'
import { loadSearch } from 'assets/js/cache'

const state = {
  singer: {},
  /* 播放器公共数据 */
  // 播放状态
  playing: false,
  // 是否全屏
  fullScreen: false,
  // 播放列表
  playlist: [],
  // 顺序列表
  sequenceList: [],
  // 播放模式
  mode: playMode.sequence,
  // 当前播放索引
  currentIndex: -1,
  /* END 播放器公共数据 */
  // 推荐页歌单详情列表数据
  disc: {},
  // 排行页歌单详情列表数据
  toplist: {},
  // 搜索历史
  // searchHistory: []
  searchHistory: loadSearch()
}

export default state
