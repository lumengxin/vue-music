<template>
  <div class="recommend">
    <scroll class="recommend-content" :data="discList" ref="scroll">
      <!-- 轮播 -->
      <!-- v-if: 确保slider中数据加载了，再执行slider组件mounted中dom操作 -->
      <div v-if="recommends.length" class="slider-wrapper">
        <Slider>
          <div v-for="(item, index) in recommends" :key=index>
            <a href="javascript:;">
              <img :src="item.picUrl" @load="loadImage" />
            </a>
          </div>
        </Slider>
      </div>
      <!-- 歌单列表 -->
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
          <li v-for="(item, index) in discList" :key=index class="item">
            <div class="icon">
              <img :src="item.imgurl" alt="img" width="60" height="60" />
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'

export default {
  name: 'Recommend',
  components: {
    Slider,
    Scroll
  },
  data () {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          console.log(this.recommends)
        }
      })
    },
    _getDiscList () {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
          console.log(this.discList)
        }
      })
    },
    loadImage () {
      // 只要有一张图片撑开高度即可。执行一次既可
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    }
  },
  created () {
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variable'

  .recommend
    position fixed
    width 100%
    top 88px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        overflow hidden
      .recommend-list

        .list-title
          height 65px
          line-height 65px
          text-align center
          font-size $font-size-medium
          color $color-theme
        .item
          display flex
          box-sizing border-box
          align-item center
          padding 0 20px 20px 20px
          .icon
            flex 0 0 60px
            width 60px
            padding-right 20px
          .text
            display flex
            flex-direction column
            justify-content center
            flex 1
            line-height 20px
            overflow hidden
            font-size $font-size-medium
            .name
              margin-bottom 10px
              color $color-text
            .desc
              color $color-text-d
</style>
