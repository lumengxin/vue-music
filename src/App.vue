<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 解决重新切换到recommend中轮播图闪动，同时利用缓存 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
// 相对路径
// import MHeader from './components/m-header/m-header'
// 别名配置
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'

export default {
  name: 'App',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style lang="stylus" scoped>

</style>
