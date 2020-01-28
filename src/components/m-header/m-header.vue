<template>
  <div class="m-header">
    <div class="icon"></div>
    <div class="text">Style</div>
    <div class="expand">
      <div class="btn search" @click="goSearch">
        <i class="iconfont iconsousuo"></i>
      </div>
      <div class="btn skin">
        <i class="iconfont iconb_ic_zhuti"></i>
      </div>
      <div class="btn vr">
        <i class="iconfont iconVR" @click="goVr"></i>
      </div>
    </div>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MHeader',
  methods: {
    goSearch () {
      this.$router.push('/search')
    },
    goVr () {
      this.$router.push('/vr')
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variable'
  @import '~assets/stylus/mixin'

  .m-header
    position relative
    height 44px
    // text-align center
    color $color-theme
    font-size 0
    .icon
      display inline-block
      vertical-align top
      margin 6px 5px 0px 20px
      width 30px
      height 32px
      bg-image('logo')
      background-size 30px 32px
    .text
      display inline-block
      vertical-align top
      line-height 44px
      font-size $font-size-large
    .expand
      display inline-block
      position fixed
      height 44px
      top 0
      right 54px
      // border 1px solid red
      .btn
        display inline-block
        width 32px
        height 32px
        margin 5px
        margin-top 8px
        // border 1px solid red
        .iconfont
          display block
          font-size 25px
          color #fff
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
