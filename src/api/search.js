import jsonp from 'assets/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotKey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, options)
}

// export function search (query, page, zhida, perpage) {
//   const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

//   const data = Object.assign({}, commonParams, {
//     // 搜索字段
//     w: query,
//     // 实现滚动翻页
//     p: page,
//     perpage,
//     n: perpage,
//     catZhida: zhida ? 1 : 0,
//     zhidaqu: 1,
//     t: 0,
//     flag: 1,
//     ie: 'utf-8',
//     sem: 1,
//     aggr: 0,
//     remoteplace: 'txt.mqq.all',
//     uin: 0,
//     needNewCode: 1,
//     platform: 'h5'
//   })

//   return jsonp(url, data, options)
// }
export function search (query, page, zhida, perpage) {
  const url = '/api/getSearchInfo'

  const data = Object.assign({}, commonParams, {
    // 搜索字段
    w: query,
    // 实现滚动翻页
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
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
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
