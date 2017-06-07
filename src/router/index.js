import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Callback from '@/components/auth/Callback'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
  ]
})
