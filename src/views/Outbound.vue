<template>
  <div class="out-bound">
    <div class="header">領出</div>
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
      <!-- <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup> -->
      <!-- <van-field
        v-model="process.text"
        class="factory"
        is-link
        readonly
        name="picker"
        label="製程"
        placeholder="點擊選擇製程"
        @click="showPicker1 = true"
      /> -->
      <!-- <van-popup v-model:show="showPicker1" round position="bottom">
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
        show-toolbar
          :columns="cx"
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
      :disabled="!(msg.includes('請掃描製程卡')||msg.includes('掃描成功')||msg.includes('掃描失敗'))"
      placeholder="請掃描工票條碼號"
      @input="handleInput"
      ref="searchInput"
      @keyup.enter.native="handlecommit" /> 
     
    </van-cell-group>
 

    <div v-if="msg" :class="[{'err':msg=='掃描失敗'},'msg']">{{msg}}</div>
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
      '',
      '請掃描製程卡',
      '請掃描製程卡',
      '掃描成功',
      '掃描失敗'
    ]
    const userInfo = getSession('userInfo')&&JSON.parse(getSession('userInfo'))
    const factoryname = userInfo?userInfo.factoryname:''
    const factoryID = userInfo?userInfo.factoryID:''
export default {
  name: 'Outbound',
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
      factoryname:JSON.parse(getSession('userInfo')).factoryname,
      factoryID:JSON.parse(getSession('userInfo')).factoryID,
      codeInfo:''
    }
  },

    
    
  watch: {
   
  },

  created(){
    
  },

  mounted(){
    this.init()
  },


  methods: {
    handleInput(e){
      this.codeInfo = e
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
      this.handlecommit()
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
      console.log('value212', JSON.parse(getSession('userInfo')).factoryID)
      this.process = value
      this.showPicker1 = false
      if(value.text=='物流'){
        getLines({
          factoryID: JSON.parse(getSession('userInfo')).factoryID
        }).then((data)=>{
          console.log('sssddssd', data)
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
      console.log('handlecommit', this.codeInfo)
      // this.invoiceNO = this.invoiceNO&&this.invoiceNO.split(',')[0]
      const processCode = JSON.parse(getSession('userInfo')).processCode
      const process = this.zc.find(i=>i.code==processCode)
      workProgressCommit({
        invoiceNO: this.invoiceNO,
        processID: process.id,
        processCode: processCode,
        lineID: this.line.id,
        codeInfo: this.codeInfo,
        userID: JSON.parse(getSession('userInfo')).userID,
        workType: 'O'
      }).then((data)=>{
        this.info = data
        this.msg = msge[4]
       
      }).catch((e)=>{
        console.log('ffff', e)
        this.msg = msge[5]
      }).finally(()=>{
        this.$nextTick( () => {
          this.$refs.searchInput.focus();
        })
        this.invoiceNO = ''
      })
      // const data={
      //   'styleno':'23',
      //   'clrno':'233',
      //   'size':'33',
      //   'qty':0,
      //   'totalqty':0
      // }
      // this.info = data
      // this.msg = msge[4]
    },

    init(){
      getProcess().then((data)=>{
        this.zc = data.map(i=>{return {...i, text: i.name, value: i.id}})
      })
      if(this.process.text!='物流'){
        getLines({
          factoryID: JSON.parse(getSession('userInfo')).factoryID
        }).then((data)=>{
          this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
          this.msg = msge[3]
          this.$nextTick( () => {
            this.$refs.searchInput&&this.$refs.searchInput.focus();
          })
        })
      }else{
        getLines({
          factoryID: JSON.parse(getSession('userInfo')).factoryID
        }).then((data)=>{
          this.cx = data.map(i=>{return {...i, text: i.name, value: i.id}}).slice(0)
          this.msg = msge[1]
        })
      }
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

.out-bound{
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
  &.err{
    background: #f9f2f4;
    color: red;
  }
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
