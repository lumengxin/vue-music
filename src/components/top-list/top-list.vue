<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getRankSongList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'assets/js/song'

export default {
  components: {
    MusicList
  },
  computed: {
    title () {
      return this.toplist.topTitle
    },
    bgImage () {
      // return this.toplist.picUrl
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'toplist'
    ])
  },
  data () {
    return {
      songs: [],
      rank: true
    }
  },
  methods: {
    _getRankSongList () {
      if (!this.toplist.id) {
        this.$router.push('/rank')
        return
      }
      getRankSongList(this.toplist.id).then((res) => {
        if (res.code === ERR_OK) {
          console.log(res)
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach(item => {
        const musicData = item.data
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created () {
    this._getRankSongList()
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease

  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
