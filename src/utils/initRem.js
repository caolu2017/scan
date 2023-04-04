/*
 * @Author: caolu 64294@yangzijiang.com
 * @Date: 2022-07-21 11:07:00
 * @LastEditors: caolu 64294@yangzijiang.com
 * @LastEditTime: 2023-03-22 19:39:34
 * @Description: 设置全屏适配
 */
const screenRatio = {
  ratio: 1.0
}

// 初始化
setRem()

// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}

function setRem () {
  let baseSize = 75
  let scale = document.documentElement.clientWidth / 750
  screenRatio.ratio = scale
  document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px'
  // console.log(`基准设置为 ${document.documentElement.style.fontSize}`)
}

export default screenRatio
