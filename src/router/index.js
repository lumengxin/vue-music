import Vue from 'vue'
import Router from 'vue-router'
// import Rank from 'components/rank/rank'
// import Recommend from 'components/recommend/recommend'
// import Search from 'components/search/search'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

// 路由懒加载（老版本）, 将app.js分割为更多js, 路由组件按需异步加载
// const Recommend = (resolve) => {
//   import('components/recommend/recommend').then(recommend => {
//     resolve(recommend)
//   })
// }

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // 重定向
      redirect: '/recommend'
    },
    {
      path: '/rank',
      component: () => import('components/rank/rank'),
      children: [
        {
          path: ':id',
          component: () => import('components/top-list/top-list')
        }
      ]
    },
    {
      path: '/recommend',
      component: () => import('components/recommend/recommend'),
      children: [
        {
          path: ':id',
          component: () => import('components/disc/disc')
        }
      ]
    },
    {
      path: '/search',
      component: () => import('components/search/search'),
      children: [
        {
          path: ':id',
          component: () => import('components/singer-detail/singer-detail')
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: () => import('components/singer/singer'),
      children: [
        {
          path: ':id',
          component: () => import('components/singer-detail/singer-detail')
        }
      ]
    },
    {
      path: '/user',
      component: () => import('components/user-center/user-center')
    }
  ]
})
