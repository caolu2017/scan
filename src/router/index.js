import Vue from 'vue'
import Router from 'vue-router'
import Inbound from '@/views/Inbound.vue'
import Login from '@/views/Login.vue'
import Outbound from '@/views/Outbound.vue'
import Home from '@/views/home.vue'
import Scan from '@/views/scan.vue'
import { getSession, getCookie } from '@/utils'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '主页' },
    children: [
    ]
  },
  {
    path: '/in',
    name: 'Inbound',
    component: Inbound,
  },
  {
    path: '/out',
    name: 'Outbound',
    component: Outbound,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '' }
  },
  {
    path: '/scan',
    name: 'Scan',
    component: Scan,
    meta: { title: '' }
  }
]

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title || ' '
  const userInfo = getCookie('userInfo') && JSON.parse(getCookie('userInfo'))
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
