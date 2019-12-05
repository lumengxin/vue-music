import { commonParams, options } from './config'
// import axios from 'axios'
import jsonp from 'assets/js/jsonp'
import { getUid } from 'assets/js/uid'

// const debug = process.env.NODE_ENV !== 'production'

export function getVKey (songmid, filename) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, commonParams, {
    cid: 205361747,
    format: 'json',
    platfrom: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
  })

  return jsonp(url, data, Object.assign({}, options, {
    param: 'callback'
  }))
}
