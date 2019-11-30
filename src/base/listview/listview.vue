<template>
  <scroll class="listview" ref="listview">
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
          >
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import { getData } from 'assets/js/dom'

// 每个字母高度
const ANCHOR_HEIGHT = 18

export default {
  name: 'ListView',
  components: {
    Scroll
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
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
    _scrollTo (index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  // touch不放到data中：不检测数据变化，只是关联到两个方法中
  created () {
    this.touch = {}
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
</style>
