<template>
  <div id="app">
     <m-header></m-header>
    <router-view/>
  </div>
</template>

<script>
// 相对路径
// import MHeader from './components/m-header/m-header'
// 别名配置
import MHeader from 'components/m-header/m-header'

export default {
  name: 'App',
  components: {
    MHeader
  }
}
</script>

<style>
</style>
