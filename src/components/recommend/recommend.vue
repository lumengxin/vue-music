<template>
  <div class="recommend">
    <div class="recommend-content">
      <!-- v-if: 确保slider中数据加载了，再执行slider组件mounted中dom操作 -->
      <div v-if="recommends.length" class="slider-wrapper">
        <Slider>
          <div v-for="(item, index) in recommends" :key=index>
            <a href="javascript:;">
              <img :src="item.picUrl" />
            </a>
          </div>
        </Slider>
      </div>
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'

export default {
  name: 'Recommend',
  components: {
    Slider
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
</style>
