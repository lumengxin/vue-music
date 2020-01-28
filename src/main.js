// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
// assets 别名 src/assets
import 'assets/stylus/index.styl'
// vue第三方插件，懒加载
import VueLazyLoad from 'vue-lazyload'
// 移动端调试
// eslint-disable-next-line no-unused-vars
import VConsole from 'vconsole'
import 'assets/ali#icon/iconfont.css'

// eslint-disable-next-line no-unused-vars
// var vConsole = new VConsole()
// console.log('vconsole')

fastclick.attach(document.body)

Vue.use(VueLazyLoad, {
  loading: require('assets/image/logo.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
