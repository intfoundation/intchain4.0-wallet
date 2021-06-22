<template>
    <div class="main">
        <div v-if="step==1" class="newWallet">
            <div class="left">
                <p class="n-header">{{$t('newWallet')}}</p>
                 <img src="../../assets/newWallet@2x.png"  class="new-wallet">
            </div>
             <div class="right">
                 <span class="cw">{{$t('createWallet')}}</span>
                 <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <!-- <div class="et-item">
                        <span>{{$t('walletName')}} </span>
                        <el-form-item label="" prop="name">
                            <el-input  v-model="ruleForm.name" :placeholder="$t('etWalletName')" style="margin-top:12px"></el-input>
                        </el-form-item>
                    </div> -->
                    <div class="et-item">
                        <span>{{$t('walletPwd')}} </span>
                        <el-form-item label="" prop="pwd">
                            <eye-input @change="onPwdChange" style="margin-top:12px" v-model="ruleForm.pwd" :placeholder="$t('etWalletPwd')"></eye-input>
                        </el-form-item>
                    </div>
                    <div class="et-item">
                        <span>{{$t('repeatWalletPwd')}} </span>
                         <el-form-item label="" prop="pwd2">
                            <eye-input @change="onPwd2Change" style="margin-top:12px" v-model="ruleForm.pwd2" :placeholder="$t('etRepeatWalletPwd')"></eye-input>
                        </el-form-item>
                    </div>
                    <div class="warn-item" style="margin-top:40px">
                        <img src="../../assets/warn@2x.png"  class="i-warn"> <span class="warn-text">{{$t('warn1')}}</span>
                    </div>
                    <div class="warn-item" >
                        <img src="../../assets/warn@2x.png"  class="i-warn"> <span class="warn-text">{{$t('warn2')}}</span>
                    </div>
                    <div class="warn-item" >
                        <img src="../../assets/warn@2x.png"  class="i-warn"> <span class="warn-text">{{$t('warn3')}}</span>
                    </div>
                    <el-button @click="submitForm('ruleForm')" style="margin:30px 0 0 32px;width:280px" type="danger">{{$t('createWallet')}}</el-button>
                </el-form>
            </div>
        </div>
        <div v-if="step==2" class="step2">
            <div class="bg-box">
                 <img  style="margin-top:-80px;width:100%;" src="../../assets/backgroud.jpg" alt="">
            </div>
            <div class="sks-box">
                <div class="sks">
                    <div style="margin-left:100px; text-align: left;">
                        <p style="color: rgba(102, 102, 102, 1);
                                font-size: 34px;padding-top:50px;
                                font-family: PingFangSC-Medium">{{$t('skf')}}</p>
                        <el-button @click="download" style="width:180px;height:50px" type="danger" plain>{{$t('down')}}</el-button>
                        <div class="warn-item" style="margin-top:40px">
                            <img src="../../assets/warn@2x.png"  class="i-warn" style="padding-top:3px">
                             <span style="width:800px;font-size:16px" class="warn-text">{{$t('remind1')}}</span>
                        </div>
                        <div class="warn-item" style="margin-top:20px" >
                            <img src="../../assets/warn@2x.png"  class="i-warn" style="padding-top:3px">
                            <span style="width:800px;font-size:16px" class="warn-text">{{$t('remind2')}}</span>
                        </div>
                        <div class="warn-item" style="margin-top:20px">
                            <img src="../../assets/warn@2x.png"  class="i-warn" style="padding-top:3px">
                            <span style="width:800px;font-size:16px" class="warn-text">{{$t('remind3')}}</span>
                        </div>
                        <el-button @click="step=3" style="width:180px;height:50px;margin-top:40px" type="danger">{{$t('continue')}}</el-button>
                    </div>
                </div>
            </div>
        </div>
         <div v-if="step==3" class="step2">
            <div class="bg-box">
                 <img  style="margin-top:-80px;width:100%;" src="../../assets/backgroud.jpg" alt="">
            </div>
            <div class="sks-box">
                <div class="sks">
                    <div style="margin-left:100px; text-align: left;">
                        <p style="color: rgba(102, 102, 102, 1);
                                font-size: 34px;padding-top:50px;
                                font-family: PingFangSC-Medium">{{$t('spk')}}</p>
                        <div class="pri">
                                {{account.privateKey}}
                        </div>
                        <div class="warn-item" style="margin-top:40px">
                            <img src="../../assets/warn@2x.png"  class="i-warn" style="padding-top:3px">
                             <span style="width:800px;font-size:16px" class="warn-text">{{$t('remind1')}}</span>
                        </div>
                        <div class="warn-item" style="margin-top:20px" >
                            <img src="../../assets/warn@2x.png"  class="i-warn" style="padding-top:3px">
                            <span style="width:800px;font-size:16px" class="warn-text">{{$t('remind2')}}</span>
                        </div>
                        <div class="warn-item" style="margin-top:20px">
                            <img src="../../assets/warn@2x.png"  class="i-warn" style="padding-top:3px">
                            <span style="width:800px;font-size:16px" class="warn-text">{{$t('remind3')}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
 let Account = require("int4.js").account
 let Keystore = require("int4.js").keystore
  import EyeInput from './modules/eyeInput'
  export default {

    components: {
        EyeInput
    },
    data () {
        var validatePass = (rule, value, callback) => {
            if (value !== this.strTrim(value)) {
                callback(new Error(this.$t('pwdNoSpace')));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.ruleForm.pwd) {
                callback(new Error(this.$t('diffPwd')));
            } else {
                callback();
            }
        };
      return {
          account:{},
          keystore:{},
          step:1,
          ruleForm:{
            pwd:'',
            pwd2:''
          },
         rules:{
             pwd:[
                 { required: true, message: this.$t('etWalletPwd'), trigger: 'blur' },
                 { min: 9, message: this.$t('pwdMinLen'), trigger: 'blur' },
                 { validator: validatePass, trigger: 'blur' }
             ],
             pwd2:[
                 { required: true, message: this.$t('etRepeatWalletPwd'), trigger: 'blur' },
                 { validator: validatePass2, trigger: 'blur' }
             ],
         }
      }
    },
    mounted () {
        console.log()

    },
    methods: {
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createWallet();
          } else {
            return false;
          }
        });
      },
      createWallet(){
           let account = Account.create();
           this.account = account;
           this.keystore = Keystore.toV3Keystore(account.privateKey,this.ruleForm.pwd, {});
           this.step = 2;
      },
      download(){
        let linkNode = document.createElement('a');
        linkNode.download = 'UTC--' + new Date().toISOString().replace(/:/g, "-") + "--" + this.account.address + ".json";
        linkNode.style.display = 'none';
        let blob = new Blob([JSON.stringify(this.keystore)]);
        linkNode.href = URL.createObjectURL(blob);
        document.body.appendChild(linkNode);
        linkNode.click();
        document.body.removeChild(linkNode);
      },
      onPwdChange(val){
          this.ruleForm.pwd = val;
      },
      onPwd2Change(val){
          this.ruleForm.pwd2 = val;
      }
    },
    destroyed () {

    }
  }
</script>

<style  scoped>
.main{
    background:rgba(243,243,243,1);
}
  .newWallet{
     width: 1200px;
     padding: 60px 0 98px 0;
     height:600px;
     margin: 0px auto;
 }
 .left{
     height: 600px;
     width: 656px;
     float: left;
     background-color: rgba(255,255,255,1);
     box-shadow:0px 4px 8px 0px rgba(230,230,230,0.6);
     border-radius:4px;
     border:1px solid rgba(230,230,230,1);
    }
  .right{
     height: 544px;
     width: 344px;
     float:right;
     text-align: left;
     background-color: rgba(255,255,255,1);
     box-shadow:0px 4px 8px 0px rgba(230,230,230,0.6);
     border-radius:4px;
     border:1px solid rgba(230,230,230,1);
     padding: 28px;
 }
 .n-header{
    font-size:24px;
    font-family:PingFangSC-Medium,PingFangSC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:33px;
 }
 .new-wallet{
    width:415px;
    height:398px;
    margin-top:30px
 }
 .cw{
    font-size:20px;
    font-family:PingFangSC-Medium,PingFangSC;
    font-weight:500;
    color:rgba(51,51,51,1);
 }
 .et-item{
     margin-top:36px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFangSC;
    font-weight:400;
    color:rgba(51,51,51,1);
 }
 .warn-item{
    font-size:12px;
    font-family:PingFangSC-Regular,PingFangSC;
    font-weight:400;
    color:rgba(243,81,71,1);
    margin-top:8px;
 }
 .i-warn{
     display: inline-block;
     vertical-align: top;
     height: 15px;
     width:15px;
     padding-top:1px;
 }
 .warn-text{
     display: inline-block;
     width: 300px;
     vertical-align: top;
 }
 .bg-box{
     overflow: hidden;
     height:188px;
     width:100%;
 }
 .sks-box{
      background:rgba(243,243,243,1);
      height: auto;
      width: 100%;
      padding-bottom:90px;
 }
 .sks{
    width:1200px;
    height:556px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    margin: -120px auto 0px auto;
    position: relative;
 }
 .pri{
    margin-top: 20px;
    width: 800px;
    height: 100px;
    border-radius: 4px;
    background-color: rgba(247, 247, 247, 1);
    border: 1px solid rgba(204, 204, 204, 1);
    color: rgba(102, 102, 102, 1);
    font-size: 16px;
    font-family: PingFangSC-Regular;
    padding: 16px 24px;
 }
</style>
