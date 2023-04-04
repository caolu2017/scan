<template>
  <div class="login">
    <img src="../assets/login.png"/>
    <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="loginName"
        name="登入密碼"
        placeholder="輸入登入賬號"
        :rules="[{ required: true, message: '請填寫登入賬號' }]"
      />
      <van-field
        v-model="loginPwd"
        type="password"
        name="登入密碼"
        placeholder="輸入登入密碼"
        :rules="[{ required: true, message: '請填寫登入密碼' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        登入
      </van-button>
      
    </div>
  </van-form>

  <div class="version"></div>
   
  </div>
</template>

<script>
import {login, getVer} from '@/api'
import { setSession, setCookie } from '@/utils';
export default {
  data () {
    return {
      loginName:'',
      loginPwd: '',
      active: 0
    }
  },
  created(){
    this.getVer()
  },
  methods: {
    getVer(){
      getVer().then(res=>{
        console.log('res', res)
      })
    },
    onSubmit(){
      // const res = {
      //   'userID': 1,
      //   'loginName':'admin',
      //   'userName':'admin',
      //   'factoryID':1,
      //   'factoryname':'TOP',
      // }
      
      
      login({
        loginName: this.loginName,
        loginPwd: this.loginPwd
      }).then((res)=>{
        console.log('登录', res)
        setSession('userInfo', JSON.stringify(res))
        setCookie('userInfo', JSON.stringify(res))
        this.$router.push('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  padding: 76px 20px 0;

  img{
    width: calc(100% - 40px) ;
    margin: 0 20px 30px;
  }
}
.btn-wrapper{
  // display: flex;
  margin-bottom: 20px;
}
</style>
