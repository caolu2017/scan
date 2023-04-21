<template>
  <div class="in-bound">
    <van-nav-bar
    title="出库扫描"
    left-arrow
    left-text="返回"
    @click-left="onClickLeft"
    >
   </van-nav-bar>
  <van-form >
    <van-cell-group inset>
      <van-field
        v-model="factoryname"
        v-if="isWL"
        class="factory"
        readonly
        label="工厂"
      />
      <van-field
        v-model="process.text"
        class="factory"
        readonly
        label="制程"
      />
      <van-field
        v-model="uuid"
        class="factory"
        readonly
        label="出货单号"
      />
      <van-field
      class="factory"
      v-if="isWL"
        v-model="line.txt"
        readonly
        label="产线"
      />
      
      <van-field 
      :class="isCwFocus?'active-input':''" 
      v-model="locNo" 
      @focus="handleCFocus" 
      @blur="handleCBlur" 
      label="储位" 
      placeholder="请扫描储位"
      @input="handleCInput"
      id="chuwei"
      @keyup.enter.native="handlecommit('chuwei')"
      ref="chuwei" /> 
      <van-field 
      :class="isFocus?'active-input':''" 
      v-model="invoiceNO" 
      @focus="handleFocus" 
      @blur="handleBlur" 
      label="工票号码" 
      id="invoice"
      placeholder="请扫描工票条形码号"
      @input="handleInput"
      ref="searchInput"
      @keyup.enter.native="handlecommit('searchInput')" /> 
    </van-cell-group>
    <div v-if="msg" :class="[{'err':msg=='扫描失败'||isError},'msg']">{{msg}}</div>
  </van-form>

  <div class="scan">
    <div></div>
  </div>

  <van-cell-group inset class="info">
    <div class="line1" style="marginBottom: 20px">
      <div><span>款式:</span> {{ info.styleno }} </div>
    </div>
    <div class="line1">
      <div style="flex: 1;"><span>总数量:</span> {{ info.totalqty }}</div>
      <div style="flex: 1;"><span>工票数:</span> {{ info.ticketQty }} </div>
    </div>
    <div class="card">
      <div class="card-item title">
        <span>颜色</span>
        <span>尺码</span>
        <span>数量</span>
      </div>
      <div v-for="(item, index) in dataDetail" :key="index" class="card-item value">
        <span>{{ item.clrno }}</span>
        <span>{{ item.size }}</span>
        <span>{{ item.qty }}</span>
      </div>
    </div>
  </van-cell-group>

    <div class="btns">
      <van-button type="danger" @click="onClear">清空</van-button>
      <van-button style="marginLeft: 30px" type="primary" @click="onComplete">扫描完成</van-button>
    </div>
    <audio id="audio"  :src="ok" ></audio>
    <audio id="audio-err" :src="error"  ></audio>
  </div>
</template>

<script>
import { getSession, getCookie } from '@/utils';
import { clearTickets, getLines, workProgressCommit, finishScan } from '@/api';
import { Dialog } from 'vant';
import constant from '@/conf/constant'
import { uuid } from 'vue-uuid';

const ok = `${constant.WEB_SERVER}/uploads/ok.wav`
const error = `${constant.WEB_SERVER}/uploads/error.wav`
const msge = [
      '扫描成功',
      '扫描失败'
    ]
const userInfo = getCookie('userInfo')&&JSON.parse(getCookie('userInfo'))
const factoryname = userInfo?userInfo.factoryname:''
   

export default {
  name: 'Inbound',
  data () {
    return {
      ok, error,
      msg: '',
      fieldValue: '',
      showPicker: false,
      showPicker1: false,
      showPicker2: false,
      isFocus: false,
      isCwFocus: false,
      invoiceNO: '',
      process: {text: JSON.parse(getCookie('userInfo')).processName},
      line: this.$route.query.line,
      uuid: this.$route.query.uuid,
      cx: [],
      info: {},
      factoryname: JSON.parse(getCookie('userInfo')).factoryname,
      isWL: JSON.parse(getCookie('userInfo')).processCode=='WL',
      haschuwei: ['WL', 'YP'].includes(JSON.parse(getCookie('userInfo')).processCode),
      nextCode:'',
      code:'',
      codeInfo:'',
      dataDetail: [],
      locNo:'',
      isError: false,
      finally: false,
      activeFocus: 'chuwei'
    }
  },

    
    
  watch: {
   
  },

  created(){
    
  },

  mounted(){
    this.init()
    music = document.getElementById("audio");
    music1 = document.getElementById("audio");
    console.log('xxxxxxxx',this.$route.query.line)
  },


  methods: {
    onClear(){
      Dialog.confirm({
      message: '确认清空',
    })
      .then(() => {
        this.clearTickets()
      
      })
      .catch(() => {
        // on cancel
      });
    },
    handleInput(e){
      this.codeInfo = e
      let a=e.indexOf(",")
      if(a>-1){
        let l =e.substring(0,a)
        this.invoiceNO = l
      }
    },
    handleCInput(e){
      let a=e.indexOf(",")
      if(a>-1){
        let l =e.substring(0,a)
        this.locNo = l
      }
      
    },
    onConfirm({ selectedOptions }) {
      this.showPicker = false;
      this.fieldValue = selectedOptions[0].text;
    },

    handleFocus(){
      this.isFocus = true;
      this.activeFocus = 'searchInput'
      document.querySelector('#invoice').setAttribute('readonly', 'readonly')
      setTimeout(() => {
        document.querySelector('#invoice').removeAttribute('readonly');
      }, 200);
      plus.key.hideSoftKeybord()
    },
    handleCFocus(){
      this.isCwFocus = true;
      this.activeFocus = 'chuwei'
      document.querySelector('#chuwei').setAttribute('readonly', 'readonly')
      setTimeout(() => {
        document.querySelector('#chuwei').removeAttribute('readonly');
      }, 200);
      plus.key.hideSoftKeybord()
    },

    handleBlur () {
      this.isFocus = false;
    },
    handleCBlur () {
      this.isCwFocus = false;
    },

    getCode(code){ // 获取到扫码枪输入的内容，做别的操作
      this.invoiceNO = code&&code.split(',')[0]
    },

    onXc(value, index){
      this.line = value
      this.showPicker2 = false
      this.msg = msge[3]
      this.$nextTick( () => {
        this.$refs.searchInput.focus();
        setTimeout(()=>{
            plus.key.hideSoftKeybord()
          },1)
      })
      this.invoiceNO=''
      this.info={}
    },

    onZc(value, index){
      this.process = value
      this.showPicker1 = false
      if(value.text=='物流'){
        getLines({
          factoryID: JSON.parse(getCookie('userInfo')).factoryID
        }).then((data)=>{
          this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
          this.msg = msge[1]
        })
      }else{
        this.msg = msge[2]
        this.line = {text:''};
        this.$nextTick( () => {
          this.$refs.searchInput.focus();
          setTimeout(()=>{
            plus.key.hideSoftKeybord()
          },1)
        })
      }
      
      this.invoiceNO=''
      this.info={}
      
    },

    handlecommit (ref){
      const params = {
        invoiceNO: this.invoiceNO,
        processID: JSON.parse(getCookie('userInfo')).processID,
        processCode: JSON.parse(getCookie('userInfo')).processCode,
        workType: 'O',
        codeInfo: this.codeInfo,
        userID: JSON.parse(getCookie('userInfo')).userID,
        uuid: this.uuid
      }
      if(this.isWL){
        params['lineID'] = this.line.id
      }
      // if(this.haschuwei){
        params['locNo'] = this.locNo
      // }
      workProgressCommit(params).then((data)=>{
        this.info = {totalqty: data.totalqty, styleno: data.dataDetail&&data.dataDetail[0]?data.dataDetail[0].styleno:''}
        this.msg = msge[0]
        this.dataDetail = data.dataDetail
        document.getElementById("audio").play()
        this.isError = false
      }).catch((msg)=>{
        document.getElementById("audio-err").play()
        this.msg = msg||msge[1]
        this.isError = true
      }).finally(()=>{
     
          this.$nextTick( () => {
            this.$refs[ref].focus();
            setTimeout(()=>{
            plus.key.hideSoftKeybord()
          },1)
          })
       
        this.invoiceNO = ''
        this.locNo = ''
        this.codeInfo = ''
        this.finally = true
      })
    },

    init(){
      // if(this.haschuwei){
        this.$nextTick( () => {
          this.$refs.chuwei.focus();
          setTimeout(()=>{
            plus.key.hideSoftKeybord()
          },1)
        })
        this.isCwFocus = true
      // }else{
        // this.$nextTick( () => {
        //   this.$refs.searchInput.focus();
        //   setTimeout(()=>{
        //     plus.key.hideSoftKeybord()
        //   },1)
        // })
        // this.isFocus = true;
      // }
    },

    onClickLeft(){
      if(this.finally){
        Dialog.confirm({
          message: '需点击扫描完成',
        })
        .then(() => {
        //  this.$router.back()
        })
        .catch(() => {
          // on cancel
        });
      }else{
        Dialog.confirm({
          message: '确认返回',
        })
        .then(() => {
        this.$router.back()
        })
        .catch(() => {
          // on cancel
        });
      }
    },

    onComplete(){
      Dialog.confirm({
        message: '确认扫描完成',
      })
      .then(() => {
      //  this.$router.back()
      this.finishScan()
      })
      .catch(() => {
        // on cancel
      });
    },
    finishScan(){
      finishScan({
        userID: JSON.parse(getCookie('userInfo')).userID,
        uuid: this.uuid
      }).then(res=>{
        this.$router.back()
      })
    },
    clearTickets(){
      clearTickets({
        userID: JSON.parse(getCookie('userInfo')).userID,
        uuid: this.uuid
      }).then(res=>{
        console.log('resres', res)
      }).finally(()=>{
        this.invoiceNO = ''
        this.dataDetail = []
        this.info={}
        this.msg = ''
        this.locNo = ''
        this.finally = false
        console.log('?????', this.activeFocus)
        this.$nextTick( () => {
          this.$refs[this.activeFocus].focus();
        })
        this.uuid = uuid.v1()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 50px;
  padding: 0 30px;
  font-size: 34px;
  line-height: 50px;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  border-bottom: 1px solid #ddd;
}
/deep/.factory input{
  text-align: right;
}
.active-input {
  // content: '';
  // width: 100%;
  // height: 1px;
  border-bottom: 1px solid green;

  /deep/ label {
    color: rgb(25, 137, 250);
  }

  /deep/.van-cell__title span{
    color: rgb(25, 137, 250);
  }
}
/deep/.active-input .van-cell__title span{
    color: rgb(25, 137, 250);
  }

.in-bound{
  .msg{
    height: 100px;
    line-height: 100px;
    margin: 20px 30px;
    color: #0082FF;
  background: rgba(0, 85, 175, 0.1);
  text-align: center;
  border-radius: 10px;
  font-size: 34px;

  &.err{
    background: rgba(245, 108, 108, 0.5);
    color: red;
  }

  }



  .info{
    padding: 4px 30px 50px;

    .card{
      padding: 0 30px;
      margin-top: 40px;
      opacity: 0.6;
      background: #F8F8F8;
      border-radius: 20px;
      font-size: 30px;

      &-item{
        color: #000;
        font-size: 34px;
        display: flex;
        
        span{
          flex: 1;
          text-align: center;
          padding: 20px 0;
          font-size: 34px;
        }
        
        &.title{
          color: #000;
          font-weight: 600;

        }

        &.value{
          border-top: 1px solid rgb(235, 237, 240);
        }
      }

      
    }
  }

  .line1{
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    font-size: 34px;
    color: #000;

    span {
      font-weight: 400;
      font-size: 34px;
    }
  }
}


.guige{
  display: flex;
  width: 100%;

  .item{
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  span{
    flex: 1;
  }
}

.btns{
  text-align: center;
  margin-top: 60px;
}

/deep/.van-button{
  width: 220px!important;
}
</style>

