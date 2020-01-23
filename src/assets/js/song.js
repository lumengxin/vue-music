import { getVKey, getLyric } from 'api/song'
import { getUid } from './uid'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'

let urlMap = {}

// 歌曲数据抽象，封装成一个Song类
export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    // this.url = url
    this.filename = `C400${this.mid}.m4a`
    // 确保一首歌的id 只对应一个url
    if (urlMap[this.id]) {
      this.url = urlMap[this.id]
    } else {
      this._genUrl()
    }
  }

  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          // console.log(this.lyric)
          resolve(this.lyric)
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('no lyric')
        }
      })
    })
  }

  _genUrl () {
    if (this.url) {
      return
    }
    getVKey(this.mid, this.filename).then((res) => {
      if (res.code === ERR_OK) {
        const vkey = res.data.items[0].vkey
        this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`
        urlMap[this.id] = this.url
      }
    })
  }
}

// Song类扩展一个工厂方法
export function createSong (musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    // 歌曲播放地址（会变动,已被屏蔽）
    // url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songid}.m4a?fromtag=0&guid=126548448`
  })
}

function filterSinger (singer) {
  let ret = []
  // 边界处理，singer为空
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
