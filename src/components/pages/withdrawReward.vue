<template>
  <div class="main">
    <div v-if="step == 1">
      <div class="bg-box">
        <img
          style="margin-top: -80px; width: 100%"
          src="../../assets/backgroud.jpg"
          alt
        />
      </div>
      <Access @unlock="unlock"></Access>
    </div>
    <div v-if="step == 2" style="padding-bottom: 90px">
      <div class="bg-box">
        <img
          style="margin-top: -80px; width: 100%"
          src="../../assets/backgroud.jpg"
          alt
        />
      </div>
      <div class="box">
        <div style="margin: 48px 0 0 108px">
          <div class="item">
            <p style="font-size: 14px">{{ $t("yAddr") }}</p>
            <el-input
              style="width: 420px"
              readonly
              v-model="address"
            ></el-input>
          </div>
<!--          <div class="item">-->
<!--            <p style="font-size: 14px">{{ $t("balance") }}</p>-->
<!--            <el-input-->
<!--              style="width: 420px"-->
<!--              readonly-->
<!--              v-model="balance"-->
<!--            ></el-input>-->
<!--          </div>-->
          <div class="item">
            <p style="font-size: 14px">{{$t("totalReward")}}</p>
            <el-input
              style="width: 420px"
              readonly
              v-model="totalReward"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{$t("delegateAddress")}}</p>
<!--            <el-input-->
<!--              style="width: 420px"-->
<!--              readonly-->
<!--              v-model="reward"-->
<!--            ></el-input>-->
            <el-select
              @change="changeDelegateAddress(delegateAddress)"
              style="width: 420px"
              v-model="delegateAddress"
              :placeholder="delegateAddress"
            >
              <el-option
                v-for="item in rewardDetail"
                :key="item.address"
                :label="item.address"
                :value="item.address"
              >
                <span style="">{{ item.address }}</span>&nbsp&nbsp
                <span style="float: right;">{{(+item.amount).toFixed(2) }}</span>
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{$t("amount")}}</p>
            <el-input
              style="width: 420px"
              v-model="amount"
            ></el-input>
          </div>
<!--          <div class="item">-->
<!--            <p style="font-size: 14px">Commission</p>-->
<!--            <el-input-->
<!--              style="width: 420px"-->
<!--              v-model="commission"-->
<!--              placeholder="Commission"-->
<!--            ></el-input>-->
<!--          </div>-->
          <div class="item">
            <p style="font-size: 14px">Gas Limit</p>
            <el-input
              style="width: 420px"
              v-model="limit"
              placeholder="Gas Limit"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">Gas Price</p>
            <el-input
              style="width: 420px"
              v-model="price"
              placeholder="Gas Price"
            ></el-input>
          </div>
          <!-- <div class="item">
                        <el-button @click="dialogVisible=true" class="dnk" type="danger">{{$t('walletInfo.dnk')}}</el-button>
          </div>-->
        </div>
        <el-button @click="sendTx" class="gt" type="danger">{{
          $t("gt")
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import BigNumber from "bignumber.js";
import int4 from "int4.js";
const Utils = int4.utils;
let rpc = require("../../../int/rpc");
export default {
  data() {
    return {
      step: 2,
      balance: 0,
      address: "",
      privateKey: "",
      totalReward: 0,
      reward: 0,
      delegateAddress: "",
      rewardDetail: [],
      amount: 0,
      limit: "21000",
      price: "",
    };
  },
  components: {
    Access,
    EyeInput,
  },
  created() {
    // this.getGasPrice();
  },
  mounted() {
    this.connectAccount();
    this.initialize();
  },
  methods: {
    initialize () {
      ethereum.on('chainChanged', (_chainId) => {
        this.rewardDetail = [];
        this.getBalance();
        this.getGasPrice();
        this.getFullBalance();
      });

      ethereum.on('accountsChanged', (_accounts) => {
        this.address = _accounts[0];
        this.rewardDetail = [];
        this.getBalance();
        this.getFullBalance();
      })
    },
    async connectAccount () {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        this.address = accounts[0];
        this.getBalance();
        this.getGasPrice();
        this.getFullBalance();
      } catch (e) {
        console.log('request accounts error:', e);
        // this.info("error", this.$t("reqeustAccountsError"));
      }
    },

    changeDelegateAddress(address) {
      this.delegateAddress = address;
      for (let item of this.rewardDetail) {
        if (item.address === address) {
          this.reward = item.amount;
        }
      }
    },

    getBalance () {
      ethereum
        .request({
          method: 'eth_getBalance',
          params: [this.address]
        })
        .then( (result) => {
            // this.balance = new BigNumber(parseInt(result, 16))
            //   .dividedBy(Math.pow(10, 18))
            //   .toString()
            this.balance = Utils.toINT(result)
          }
        )
        .catch( (error) => {
            console.log('error', error)
          }

        )

    },

    getFullBalance() {
      rpc.getFullBalance(this.address)
        .then(res => {
        console.log('get full balance', res);
        this.totalReward = Utils.toINT(res.rewardBalance);
        for (let key in res.rewardDetail) {
          this.rewardDetail.push({
            address: key,
            amount: Utils.toINT(res.rewardDetail[key])
          });
        }
        console.log('detail', this.rewardDetail);
        })
        .catch( error => {
          console.log('error', error)
          }

        )
    },

    getGasPrice() {
      ethereum
        .request({
          method: 'eth_gasPrice',
          params: []
        })
        .then((result) => {
            console.log('gasprice', result);
            this.price = Utils.toINT(result);
          }
        )
        .catch((error) => {
            console.log('error', error)
          }

        )
    },
    // getGasPrice() {
    //   rpc.getGasPrice().then((res) => {
    //     //this.price = res;
    //     this.price = new BigNumber(res)
    //       .dividedBy(Math.pow(10, 18))
    //       .toFixed(18)
    //       .replace(/\.0+$/, "")
    //       .replace(/(\.\d+[1-9])0+$/, "$1");
    //   });
    // },
    unlock(account) {
      this.step = 2;
      this.address = account.address;
      this.privateKey = account.privateKey;
      this.step = 2;
      rpc.getFullBalance(this.address).then((res) => {
        this.balance = new BigNumber(parseInt(res.balance, 16))
          .dividedBy(Math.pow(10, 18))
          .toString();
      });
    },
    async sendTx() {
      if (isNaN(this.amount)) {
        this.info("error", this.$t("rewardNumber"));
        return;
      }

      if (+this.amount <= 0) {
        this.info("error", this.$t("rewardGt"));
        return;
      }

      let leftReard = this.bn.minus(this.reward, this.amount);
      if (leftReard < 0) {
        this.info("error", this.$t("rewardNotEnough"));
        return;
      }

      if (isNaN(this.limit) || this.limit <= 0) {
        this.info("error", this.$t("errLimit"));
        return;
      }
      if (isNaN(this.price) || this.price < 0) {
        this.info("error", this.$t("errPrice"));
        return;
      }

      if (this.price < 0.000005) {
        this.price = '0.000005'
      }

      if (this.limit < 21000) {
        this.info("error", this.$t("errLimitLess"));
        return;
      }

      if (this.price > 0.00005) {
        this.info("error", this.$t("errPriceBig"));
        return;
      }

      let gasFee = new BigNumber(this.price).multipliedBy(new BigNumber(this.limit));
      if (new BigNumber(gasFee).gt(new BigNumber(this.balance))) {
        this.info("error", this.$t("notEnough"));
        return;
      }


      let functionSig = int4.abi.methodID("WithdrawReward", [
        "address",
        "uint256"
      ]);

      let data = int4.abi.encodeParams(
        ["address", "uint256"],
        [this.delegateAddress, new BigNumber(this.amount).multipliedBy(Math.pow(10, 18))]
      );
      // rpc
      //   .sendSignTx({
      //     gasPrice: this.price,
      //     gas: this.limit,
      //     to: "0x0000000000000000000000000000000000001001",
      //     value: "1000000",
      //     account: { address: this.address, privateKey: this.privateKey },
      //     data: functionSig + data.substring(2),
      //   })
      //   .then((res) => {
      //     this.$alert("hash:" + res, "success", {
      //       confirmButtonText: this.$t("confirm"),
      //       type: "success",
      //     });
      //   })
      //   .catch((err) => {
      //     this.$message.error("Register failed");
      //   });

      const params = [
        {
          from: this.address,
          to: "0x0000000000000000000000000000000000001001",
          gas: Utils.toHex(this.limit),
          gasPrice: Utils.toHex(Utils.fromINT(this.price)),
          value: "0x0",
          data: functionSig + data.substring(2)
        },
      ];

      ethereum
        .request({
          method: 'eth_sendTransaction',
          params,
        })
        .then((result) => {
          console.log('hash', result);
          this.$alert("hash:" + result, "success", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });

          setTimeout(() => {
            this.getBalance();
            this.getFullBalance();
          }, 4000)
        })
        .catch((error) => {
          console.log('tx error', error)
        });
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
  height: 118px;
}
.gt {
  width: 280px;
  height: 44px;
  margin-left: 450px;
  margin-top: 50px;
}
</style>

<style>
.el-message-box__message p {
  margin: 0;
  line-height: 24px;
  word-break: break-all;
}
</style>

