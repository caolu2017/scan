<template>
  <div class="in-bound">
    <div class="header">報入</div>
  <van-form @failed="onFailed">
    <van-cell-group inset>
      <van-field
        v-model="factoryname"
        class="factory"
        readonly
        label="廠區"
      />
      <van-field
        v-model="process.text"
        class="factory"
        readonly
        label="製程"
      />
      <!-- <van-field
        v-model="process.text"
        class="factory"
        is-link
        readonly
        name="picker"
        label="製程"
        placeholder="點擊選擇製程"
        @click="showPicker1 = true"
      />
      <van-popup v-model:show="showPicker1" round position="bottom">
        <van-picker
        show-toolbar
          :columns="zc"
          @cancel="showPicker1 = false"
          @confirm="onZc"
        />
      </van-popup> -->
      <van-field
      v-show="process.text=='物流'"
      class="factory"
        v-model="line.text"
        is-link
        readonly
        name="picker"
        label="產線"
        placeholder="點擊選擇產線"
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
      <van-field 
      :class="isFocus?'active-input':''" 
      v-model="invoiceNO" 
      @focus="handleFocus" 
      @blur="handleBlur" 
      label="工票號碼" 
      :disabled="!(msg.includes('請掃描製程卡')||msg.includes('已完成收入報工'))"
      placeholder="請掃描工票條碼號"
      @input="handleInput"
      ref="searchInput"
      @keyup.enter.native="handlecommit" /> 
      <!-- <van-field 
      :class="isFocus?'active-input':''" 
      v-model="invoiceNO" 
      @focus="handleFocus" 
      @blur="handleBlur" 
      label="工票號碼" 
      :disabled="!msg.includes('請掃描製程卡')&&msg.value!='已完成收入報工'"
      placeholder="請掃描工票條碼號"
      ref="searchInput"
      @keyup.enter.native="handlecommit" />  -->
    </van-cell-group>
    <div class="msg">{{msg}}</div>
  </van-form>

  <div class="scan">
    <div></div>
  </div>

  <van-cell-group inset class="info">
    <div class="line1">
      <div><span>款式:</span> {{ info.styleno }} </div>
      <div><span>總數量:</span> {{ info.totalqty }}</div>
    </div>
    <div class="card">
      <div class="card-item title">
        <span>顏色</span>
        <span>尺碼</span>
        <span>數量</span>
      </div>
      <div class="card-item value">
        <span>{{ info.clrno }}</span>
        <span>{{ info.size }}</span>
        <span>{{ info.qty }}</span>
      </div>
    </div>
  </van-cell-group>
  </div>
</template>

<script>
import { getSession, getCookie } from '@/utils';
import { getProcess, getLines, workProgressCommit } from '@/api';
const msge = [
      '',
      '製程獲取完成，請選擇產線',
      '製程獲取完成，請掃描製程卡',
      '產線獲取完成，請掃描製程卡',
      '已完成收入報工'
    ]
    const userInfo = getSession('userInfo')&&JSON.parse(getSession('userInfo'))
    
    const factoryname = userInfo?userInfo.factoryname:''
export default {
  name: 'Inbound',
  data () {
    return {
      msg: '',
      fieldValue: '',
      showPicker: false,
      showPicker1: false,
      showPicker2: false,
      isFocus: false,
      invoiceNO: '',
      process: {text: JSON.parse(getSession('userInfo')).processName},
      line: {text: ''},
      zc: [],
      cx: [],
      step: 0,
      info: {},
      factoryname: JSON.parse(getSession('userInfo')).factoryname,
      nextCode:'',
      code:'',

    }
  },

    
    
  watch: {
   
  },

  created(){
    if(this.process.text!='物流'){
      getLines({
        factoryID: JSON.parse(getSession('userInfo')).factoryID
      }).then((data)=>{
        this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
        this.msg = msge[3]
      })
    }else{
      getLines({
        factoryID: JSON.parse(getSession('userInfo')).factoryID
      }).then((data)=>{
        this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
        this.msg = msge[1]
      })
    }
    this.init()
  },

  mounted(){
    // this.addScanMonitor()
   
  },


  methods: {
    addScanMonitor() {
      window.onkeypress = e => {
        console.log(e)
        if (window.event) { // IE
          this.nextCode = e.keyCode
        } else if (e.which) { // Netscape/Firefox/Opera
          this.nextCode = e.which
        }

         
        // if (e.which === 13) { // 键盘回车事件
        //   if (this.code.length < 3) return // 扫码枪的速度很快，手动输入的时间不会让code的长度大于2，所以这里不会对扫码枪有效
        //   console.log('扫码结束,条形码：', this.code)
        //   // this.scanningForm.scanCode = this.code
        //   this.lastCode = ''
        //   this.lastTime = ''
        //   // this.handleSubmitScanning()
        //   return
        // }

        this.nextTime = new Date().getTime()
        if (!this.lastTime && !this.lastCode) {
          this.code = '' // 清空上次的条形码
          this.code += e.keyCode
          console.log('扫码开始---', this.code, e.key)
        }
        if (this.lastCode && this.lastTime && this.nextTime - this.lastTime > 500) { // 当扫码前有keypress事件时,防止首字缺失
          this.code = e.keyCode
          console.log('防止首字缺失。。。', this.code)
        } else if (this.lastCode && this.lastTime) {
          this.code += e.keyCode
          console.log('扫码中。。。', this.code)
        }
        this.lastCode = this.nextCode
        this.lastTime = this.nextTime

      }
    },
    handleInput(e){
      let a=e.indexOf(",")
      if(a>-1){
        let l =e.substring(0,a)
        this.invoiceNO = l
      }
    },
    onConfirm({ selectedOptions }) {
      this.showPicker = false;
      this.fieldValue = selectedOptions[0].text;
    },

    handleFocus(){
      if(!this.msg.includes('請掃描製程卡')&&this.msg!='已完成收入報工') return
      this.isFocus = true;
    },

    handleBlur () {
      this.isFocus = false;
    },

    getCode(code){ // 获取到扫码枪输入的内容，做别的操作
      this.invoiceNO = code&&code.split(',')[0]
      console.log('invoiceNO', code&&code.split(',')[0])
      // this.handlecommit()
    },

    onXc(value, index){
      this.line = value
      this.showPicker2 = false
      this.msg = msge[3]
      this.$nextTick( () => {
        this.$refs.searchInput.focus();
      })
      this.invoiceNO=''
      this.info={}
    },

    onZc(value, index){
      this.process = value
      this.showPicker1 = false
      if(value.text=='物流'){
        getLines({
          factoryID: JSON.parse(getSession('userInfo')).factoryID
        }).then((data)=>{
          this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
          this.msg = msge[1]
        })
      }else{
        this.msg = msge[2]
        this.line = {text:''};
        this.$nextTick( () => {
          this.$refs.searchInput.focus();
        })
      }
      
      this.invoiceNO=''
      this.info={}
      
    },

    handlecommit (v){
      const processCode = JSON.parse(getSession('userInfo')).processCode
      const process = this.zc.find(i=>i.code==processCode)

      workProgressCommit({
        invoiceNO: this.invoiceNO,
        processID: process.id,
        processCode: processCode,
        lineID: this.line.id,
        workType: 'I'
      }).then((data)=>{
        this.info = data
        this.msg = msge[4]
        
      }).finally(()=>{
        this.$nextTick( () => {
          this.$refs.searchInput.blur();
        })
        this.invoiceNO = ''
      })
    },

    init(){
      getProcess().then((data)=>{
        this.zc = data.map(i=>{return {...i, text: i.name, value: i.id}})
      })
      // const data = [{
      //   'name':'车缝',
      //   'comments':'beizhu',
      //   'id':1,
      //   'code':'TOP'
      // },
      // {
      //   'name':'物流',
      //   'comments':'beizhu',
      //   'id':2,
      //   'code':'TOP'
      // }]
      // this.zc = data.map(i=>{return {...i, text: i.name, value: i.id}})
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  height: 50px;
  padding: 0 30px;
  font-size: 32px;
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
  padding-top: 70px;

  .msg{
    height: 100px;
    line-height: 100px;
    margin: 40px 30px;
    color: #0082FF;
  background: rgba(0, 85, 175, 0.1);
  text-align: center;
  border-radius: 10px;
  font-size: 32px;

  }

  .info{
    padding: 40px 30px 50px;

    .card{
      padding: 0 30px;
      margin-top: 40px;
      opacity: 0.6;
      background: #F8F8F8;
      border-radius: 20px;

      &-item{
        color: #333;
        font-size: 28px;
        display: flex;

        span{
          flex: 1;
          text-align: center;
          padding: 20px 0;
        }
        
        &.title{
          color: #666666;
          
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
    font-size: 28px;
    color: #666666;

    span {
      font-weight: 400;
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
</style>

