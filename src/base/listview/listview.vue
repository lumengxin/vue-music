<template>
  <scroll class="listview"
    ref="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    >
    <ul>
      <li class="list-group"
        v-for="(group, index) in data"
        :key=index
        ref="listGroup"
        >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) in group.items" :key=index>
            <img class="avatar" v-lazy="item.avatar" alt="img" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"
      @touchstart="onShortCutTouchStart"
      @touchmove.stop.prevent="onShortCutTouchMove">
      <ul>
        <li class="item"
          v-for="(item, index) in shortcutList"
          :key=index
          :data-index="index"
          :class="{'current': currentIndex === index}"
          >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">
        {{fixedTitle}}
      </h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'assets/js/dom'
import Loading from 'base/loading/loading'

// 每个字母高度
const ANCHOR_HEIGHT = 18
// 每个标题栏高度
const TITLE_HEIGHT = 30

export default {
  name: 'ListView',
  components: {
    Scroll,
    Loading
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      // 解决歌手列表头部位置下拉时，有两个‘热门’标题
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      // debugger
      const listHeight = this.listHeight
      // 当滚动到顶部，newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          // console.log(this.currentIndex)

          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
      // this.currentIndex = 0
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      // 固定标题栏和标题栏未接触时,不用操作dom,提高性能
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods: {
    onShortCutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')

      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex

      // this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex], 0)
      this._scrollTo(anchorIndex)
    },
    onShortCutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let dalta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + dalta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    _scrollTo (index) {
      // console.log(index)
      // 点击超出字母表两端位置时，不执行
      if (!index && index !== 0) {
        return
      }
      // 解决滚动超出字母表两端位置时，index异常（*底部依然异常）
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.listHeight - 2) {
        index = this.listHeight.length - 2
      }
      // console.log(index)
      // 0:滚动动画时间
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      // 通过点击切换到相应字母高亮
      this.scrollY = -this.listHeight[index]
   },
    _calculateHeight () {
      // debugger
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  // touch不放到data()中：不检测数据变化，只是关联到两个方法中
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    // 默认1：节流方式；3: 监听实时滚动
    this.probeType = 3
  },
  mounted () {
    // 解决_calculateHeight在wtach不执行，无法获取到listHeight
    this._calculateHeight()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variable'

  .listview
    position relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-backgorund-d
      font-family Helvetica
      .item
        padding 3px
        line-height 1
        color $color-text-l
        font-size $font-size-small
        &.current
          color $color-theme
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color: $color-text-l
        background $color-highlight-background
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
