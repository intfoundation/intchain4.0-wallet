<template>
  <div class="main">
    <div v-if="step==1">
      <div class="bg-box">
        <img  style="margin-top:-80px;width:100%;" src="../../assets/backgroud.jpg" alt="">
      </div>
      <Access @unlock="unlock"></Access>
    </div>
    <div v-if="step==2" style="padding-bottom:90px">
      <div class="bg-box">
        <img  style="margin-top:-80px;width:100%;" src="../../assets/backgroud.jpg" alt="">
      </div>
      <div class="box" >
        <div style="margin:48px 0 0 108px">
          <div class="item">
            <p style="font-size:14px">{{$t('yAddr')}}</p>
            <el-input style="width:420px" readonly v-model="address"></el-input>
          </div>
          <div class="item">
            <p style="font-size:14px">{{$t('weightReward')}}</p>
            <el-input style="width:420px" readonly v-model="weightReward"></el-input>
          </div>
          <div class="item">
            <p style="font-size:14px">{{$t('luckyReward')}}</p>
            <el-input style="width:420px" readonly v-model="luckyReward"></el-input>
          </div>
          <div class="item">
            <p style="font-size:14px">{{$t('partReward')}}</p>
            <el-input style="width:420px" readonly v-model="partReward"></el-input>
          </div>
          <div class="item">
            <p style="font-size:14px">{{$t('receiveAddr')}}</p>
            <el-input style="width:420px"  v-model="receiveAddress" :placeholder="$t('receiveAddr')"></el-input>
          </div>
          <div class="item">
            <p style="font-size:14px">{{$t('totalReward')}}</p>
            <el-input style="width:420px" readonly v-model="totalReward" :placeholder="$t('totalReward')"></el-input>
          </div>
<!--          <div class="item">-->
<!--            <p style="font-size:14px">Gas Limit</p>-->
<!--            <el-input style="width:420px"  v-model="limit" placeholder="Gas Limit"></el-input>-->
<!--          </div>-->
<!--          <div class="item">-->
<!--            <p style="font-size:14px">Gas Price</p>-->
<!--            <el-input style="width:420px"  v-model="price" placeholder="Gas Price"></el-input>-->
<!--          </div>-->
          <!-- <div class="item">
              <el-button @click="dialogVisible=true" class="dnk" type="danger">{{$t('walletInfo.dnk')}}</el-button>
          </div> -->
        </div>
        <el-button @click="sendTx"  class="gt" type="danger">{{$t('wr')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Access from './modules/access'
  import EyeInput from './modules/eyeInput'
  import BigNumber from 'bignumber.js'
  import Axios from 'axios'
  let Utils = require('int4.js').utils
  let rpc = require('../../../int/rpc')
  export default {
    data () {
      return {
        step:1,
        balance:0,
        weightReward: 0,
        luckyReward: 0,
        partReward: 0,
        totalReward: 0,
        address:'',
        privateKey:'',
        toAddress:"0x0000000000000000000000000000000000000000",
        receiveAddress: "",
        amount: 0,
        limit:'30000',
        price:'',

      }
    },
    components: {
      Access,
      EyeInput
    },
    created() {
      this.getGasPrice();
    },
    mounted () {

    },
    methods: {
      getGasPrice(){
        rpc.getGasPrice().then(res=>{
          //this.price = res;
          this.price = new BigNumber(res).dividedBy(Math.pow(10, 18)).toFixed(18).replace(/\.0+$/, "").replace(/(\.\d+[1-9])0+$/, "$1")
        })
      },
      getRewardList() {
        Axios.get('https://titansexplorer.intchain.io/api/reward/getMineReward', {
          params: {address: this.address}
        }).then(res => {
          console.log('reward',res);
          let list = res.data.list;
          if (list.length > 0) {
            this.weightReward = list[0].weightReward || 0;
            this.partReward = list[0].partReward || 0;
            this.luckyReward = list[0].luckyReward || 0;
            this.totalReward = +list[0].weightReward + list[0].partReward + list[0].luckyReward;
          }
        })
      },

      unlock(account){
        console.log("account", account);
        this.step=2;
        this.address = account.address;
        this.privateKey = account.privateKey;
        // this.receiveAddress = Account.fromPrivateTwo(account.privateKey).address;
        this.step = 2;
        rpc.getFullBalance(this.address).then(res=>{
          this.balance =  new BigNumber(parseInt(res.balance,16)).dividedBy(Math.pow(10, 18)).toString()
        })

        this.getRewardList();
      },
      sendTx(){
        if(!Utils.isAddress(this.toAddress)){
          this.info('error',this.$t('errAddr'));
          return;
        }
        if(this.receiveAddress.indexOf('INT1') !== 0){
          this.info('error',this.$t('errAddr'));
          return;
        }
        if(isNaN(this.amount)){
          this.info('error',this.$t('errAmount'));
          return;
        }
        if(isNaN(this.limit)||this.limit<=0){
          this.info('error',this.$t('errLimit'));
          return;
        }
        if(isNaN(this.price)||this.price<0){
          this.info('error',this.$t('errPrice'));
          return;
        }
        rpc.sendSignTx({
          gasPrice:this.price,
          gas:this.limit,
          to:this.toAddress,
          value:this.amount,
          account:{address:this.address,privateKey:this.privateKey},
          data: rpc.stringToHex(this.receiveAddress),
          mine: true
        }).then(res=>{
          this.$alert('hash:'+res, 'success', {
            confirmButtonText: this.$t('confirm'),
            type: 'success'
          });
        });
      }
    }
  }
</script>

<style scoped>
  .info{
    display:inline-block;
    margin-left: 10px;
    margin-top: 50px;
  }
  .int{
    display: inline-block;
    font-size: 18px;
    vertical-align: 5px;
  }
  .item{
    width:540px;
    display: inline-block;
    vertical-align: top;
    height: 118px;
  }
  .gt{
    width:280px;
    height: 44px;
    margin-left: 450px;
    margin-top:50px;
  }
</style>

<style>
  .el-message-box__message p {
    margin: 0;
    line-height: 24px;
    word-break: break-all;
  }
</style>

