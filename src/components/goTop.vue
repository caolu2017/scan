<!--
 * @Author: caolu 64294@yangzijiang.com
 * @Date: 2022-07-21 15:09:50
 * @LastEditors: caolu 64294@yangzijiang.com
 * @LastEditTime: 2022-08-15 11:16:20
 * @Description: 返回顶部
-->
<template>
  <div class="goTop" v-show="gotop">
    <img @click="toTop" src="../assets/goTop@2x.png" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      gotop: false
    }
  },

  mounted () {
    window.addEventListener('scroll', this.handleScroll, true)
  },
  beforeDestroy () {
    document.body.scrollTop = document.documentElement.scrollTop = 0
  },
  methods: {
    handleScroll () {
      let scrolltop = document.documentElement.scrollTop || document.body.scrollTop
      scrolltop > 30 ? (this.gotop = true) : (this.gotop = false)
    },
    toTop () {
      let top = document.documentElement.scrollTop || document.body.scrollTop
      // 实现滚动效果
      const timeTop = setInterval(() => {
        document.body.scrollTop = document.documentElement.scrollTop = top -= 50
        if (top <= 0) {
          clearInterval(timeTop)
        }
      }, 12)
    }

  }
}
</script>

<style scoped lang="scss">
.goTop {
  position: fixed;
  bottom: 10%;
  right: 16px;
  img {
    width: 96px;
  }
}

</style>
