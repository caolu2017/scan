<template>
  <div class="home">
    <!-- <router-view/> -->
    <van-nav-bar
    title="MES扫描报工"
    @click-right="onClickRight"
    >
    <template #right>
      <img class="icon" src="@/assets/quit.svg" alt="">
    </template>
   </van-nav-bar>

   <div>
    <h3 class="title">程式模块</h3>
    <div class="btns">
      <van-button icon="arrow-left" type="primary" @click="jump('in')" >入库扫描</van-button>
      <van-button type="info" @click="jump('out')">出库扫描 <van-icon name="arrow" /></van-button>
    </div>
    <h3 class="title">用户信息</h3>
    <div class="content">
      <p>所属制程：<span>{{zc}}</span></p>
      <p>用户账号：<span>{{userName}}</span></p>
    </div>
   </div>
    
  </div>
</template>

<script>
import { getSession, getCookie, removeCookie } from '@/utils';
import { Dialog } from 'vant';

export default {
  data () {
    return {
      zc: JSON.parse(getCookie('userInfo')).processName||'',
      userName: JSON.parse(getCookie('userInfo')).userName||''
    }
  },
  watch: {
    
  },


  methods: {
    jump(path){
      this.$router.push({
        path: '/scan',
        query:{
          path
        }
      })
    },
    // jumpOut(){
    //   this.$router.push('/out')
    // },
    onClickRight(){
      Dialog.confirm({
      message: '确认退出',
    })
      .then(() => {
        removeCookie('userInfo')
        plus.runtime.quit()
      })
      .catch(() => {
        // on cancel
      });
      
    }
  }
}
</script>

<style scoped lang="scss">
.title{
  padding: 20px 20px;
  font-size: 28px;
  background: #eee;
  margin-top: 0;
}

.btns{
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
}
.icon{
  width: 38px;
}

.content{
  padding: 20px 0 20px 150px;
  font-size: 30px;
  font-weight: 500;
}

</style>