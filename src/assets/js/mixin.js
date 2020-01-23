import { mapGetters } from 'vuex'

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
