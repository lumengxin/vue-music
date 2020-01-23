<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getRecommendSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'

export default {
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  methods: {
    _getRecommendSongList () {
      getRecommendSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.cdlist[0].songlist)
        }
      })
    }
  },
  created () {
    this._getRecommendSongList()
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
