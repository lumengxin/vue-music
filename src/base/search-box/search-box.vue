<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="box" :placeholder="placeholder"
      v-model="query"
      ref="query"
      />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from 'assets/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲，歌手..'
    }
  },
  data () {
    return {
      query: ''
    }
  },
  methods: {
    clear () {
      this.query = ''
    },
    setQuery (query) {
      this.query = query
    },
    blur () {
      this.$refs.query.blur()
    }
  },
  created () {
    // 将clear()方法映射出去
    // this.$watch('query', (newQuery) => {
    //   this.$emit('query', newQuery)
    // })
    // 搜索节流
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 400))
  }
}
</script>

<style lang="stylus" scoped>
  @import "~assets/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: 0
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
