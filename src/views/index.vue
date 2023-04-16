<template>
  <div>
    <router-view />
    <van-tabbar v-model="active" active-color="#1989FA">
      <van-tabbar-item to="/" replace>
        <span>報入</span>
        <template #icon="props">
          <img :src="require(props.active ? '@/assets/l_blue.svg' : '@/assets/l_grey.svg')" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item class="out" to="/out" replace >
        <span >報出</span>
        <template #icon="props">
          <img :src="require(props.active ? '@/assets/r_blue.svg' : '@/assets/r_grey.svg')" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0
    }
  },
  watch: {
    '$route.path': {
      handler: function (newval) {
        this.active = newval=='/out'?1:0
      },
      immediate: true
    }
  },


  methods: {

  }
}
</script>

<style lang="scss" scoped>
// .out {
//   /deep/ img{
//     transform: scale(-1,1);
//   }
// }
// /deep/ .van-tabbar-item--active a{
//   color:#1989FA !important;
// }

// /deep/ .van-tabbar-item a{
//   color:#000;
// }
</style>