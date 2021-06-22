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
              disabled
              v-model="address"
            ></el-input>
          </div>
          <div class="item">
            <p style="font-size: 14px">INT {{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              disabled
              v-model="balance"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">{{ $t("contract") }}</p>
            <el-select
              style="width: 420px"
              v-model="selectContract"
              :placeholder="$t('pleaseSelectContract')"
              value-key="contractAddress"
            >
              <el-option
                v-for="item in contracts"
                :key="item.contractAddress"
                :value="item"
                :label="item.contractAddress"
              >
                <span style="float: left">{{ item.contractAddress }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.amount
                }}</span>
              </el-option>
            </el-select>
          </div>

          <div class="item">
            <p style="font-size: 14px">Token {{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              :placeholder="$t('pleaseSelectContract')"
              disabled
              v-model="selectContract.amount"
            ></el-input>
          </div>

          <div class="item">
            <p style="font-size: 14px">{{ $t("toAddr") }}</p>
            <el-input
              style="width: 420px"
              v-model="toAddress"
              :placeholder="$t('toAddr')"
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
        <el-button @click="sendTx" class="gt" type="danger">{{
          $t("gt")
        }}</el-button>
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
export default {
  data() {
    return {
      step: 1,
      balance: 0,
      address: "",
      privateKey: "",
      contracts: [],
      selectContract: "",
      toAddress: "",
      amount: "",
      limit: "100000",
      price: "",
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
    getGasPrice() {
      rpc.getGasPrice().then((res) => {
        //this.price = res;
        this.price = new BigNumber(res)
          .dividedBy(Math.pow(10, 18))
          .toFixed(18)
          .replace(/\.0+$/, "")
          .replace(/(\.\d+[1-9])0+$/, "$1");
      });
    },
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
      axios
        .get("/api/account/contracts", { params: { address: this.address } })
        .then((res) => {
          this.contracts = res.data;
          if (this.selectContract) {
            for (let c of this.contracts) {
              if (c.contractAddress == this.selectContract.contractAddress) {
                this.selectContract = c;
              }
            }
          }
        });
    },
    sendTx() {
      if (!this.selectContract || !this.selectContract.contractAddress) {
        this.info("error", this.$t("pleaseSelectContract"));
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
      if (this.selectContract.amount < this.amount) {
        this.info("error", this.$t("contractNotEnough"));
        return;
      }
      let data = int4.abi.encodeParams(
        ["address", "uint256"],
        [
          this.toAddress,
          new BigNumber(
            Math.round(
              this.amount * Math.pow(10, this.selectContract.decimalAmount)
            )
          ),
        ]
      );
      let functionSig = int4.abi.methodID("transfer", ["address", "uint256"]);
      rpc
        .sendSignTx({
          gasPrice: this.price,
          gas: this.limit,
          to: this.selectContract.contractAddress,
          value: 0,
          account: { address: this.address, privateKey: this.privateKey },
          data: functionSig + data.substring(2),
        })
        .then((res) => {
          this.$alert("hash:" + res, "success", {
            confirmButtonText: this.$t("confirm"),
            type: "success",
          });
          let timer = setTimeout(() => {
            this.unlock({ address: this.address, privateKey: this.privateKey });
            clearTimeout(timer);
          }, 10000);
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

