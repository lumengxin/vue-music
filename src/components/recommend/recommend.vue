<template>
  <div class="recommend">
    <div class="recommend-content">

    </div>
  </div>
</template>

<script>
import { getRecommend } from 'api/recommend'
import { ERR_OK } from 'api/config'

export default {
  name: 'Recommend',
  data () {
    return {
    }
  },
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.slider)
          // this.recommends = res.data.slider
          // console.log(this.recommends)
        }
      })
    }
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
