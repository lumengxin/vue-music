<template>
  <div class="loading">
    加载
    <img src="./loading.gif" alt="load" width="24" height="24" />
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    title: {
      type: String,
      default: '玩命加载中..'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~assets/stylus/variable'

  .loading
    width 100%
    text-align center
    .desc
      line-height 20px
      font-size $font-size-small
      color $color-text-l
</style>
