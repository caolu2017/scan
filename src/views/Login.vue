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

  <div v-if="nativeVersion" class="version">v{{ nativeVersion }}</div>
   
  </div>
</template>

<script>
import {login, getVer} from '@/api'
import { setSession, setCookie } from '@/utils';
import constant from '@/conf/constant'
export default {
  data () {
    return {
      loginName:'',
      loginPwd: '',
      active: 0,
      nativeVersion: ''
    }
  },
  created(){
    
  },
  mounted(){
    let that = this;
    document.addEventListener('plusready',function () {
      console.log('hahaha')
      plus.runtime.getProperty(plus.runtime.appid, function(inf){
        console.log('hahaha', inf)
        that.nativeVersion = inf.version;
      });
    },false);
  },
  methods: {
    // 获取当前版本号
    getNativeVersion(){
      let that = this;
     
    },
    getVer(version){
      let that = this;
      console.log('version', version)
      getVer().then(res=>{
        console.log('res', res)
        if(res!=version){
          console.log('res!=version', res!=version)
          that.downloadApk()
        }
      })
    },

// 下载apk文件
downloadApk(url){
    let that = this;
    console.log('url', `${constant.WEB_SERVER}/uploads/gp.apk`)
    plus.downloader.createDownload( `${constant.WEB_SERVER}/uploads/gp.apk`, {filename: "_doc/update/"}, function(d, status){
      console.log('res', d, status)
        if ( status === 200 ) {
            // 安装apk资源包
            // that.installFlag = true;
            var filename = d.filename;
            console.log('filename', filename)
            plus.nativeUI.showWaiting("安装更新");
            plus.runtime.install(filename,{},function(){
                plus.nativeUI.closeWaiting();
                plus.nativeUI.alert("更新完成！",function(){
                    //  更新完成后重启应用
                    plus.runtime.restart();
                });
            },function(e){
              console.log(e, JSON.stringify(e))
                plus.nativeUI.closeWaiting();
                plus.nativeUI.toast("安装更新失败！");
            });
        }else {
          plus.nativeUI.alert('下载失败')
        }
    }).start();
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

.version{
  text-align: center;
  font-size: 14px;
}
</style>
