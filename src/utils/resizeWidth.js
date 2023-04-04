/*
 * @Author: caolu 64294@yangzijiang.com
 * @Date: 2022-08-02 09:17:35
 * @LastEditors: caolu 64294@yangzijiang.com
 * @LastEditTime: 2022-08-03 11:23:22
 * @Description: 监听宽
 */
import Vue from 'vue'

// 自动注册到全局
Vue.directive('resize', {
  bind (el, binding) {
    // el为绑定的元素，binding为绑定给指令的对象
    let width = ''

    function isReize () {
      const style = document.defaultView.getComputedStyle(el)
      if (width !== style.width) {
        // 关键(这传入的是函数,所以执行此函数)
        binding.value({ width: style.width })
      }
      width = style.width
    }

    el.__vueSetInterval__ = setInterval(isReize, 300)
  },

  unbind (el) {
    clearInterval(el.__vueSetInterval__)
  }
})
