import jsonp from 'assets/js/jsonp'
import { commonParams, options } from './config'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// 排行页歌单列表数据获取
// export function getRankSongList (topid) {
//   const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

//   const data = Object.assign({}, commonParams, {
//     topid,
//     page: 'detail',
//     type: 'top',
//     tpl: 3,
//     platform: 'h5',
//     needNewCode: 1
//   })

//   return jsonp(url, data, options)
// }
