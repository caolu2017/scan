// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import "@babel/polyfill";
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant, { Lazyload, Toast } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
// import './assets/reset.css'
import '@/utils/resizeWidth'
/** 配置全屏适配 **/
import './utils/initRem'
// import 'babel-polyfill'
// import Es6Promise from 'es6-promise'

// Es6Promise.polyfill()
import ResizeObserver from 'resize-observer-polyfill'
window.ResizeObserver = ResizeObserver
import Vconsole from 'vconsole'
// import UUID from "vue-uuid";

 
// var vConsole = new Vconsole()
 
// Vue.use(vConsole);

/** 引入 Vant 所有控件 **/
Vue.use(Lazyload)
Vue.use(Vant)
Vue.use(Toast)
// Vue.use(UUID)

Vue.config.productionTip = false
Toast.setDefaultOptions({ duration: 20000 })
Vue.prototype.$showLoading = Toast.bind(Toast, {// bind 改变this指向，指向Toast
  type: 'loading', // 类型加载中
  forbidClick: true, // 禁止点击
  loadingType: 'spinner', // 菊花圈
  duration: 0 // 值为 0 时，toast 不会消失
})

Vue.prototype.$hideLoading = Toast.clear.bind(Toast)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
