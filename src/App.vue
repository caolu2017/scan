<template>
  <div id="app">
    <router-view  />
  </div>
</template>

<script>
import {getVer} from '@/api'
import constant from '@/conf/constant'
export default {
  name: 'App',
  data () {
    return {
      nativeVersion: ''
    }
  },

  mounted(){
    let that = this;
    document.addEventListener('plusready',function () {
     console.log('ready')
      // 在这里调用plus api
      that.getNativeVersion()
    },false);
    
  },

  methods:{
    // 获取当前版本号
    getNativeVersion(){
      let that = this;
      plus.runtime.getProperty(plus.runtime.appid, function(inf){
        that.nativeVersion = inf.version;
        that.getVer(inf.version)
        localStorage.setItem("nativeVersion", inf.version);
      });
    },
    getVer(version){
      let that = this;
      console.log('version', version)
      getVer().then(res=>{
        console.log('res', res)
        if((res+'')>(version+'')){
          console.log('res!=version', res!=version)
          that.downloadApk()
        }
      })
    },

// 下载apk文件
downloadApk(url){
    let that = this;
    console.log('url', `${constant.WEB_SERVER}/uploads/gp.apk`)
    plus.nativeUI.showWaiting("下载安装包");
    // plus.downloader.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8')
    plus.downloader.createDownload( `${constant.WEB_SERVER}/uploads/gp.apk`, {method:"GET",filename:"_doc/update/"}, function(d, status){
      console.log('res', d, status)
      plus.nativeUI.closeWaiting();
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
              console.log('安装错误',e, JSON.stringify(e))
                plus.nativeUI.closeWaiting();
                plus.nativeUI.toast("安装更新失败！");
            });
        }else {
          plus.nativeUI.alert('下载失败')
          plus.downloader.clear();     
        }
    }).start();
},
  }
}
</script>
