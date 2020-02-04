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
