<template>
  <transition name="slide">
    <div class="vr-model">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="vr-container">
        <vr-play></vr-play>
      </div>
    </div>
  </transition>
</template>

<script>
import VrPlay from 'base/vr-play/vr-play'

export default {
  components: {
    VrPlay
  },
  data () {
    return {
      // src: 'http://dl.stream.qqmusic.qq.com/C400002XnIJm4DbR6g.m4a?vkey=4CB37D2827FD85579F5E98364F7A4C7D3F8F485EEFCAAAD949C3EF6BB2755252EAC19F861F56E16C0E325205C49B47F75918F494A73CC87F&guid=4987297440&uin=0&fromtag=66'
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~assets/stylus/variable"

  .vr-model
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .vr-container
      position fixed
      top 0
      bottom 0
      width 100%
      // border 1px solid red
</style>
