import Vue from 'vue'
import Router from 'vue-router'
import Inbound from '@/views/Inbound.vue'
import Login from '@/views/Login.vue'
import Outbound from '@/views/Outbound.vue'
import Buttom from '@/views/index.vue'
import { getSession, getCookie } from '@/utils'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Buttom',
    component: Buttom,
    meta: { title: '物流報入' },
    children: [
      {
        path: '',
        name: 'Inbound',
        component: Inbound,
        meta: { title: '物流報入' }
      },
      {
        path: '/out',
        name: 'Outbound',
        component: Outbound,
        meta: { title: '物流領出' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '' }
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || ' '
  const userInfo = getSession('userInfo') && JSON.parse(getSession('userInfo'))
  // if(to.path== '/login'){
  //   if (JSON.parse(getCookie('userInfo')) && JSON.parse(getCookie('userInfo')).userID) {
  //     next('/')
  //   }else{
  //     next()
  //   }
  // }else{
  //   if (JSON.parse(getCookie('userInfo')) && JSON.parse(getCookie('userInfo')).userID){
  //     next('/login')
  //   }else{
  //     next()
  //   }
  // }

  if (userInfo && userInfo.userID) {
    if (to.path== '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.path== '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
