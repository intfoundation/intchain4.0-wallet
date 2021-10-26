<template>
  <div class="main">
    <div v-if="step==1">
      <div class="bg-box">
        <img style="margin-top:-80px;width:100%;" src="../../assets/backgroud.jpg" alt />
      </div>
      <Access @unlock="unlock"></Access>
    </div>
    <div v-if="step==2">
      <div
        class="bg-box"
        style="height:270px;width:100%;background:linear-gradient(270deg,rgba(255,92,81,1) 0%,rgba(229,75,64,1) 100%);"
      >
        <div
          style="width:1200px;height:250px;margin:0px auto;text-align: left;color:rgba(255,255,255,1)"
        >
          <div style="width:598px;float:left;">
            <img
              style="height:30px;width:30px;display:inline-block;margin:55px 0 0 65px;vertical-align:top"
              src="../../assets/wallet@2x.png"
              alt
            />
            <div class="info">
              <p style="font-size:18px;margin:0px">{{$t('intBalance')}}</p>
              <p style="font-size:36px;margin:0px">
                <span>{{numFormat(balance,4)}}</span>
                <span class="int">INT</span>
              </p>
              <p style="font-size:18px;margin:0px">≈$ {{numFormat(balance*intPrice,4)}}</p>
            </div>
          </div>
          <div style="width:598px;float:right">
            <img
              style="height:30px;width:30px;display:inline-block;margin:55px 0 0 65px;vertical-align:top"
              src="../../assets/vote@2x.png"
              alt
            />
            <div class="info">
              <p style="font-size:18px;margin:0px">{{$t('votes')}}</p>
              <p style="font-size:36px;margin:0px">
                <span>{{numFormat(stake,4,true)}}</span>
                <span class="int">{{$t('myVote')}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div style="padding-bottom:35px">
        <div class="box" style="height:360px;margin-top:-70px">
          <div style="margin:48px 0 0 108px">
            <div class="item">
              <p style="font-size:14px">{{$t('walletAddress')}}</p>
              <el-input style="width:420px" readonly v-model="address"></el-input>
            </div>
<!--            <div class="item">-->
<!--              <p style="font-size:14px">{{$t('privatekey')}}</p>-->
<!--              <eye-input style="width:420px" readonly v-model="privateKey"></eye-input>-->
<!--            </div>-->
            <div class="item">
              <canvas style="width:156px;height:156px" id="canvas"></canvas>
              <br />
              <p class="scp">{{$t('scp')}}</p>
            </div>
<!--            <div class="item">-->
<!--              <el-button @click="dialogVisible=true" class="dnk" type="danger">{{$t('dnk')}}</el-button>-->
<!--            </div>-->
          </div>
        </div>
      </div>
    </div>

    <el-dialog title :visible.sync="dialogVisible" :close-on-click-modal="false" width="400px">
      <span></span>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <div class="et-item">
          <el-form-item label prop="name">
            <el-input
              v-model="ruleForm.name"
              :placeholder="$t('etWalletName')"
              style="margin-top:12px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="et-item">
          <el-form-item label prop="pwd">
            <eye-input
              @change="onPwdChange"
              style="margin-top:12px"
              v-model="ruleForm.pwd"
              :placeholder="$t('etnpwd')"
            ></eye-input>
          </el-form-item>
        </div>
        <div class="et-item">
          <el-form-item label prop="pwd2">
            <eye-input
              @change="onPwd2Change"
              style="margin-top:12px"
              v-model="ruleForm.pwd2"
              :placeholder="$t('etnpwd2')"
            ></eye-input>
          </el-form-item>
        </div>
        <div class="warn-item" style="margin-top:40px">
          <img src="../../assets/warn@2x.png" class="i-warn" />
          <span class="warn-text">{{$t('warn1')}}</span>
        </div>
        <div class="warn-item">
          <img src="../../assets/warn@2x.png" class="i-warn" />
          <span class="warn-text">{{$t('warn2')}}</span>
        </div>
        <div class="warn-item">
          <img src="../../assets/warn@2x.png" class="i-warn" />
          <span class="warn-text">{{$t('warn3')}}</span>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import axios from "axios";
let rpc = require("../../../int/rpc");
let Keystore = require("int4.js").keystore;
let QRCode = require("qrcode");
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.strTrim(value)) {
        callback(new Error(this.$t("pwdNoSpace")));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.ruleForm.pwd) {
        callback(new Error(this.$t("diffPwd")));
      } else {
        callback();
      }
    };
    return {
      step: 2,
      intPrice: 0,
      balance: 0,
      stake: 0,
      address: "",
      privateKey: "",
      dialogVisible: false,
      ruleForm: {
        name: "",
        pwd: "",
        pwd2: "",
      },
      rules: {
        name: [
          { required: true, message: this.$t("etWalletName"), trigger: "blur" },
        ],
        pwd: [
          { required: true, message: this.$t("etnpwd"), trigger: "blur" },
          { min: 9, message: this.$t("pwdMinLen"), trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        pwd2: [
          { required: true, message: this.$t("etnpwd2"), trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Access,
    EyeInput,
  },
  created() {
    this.getIntPrice();
  },
  mounted() {
    this.connectAccount();
    this.initialize();
  },
  methods: {
    initialize () {
      ethereum.on('chainChanged', (_chainId) => {
        this.getBalance();
      });

      ethereum.on('accountsChanged', (_accounts) => {
        this.address = _accounts[0];
        this.getBalance();
      })
    },
    getIntPrice() {
      axios
        .get("https://titansexplorer.intchain.io/api/wallet/getIntPtice")
        .then((res) => (this.intPrice = res.data));
    },

    async connectAccount () {
      console.log("vue data address", this.$root.$data.address);
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        this.address = accounts[0];
        this.getBalance();
      } catch (e) {
        console.log('request accounts error:', e);
        // this.info("error", this.$t("reqeustAccountsError"));
      }
    },

    getBalance () {
        rpc.getFullBalance(this.address).then((res) => {
          this.balance = parseInt(res.balance, 16);
          this.stake = parseInt(res.delegateBalance, 16);
        });

        this.$nextTick(() => {
          var canvas = document.getElementById("canvas");
          QRCode.toCanvas(canvas, this.address);
          canvas.style.height = "170px";
          canvas.style.width = "170px";
        });
    },
    // unlock(account) {
    //   this.step = 2;
    //   this.address = account.address;
    //   this.privateKey = account.privateKey;
    //   var QRCode = require("qrcode");
    //   this.$nextTick(() => {
    //     var canvas = document.getElementById("canvas");
    //     QRCode.toCanvas(canvas, this.address);
    //     canvas.style.height = "170px";
    //     canvas.style.width = "170px";
    //   });
    //
    //   rpc.getFullBalance(this.address).then((res) => {
    //     this.balance = parseInt(res.balance, 16);
    //     this.stake = parseInt(res.delegateBalance, 16);
    //   });
    // },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.download();
        } else {
          return false;
        }
      });
    },
    download() {
      let linkNode = document.createElement("a");
      linkNode.download = this.ruleForm.name + ".json";
      linkNode.style.display = "none";
      let keystore = Keystore.toV3Keystore(this.privateKey, this.ruleForm.pwd, {});
      let blob = new Blob([JSON.stringify(keystore)]);
      linkNode.href = URL.createObjectURL(blob);
      document.body.appendChild(linkNode);
      linkNode.click();
      document.body.removeChild(linkNode);
      this.dialogVisible = false;
    },
    onPwdChange(val) {
      this.ruleForm.pwd = val;
    },
    onPwd2Change(val) {
      this.ruleForm.pwd2 = val;
    },
  },
};
</script>

<style scoped>
.info {
  display: inline-block;
  margin-left: 10px;
  margin-top: 50px;
}
.int {
  display: inline-block;
  font-size: 18px;
  vertical-align: 5px;
}
.item {
  width: 540px;
  display: inline-block;
  vertical-align: top;
}
#canvas {
  margin-left: -20px;
}
.scp {
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-top: -7px;
}
.dnk {
  width: 280px;
  height: 44px;
  margin-top: 60px;
}
.warn-item {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFangSC;
  font-weight: 400;
  color: rgba(243, 81, 71, 1);
  margin-top: 8px;
  text-align: left;
}
.i-warn {
  display: inline-block;
  vertical-align: top;
  height: 15px;
  width: 15px;
  padding-top: 1px;
}
.warn-text {
  display: inline-block;
  width: 300px;
  vertical-align: top;
}
</style>

