import { mapGetters, mapMutations } from 'vuex'
import { playMode } from 'assets/js/config'
import { shuffle } from 'assets/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  watch: {
    playlist (newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList () {
      throw new Error('component must implement handlePlayList method')
    }
  },
  mounted () {
    this.handlePlayList(this.playlist)
  },
  activated () {
    this.handlePlayList(this.playlist)
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playlist',
      'mode'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }

      this.resetCurrentIndex(list)

      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  }
}
