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
            <p style="font-size: 18px">{{isINTToBSC ? "INT Chain" : "Binance Smart Chain"}}</p>
<!--            <el-input-->
<!--              style="width: 420px"-->
<!--              v-model="address"-->
<!--            ></el-input>-->
            <el-select
              @change="changeFromOptions(fromCoin)"
              style="width: 420px"
              v-model="fromCoin"
              :placeholder="fromCoin"
            >
              <template v-if="isINTToBSC">
                <el-option
                  v-for="item in intList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <span style="float: left; color: #e73737;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.address
                }}</span>
                </el-option>
              </template>
              <template v-else>
                <el-option
                  v-for="item in bscList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <span style="float: left; color: #e73737;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.address
                }}</span>
                </el-option>
              </template>
            </el-select>
            <img @click="changeDirection" class="exchange" src="../../assets/exchange.png" alt="">
          </div>
          <div class="item">
            <p style="font-size: 18px">{{isINTToBSC ? "Binance Smart Chain" : "INT Chain"}}</p>
<!--            <el-input-->
<!--              style="width: 420px"-->
<!--              v-model="balance"-->
<!--            ></el-input>-->
            <el-select
              @change="changeToOptions(toCoin)"
              style="width: 420px"
              v-model="toCoin"
              :placeholder="toCoin"
            >
              <template v-if="isINTToBSC">
                <el-option
                  v-for="item in bscList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <span style="float: left; color: #e73737;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.address
                }}</span>
                </el-option>
              </template>
              <template v-else>
                <el-option
                  v-for="item in intList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"
                >
                  <span style="float: left; color: #e73737;">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.address
                }}</span>
                </el-option>
              </template>
            </el-select>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{ $t("yAddr") }}</p>
            <el-input
              style="width: 420px"
              readonly
              v-model="address"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{isINTToBSC ? "INT" : "BNB"}} {{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              readonly
              v-model="balance"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">{{ $t("contract") }}</p>
            <el-input
              style="width: 420px"
              :placeholder="$t('contract')"
              readonly
              v-model="fromContractAddr"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">Token {{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              :placeholder="$t('contract')"
              readonly
              v-model="tokenBalance"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">{{ $t("receiveAddress") }}</p>
            <el-input
              style="width: 420px"
              readonly
              v-model="address"
              :placeholder="$t('receiveAddress')"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{ $t("amount") }}</p>
            <el-input
              style="width: 420px"
              v-model="amount"
              :placeholder="$t('amount')"
            ></el-input>
          </div>
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
        <el-button @click="sendTx" class="gt" type="danger">
          {{ $t("gt") }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import BigNumber from "bignumber.js";
import int4 from "int4.js";
let rpc = require("../../../int/rpc");
let erpc = require("../../../eth/rpc");
let brpc = require("../../../bsc/rpc");
export default {
  data() {
    return {
      step: 1,
      balance: 0,
      address: "",
      privateKey: "",
      contracts: [],
      selectContract: "",
      toAddress: "0x17C801AA5841D2f481Af1bab82768e97b102AA95",
      amount: 0,
      limit: "100000",
      price: "",
      intList:[
        {"name": "INT", "address": ""},
        {"name": "BTC", "address": "0xb230cba4ce0509c01515391f2cfdfe56ae322956"},
        {"name": "ETH", "address": "0xf4a7a68c04c8e94f4d399639966a95323dc32d8b"}
      ],
      ethList:[
        {"name": "EINT", "address": "0x9779b6f93dcd9ef455bedfd442404f680bd8246e"},
        {"name": "WBTC", "address": "0x2a223d92494ec26e49e3d2b035f4a3c93097fd2f"},
        {"name": "WETH", "address": "0x7564b3244270161cce125f44ffa0230aefd4a2d9"}
      ],
      bscList:[
        {"name": "BINT", "address": "0xcf555062c986305bb9f5887f565a5d71bebc4c42"},
        {"name": "WBTC", "address": "0x462b8aa34a02367d3558a985e80ab7eaf24b5f1d"},
        {"name": "WETH", "address": "0x8e4de294b2020b4c82aabff6e702d7dd57a21a0e"}
      ],
      fromCoin: "INT",
      fromContractAddr: "",
      toCoin: "BINT",
      isINTToETH: true,
      isINTToBSC: true,
      tokenBalance: 0,
      tokenDecimals: 0,
    };
  },
  components: {
    Access,
    EyeInput,
  },
  created() {
    this.getGasPrice();
  },
  mounted() {},
  methods: {
    changeDirection() {
      console.log("is INT to BSC", this.isINTToBSC, this.fromCoin, this.toCoin)
      this.isINTToBSC = !this.isINTToBSC;
      [this.fromCoin, this.toCoin] = [this.toCoin, this.fromCoin];
      console.log("is INT to BSC", this.isINTToBSC, this.fromCoin, this.toCoin)
      let list = this.isINTToBSC ? this.intList : this.bscList;
      for (let value of list) {
        if (this.fromCoin === value.name) {
          this.fromContractAddr = value.address;
        }
      }

      this.getGasPrice();
      this.getBalance(this.address);
      this.getTokenBalance(this.address, this.fromContractAddr);
    },
    changeFromOptions(param) {
      console.log("param", param);

      if (this.isINTToBSC) {
        this.intList.forEach((value, index) => {
          if(value.name === param) {
            console.log("value", value);
            this.toCoin = this.bscList[index].name;
            this.fromContractAddr = value.address;
          }
        })
      } else {
        this.bscList.forEach((value, index) => {
          if(value.name === param) {
            console.log("value", value);
            this.toCoin = this.intList[index].name;
            this.fromContractAddr = value.address;
          }
        })
      }

      this.getGasPrice();
      // this.getBalance(this.address);
      this.getTokenBalance(this.address, this.fromContractAddr);

    },
    changeToOptions(param) {
      console.log("param", param);

      if (this.isINTToBSC) {
        this.bscList.forEach((value, index) => {
          if(value.name === param) {
            console.log("value", value);
            this.fromCoin = this.intList[index].name;
            this.fromContractAddr = this.intList[index].address;
          }
        })
      } else {
        this.intList.forEach((value, index) => {
          if(value.name === param) {
            console.log("value", value);
            this.fromCoin = this.bscList[index].name;
            this.fromContractAddr = this.bscList[index].address;
          }
        })
      }

      this.getGasPrice();
      // this.getBalance(this.address);
      this.getTokenBalance(this.address, this.fromContractAddr);
    },
    getGasPrice() {
      if (this.isINTToBSC) {
        rpc.getGasPrice().then((res) => {
          //this.price = res;
          this.price = new BigNumber(res)
            .dividedBy(Math.pow(10, 18))
            .toFixed(18)
            .replace(/\.0+$/, "")
            .replace(/(\.\d+[1-9])0+$/, "$1");
        });
      } else {
        brpc.getGasPrice().then((res) => {
          //this.price = res;
          this.price = new BigNumber(res)
            .dividedBy(Math.pow(10, 18))
            .toFixed(18)
            .replace(/\.0+$/, "")
            .replace(/(\.\d+[1-9])0+$/, "$1");
        });
      }

    },
    unlock(account) {
      this.step = 2;
      this.address = account.address;
      this.privateKey = account.privateKey;
      this.step = 2;
      this.getBalance(this.address);
      this.getTokenBalance(this.address, this.fromContractAddr)
    },

    getBalance(address) {
      if (this.isINTToBSC) {
        rpc.getBalance(address).then((res) => {
          console.log("rpc get balance", res);
          this.balance = new BigNumber(parseInt(res, 16))
            .dividedBy(Math.pow(10, 18))
            .toString();
        });
      } else {
        brpc.getBalance(address).then((res) => {
          console.log("brpc get balance", res);
          this.balance = new BigNumber(parseInt(res, 16))
            .dividedBy(Math.pow(10, 18))
            .toString();
        });
      }
    },

    getTokenBalance(address, contractAddress) {
      if (contractAddress === "") {
        this.tokenBalance = 0;
        return
      }

      if (this.isINTToBSC) {
        rpc.getTokenBalance({address, contractAddress}).then(async (res) => {
          this.tokenDecimals = await rpc.getTokenDecimals(contractAddress);
          this.tokenBalance = new BigNumber(parseInt(res, 16))
            .dividedBy(Math.pow(10, this.tokenDecimals))
            .toString();
        });
      } else {
        brpc.getTokenBalance({address, contractAddress}).then(async (res) => {
          this.tokenDecimals = await brpc.getTokenDecimals(contractAddress);
          this.tokenBalance = new BigNumber(parseInt(res, 16))
            .dividedBy(Math.pow(10, this.tokenDecimals))
            .toString();
        });
      }
    },

    sendTx() {
      if (!this.address || !this.privateKey) {
        this.info("error", this.$t("pleaseUnlockAccount"));
        return;
      }
      if (!int4.utils.isAddress(this.toAddress)) {
        this.info("error", this.$t("errAddr"));
        return;
      }
      if (isNaN(this.amount) || this.amount <= 0) {
        this.info("error", this.$t("errAmount"));
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

      if (this.limit < 21000) {
        this.info("error", this.$t("errLimitLess"));
        return;
      }

      if (this.price > 0.00005) {
        this.info("error", this.$t("errPriceBig"));
        return;
      }

      let transferAmount = (this.isINTToETH && this.fromContractAddr === "") ? this.balance : this.tokenBalance;

      if (transferAmount < this.amount) {
        this.info("error", this.$t("notEnough"));
        return;
      }


      if (this.isINTToBSC && this.fromContractAddr === "") {
        // transfer INT
        let gasFee = new BigNumber(this.price).multipliedBy(new BigNumber(this.limit));
        if (new BigNumber(this.amount).plus(gasFee).gt(new BigNumber(this.balance))) {
          this.info("error", this.$t("notEnough"));
          return;
        }

        rpc.sendSignTx({
          gasPrice: this.price,
          gas: this.limit,
          to: this.toAddress,
          value: this.amount,
          account: { address: this.address, privateKey: this.privateKey },
          exchange: true,
          direction: 3
        }).then((res) => {
          this.$alert("hash:" + res, "success", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });
          let timer = setTimeout(() => {
            this.amount = 0;
            this.unlock({ address: this.address, privateKey: this.privateKey });
            this.getBalance(this.address);
            this.getTokenBalance(this.address, this.fromContractAddr)
            clearTimeout(timer);
          }, 3000);
        });

      } else {
        // transfer token
        let data = int4.abi.encodeParams(
          ["address", "uint256"],
          [
            this.toAddress,
            new BigNumber(
              Math.round(
                this.amount * Math.pow(10, this.tokenDecimals)
              )
            ),
          ]
        );
        let functionSig = int4.abi.methodID("transfer", ["address", "uint256"]);
        if (this.isINTToBSC) {
          rpc
            .sendSignTx({
              gasPrice: this.price,
              gas: this.limit,
              to: this.fromContractAddr,
              value: 0,
              account: { address: this.address, privateKey: this.privateKey },
              data: functionSig + data.substring(2),
              exchange: true,
              direction: 3
            })
            .then((res) => {
              this.$alert("hash:" + res, "success", {
                confirmButtonText: this.$t("confirm"),
                type: "success",
              });
              let timer = setTimeout(() => {
                this.amount = 0;
                this.unlock({ address: this.address, privateKey: this.privateKey });
                this.getBalance(this.address);
                this.getTokenBalance(this.address, this.fromContractAddr)
                clearTimeout(timer);
              }, 3000);
            });
        } else {
          brpc
            .sendSignTx({
              gasPrice: this.price,
              gas: this.limit,
              to: this.fromContractAddr,
              value: 0,
              account: { address: this.address, privateKey: this.privateKey },
              data: functionSig + data.substring(2),
              exchange: true,
              direction: 4
            })
            .then((res) => {
              this.$alert("hash:" + res, "success", {
                confirmButtonText: this.$t("confirm"),
                type: "success",
              });

              let timer = setTimeout(() => {
                this.amount = 0;
                this.unlock({ address: this.address, privateKey: this.privateKey });
                this.getBalance(this.address);
                this.getTokenBalance(this.address, this.fromContractAddr)
                clearTimeout(timer);
              }, 3000);
            });
        }

      }
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

.exchange {
  width: 20px;
  margin-left: 50px;
  cursor: pointer;
  vertical-align: middle;
}
</style>

<style>
.el-message-box__message p {
  margin: 0;
  line-height: 24px;
  word-break: break-all;
}
</style>

