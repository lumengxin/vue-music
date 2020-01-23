<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>

    <div class="bg-layer" ref="layer"></div>
    <scroll class="list"
      :data="songs"
      ref="list"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItems"></song-list>
      </div>

      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'assets/js/dom'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playlistMixin } from 'assets/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
// const backdrop = prefixStyle('backdrop-filter')

export default {
  mixins: [playlistMixin],
  name: 'MusicList',
  components: {
    Scroll,
    SongList,
    Loading
  },
  /* eslint-disable */
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle () {
      return `background-image: url(${this.bgImage})`
    }
  },
  watch: {
    scrollY (newY) {
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      /* this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      // 浏览器兼容，vue自动实现，js不行
      this.$refs.layer.style['webkittransform'] = `translate3d(0,${translateY}px,0)` */
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`

      // 图片下拉放大，上顶高次模糊(苹果手机)
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      } else {
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`

      if (newY < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`

        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0

        this.$refs.playBtn.style.display = ''
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  methods: {
    // 使用mixin,设置sroll底部高度
    handlePlayList (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    back () {
      // this.$router.push(-1)
      this.$router.back()
    },
    selectItems (item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    random () {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  created () {
    // 实时监听
    this.probeType = 3
    this.listenScroll = true
  },
  mounted () {
    // 计算歌手详情列表，距离顶部高度（不同浏览器不同，不适合固定top值）
    this.imageHeight = this.$refs.bgImage.clientHeight

    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variable'
  @import '~assets/stylus/mixin'

  .music-list
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back
      position absolute
      top $android-padding-top
      left 6px
      z-index 50
      .icon-back
        display block
        padding 10px
        font-size $font-size-large-x
        color $color-theme
    .title
      position absolute
      top $android-padding-top
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-align center
      line-height 40px
      font-size $font-size-large
      color $color-text
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      // 解决歌手详情列表滑动到图片上
      // z-index 1
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          border 1px solid $color-theme
          border-radius 100px
          font-size 0
          color $color-theme
          .icon-play
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .fliter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 17, 0.4)
    .bg-layer
      position relative
      height 100%
      background $color-background
    .list
      position absolute
      top 0
      bottom 0
      width 100%
      // overflow hidden
      background $color-background
      .song-list-wrapper
        padding 20px 30px
</style>
