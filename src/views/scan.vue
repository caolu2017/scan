<template>
  <div class="scan">
    <van-nav-bar
    :title="title"
    left-arrow
    left-text="返回"
    @click-left="onClickLeft"
    >
   </van-nav-bar>
   <van-form v-if="isWL">
    <van-cell-group inset>
      <van-field
        v-model="factoryname"
        is-link
        readonly
        name="picker"
        label="工厂"
        placeholder="点击选择工厂"
        @click="showPicker1 = true"
      />
      <van-popup v-model:show="showPicker1" round position="bottom">
        <van-picker
          :columns="factorys"
          show-toolbar
          @cancel="showPicker1 = false"
          @confirm="onfactory"
        />
      </van-popup>
      <van-field
        v-model="line.txt"
        is-link
        readonly
        name="picker"
        label="产线"
        placeholder="点击选择产线"
        @click="showPicker2 = true"
      />
      <van-popup v-model:show="showPicker2" round position="bottom">
        <van-picker
          :columns="cx"
          show-toolbar
          @cancel="showPicker2 = false"
          @confirm="onXc"
        />
      </van-popup>
    </van-cell-group>
  </van-form>

  <div style="padding: 20px">
    <van-checkbox v-model="isCheckClrSizeUk" shape="square" @change="handleChange">
      <span class="checkColor">检查颜色尺码</span>
    </van-checkbox>
  </div>
   
  
  <div style="padding: 30px;">
    <van-button type="info" block style="marginTop: 50px;" @click="jump">开始扫描</van-button>
  </div>
   
   <div v-if="msg" class="msg">{{msg}}</div>
  </div>
</template>

<script>
import { getSession, getCookie, setCookie } from '@/utils';
import { Dialog } from 'vant';
import { getLines, getFactorys  } from '@/api';
import { uuid } from 'vue-uuid';

export default {
  name: 'Scan',
  data () {
    return {
      showPicker1: false,
      showPicker2: false,
      line: {txt:'', value:''},
      zc: JSON.parse(getCookie('userInfo')).processName||'',
      userName: JSON.parse(getCookie('userInfo')).userName||'',
      factoryname: JSON.parse(getCookie('userInfo')).factoryname||'',
      factoryID: JSON.parse(getCookie('userInfo')).factoryID||'',
      cx:[],
      factorys:[],
      msg:'',
      isCheckClrSizeUk: 0,
      isWL: JSON.parse(getCookie('userInfo')).processCode=='WL',
      title: this.$route.query.path=='in'?'入库扫描':'出库扫描',
      key: this.$route.query.path=='in'?'inline':'outline',
      key1: this.$route.query.path=='in'?'incheck':'outcheck',
    }
  },
  watch: {
    
  },

created(){
  this.getFactorys()
  this.getLins()
  if(getCookie(this.key)&&JSON.parse(getCookie(this.key))){
    const line = JSON.parse(getCookie(this.key))
    this.line ={
      txt: line.txt,
      value:line.value
    }
  }
  if(getCookie(this.key1)){
    const check = getCookie(this.key1)
    this.isCheckClrSizeUk = check=='1'?true:false
  }
},

  methods: {
    getLins(){
      getLines({
          factoryID: this.factoryID
        }).then((data)=>{
          this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
        })
    },
    getFactorys(){
      getFactorys().then((data)=>{
        this.factorys = data.map(i=>{return {...i, text: i.code, value: i.id}}).slice(0)
      })
     
    },
    onClickLeft(){
      Dialog.confirm({
        message: '确认返回',
      })
      .then(() => {
       this.$router.back()
      })
      .catch(() => {
        // on cancel
      });
    },
    onXc(e){
      this.line = {
        txt: e.text,
        value: e.value
      }
      this.showPicker2 = false
      this.msg = ''
      // this.loginName = JSON.parse(getCookie('code')).loginName
      setCookie(this.key, JSON.stringify(this.line))
    },
    onfactory(e){
      console.log('e', e)
      this.factoryname = e.text
      this.factoryID = e.id
      this.factoryCode = e.code
      this.showPicker1 = false
      this.getLins()
    },
    jump(){
      if(!this.isWL||(this.isWL&&this.line&&this.line.value)){
        console.log()
        this.$router.push({
          path: `/${this.$route.query.path}`,
          query:{
            line: this.line,
            uuid: uuid.v1(),
            isCheckClrSizeUk: this.isCheckClrSizeUk?1:0
          }
        })
      }else {
        this.msg = '制程获取完成，请选择产线'
      }  
    },
    handleChange(e){
      setCookie(this.key1, e?'1':'0')
    } 
  }
}
</script>

<style scoped lang="scss">
.icon{
  width: 38px;
}

/deep/ input{
  text-align: right;
}

.msg{
    height: 100px;
    line-height: 100px;
    margin: 40px 30px;
    text-align: center;
    border-radius: 10px;
    font-size: 32px;
    background: rgba(245, 108, 108, 0.5);
    color: red;
  }

  .checkColor{
    font-size: 36px;
  }

</style>