<template>
  <transition name="slide">
  <div class="singer-detail">
    aaa
  </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'assets/js/song'

export default {
  name: 'SingerDetail',
  data () {
    return {
      song: []
    }
  },
  computed: {
    // 从vuex中store中获取singer数据
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getDetail () {
      // 直接路由进入或者刷新，得不到歌手详情数据。回退出去，点击进入
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.list)
          // 得到目标数据结构
          this.songs = this._normalizeSongs(res.data.list)
          console.log(this.songs)
        }
      })
    },
    // 歌手详情数据处理
    _normalizeSongs (list) {
      let ret = []
      list.forEach((item) => {
        let {musicData} = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    console.log(this.singer)
    this._getDetail()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variable'

  .slide-enter-active, .slide-leave-active
    transition all 0.3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background
</style>
