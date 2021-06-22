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
          <div style="width: 970px" class="item">
            <p style="font-size: 14px">{{ $t("balance") }}</p>
            <el-input
              style="width: 420px"
              readonly
              v-model="balance"
            ></el-input>
            <el-button
              @click="refresh"
              style="float: right"
              type="primary"
              icon="el-icon-refresh"
              circle
            ></el-button>
          </div>
          <el-table
            :data="nodes"
            style="width: 90%"
            :default-sort="{ prop: 'total_staked', order: 'descending' }"
          >
            <el-table-column
              prop="moniker"
              :label="$t('name')"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="address"
              :label="$t('address')"
            ></el-table-column>
            <el-table-column
              prop="total_staked"
              :label="$t('totalVotes')"
              sortable
            ></el-table-column>
            <el-table-column prop="voted" :label="$t('myVotes')">
              <template slot-scope="scope">
                <p v-if="scope.row.proxiedBalance != '0'">
                  {{ $t("notEffective") }}:{{ scope.row.proxiedBalance }}
                </p>
                <p v-if="scope.row.voted != '0'">
                  {{ $t("effective") }}:{{ scope.row.voted }}
                </p>
                <p v-if="scope.row.pendingRefundBalance != '0'">
                  {{ $t("withdrawn") }}:{{ scope.row.pendingRefundBalance }}
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="reward"
              :label="$t('reward')"
              sortable
            ></el-table-column>
            <el-table-column fixed="right" :label="$t('operation')" width="170">
              <template slot-scope="scope">
                <el-button @click="voted(scope.row)" type="text" size="small">{{
                  $t("vote")
                }}</el-button>
                <el-button
                  :disabled="
                    scope.row.proxiedBalance <= 0 && scope.row.voted <= 0
                  "
                  @click="unstake(scope.row)"
                  type="text"
                  size="small"
                  >{{ $t("withdrawnVote") }}</el-button
                >
                <el-button
                  :disabled="scope.row.reward <= 0"
                  @click="getReward(scope.row)"
                  type="text"
                  size="small"
                  >{{ $t("receiveRewards") }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Access from "./modules/access";
import EyeInput from "./modules/eyeInput";
import BigNumber from "bignumber.js";
import axios from "axios";
let rpc = require("../../../int/rpc");
let Abi = require("int4.js").abi;
let Web3 = require("web3");
export default {
  data() {
    return {
      step: 1,
      balance: 0,
      address: "",
      privateKey: "",
      toAddress: "",
      amount: "",
      limit: "30000",
      price: "",
      nodes: [],
    };
  },
  components: {
    Access,
    EyeInput,
  },
  created() {
    this.getGasPrice();
    this.getNodes();
  },
  mounted() {},
  methods: {
    stringToHex(str) {
      var val = "0x";
      for (var i = 0; i < str.length; i++) {
        if (val == "") {
          val = str.charCodeAt(i).toString(16);
        } else {
          val += str.charCodeAt(i).toString(16);
        }
      }
      return val;
    },
    voted(row) {
      this.$prompt(this.$t("etAmount"), "", {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        inputValidator: (val) => {
          if (isNaN(val)) {
            return this.$t("mNum");
          }
          if (+val <= 0) {
            return this.$t("gt0");
          }
          if (+val + this.limit * this.price >= this.balance) {
            return this.$t("notEnough");
          }
        },
      }).then(({ value }) => {
        let data = Abi.encodeParams(["address"], [row.address]).substring(2);
        let functionSig = Web3.utils.sha3("Delegate(address)").substr(2, 8);
        rpc
          .sendSignTx({
            gasPrice: this.price,
            gas: this.limit,
            to: "0x0000000000000000000000000000000000001001",
            value: value,
            account: { address: this.address, privateKey: this.privateKey },
            data: "0x" + functionSig + data,
          })
          .then((res) => {
            this.$alert("hash:" + res, "success", {
              confirmButtonText: this.$t("confirm"),
              type: "success",
            });
          });
      });
    },
    unstake(row) {
      this.$prompt(this.$t("etAmount"), "", {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        inputValidator: (val) => {
          if (isNaN(val)) {
            return this.$t("cmNum");
          }
          if (+val <= 0) {
            return this.$t("cgt");
          }

          if (this.limit * this.price > this.balance) {
            return this.$t("notEnough");
          }
          let surplusVotes = this.bn.minus(
            this.bn.add(row.proxiedBalance, row.voted),
            this.bn.add(row.pendingRefundBalance, row.val)
          );
          if (surplusVotes < 0) {
            return this.$t("surplusVotes");
          }
        },
      }).then(({ value }) => {
        let data = Abi.encodeParams(["address", "uint256"], [row.address,"0x" + new BigNumber(value).multipliedBy(Math.pow(10, 18)).toString(16)]).substring(2);
        let functionSig = Web3.utils
          .sha3("UnDelegate(address,uint256)")
          .substr(2, 8);
        rpc
          .sendSignTx({
            gasPrice: this.price,
            gas: this.limit,
            to: "0x0000000000000000000000000000000000001001",
            value: "0",
            account: { address: this.address, privateKey: this.privateKey },
            data: "0x" + functionSig + data,
          })
          .then((res) => {
            this.$alert("hash:" + res, "success", {
              confirmButtonText: this.$t("confirm"),
              type: "success",
            });
          });
      });
    },
    getReward(row) {
      this.$prompt(this.$t("etAmount"), "", {
        confirmButtonText: this.$t("confirm"),
        cancelButtonText: this.$t("cancel"),
        inputValidator: (val) => {
          if (isNaN(val)) {
            return this.$t("rewardNumber")
          }

          if (+val <= 0) {
            return this.$t("rewardGt")
          }

          let leftReard = this.bn.minus(row.reward, val);
          if (leftReard < 0) {
            return this.$t("rewardNotEnough")
          }
        }
      }).then(({ value }) => {
        let data = Abi.encodeParams(["address", "uint256"], [row.address, "0x" + new BigNumber(value).multipliedBy(Math.pow(10, 18)).toString(16)]).substring(2);
        let functionSig = Web3.utils
          .sha3("WithdrawReward(address,uint256)")
          .substr(2, 8);
        rpc
          .sendSignTx({
            gasPrice: this.price,
            gas: this.limit,
            to: "0x0000000000000000000000000000000000001001",
            value: "0",
            account: { address: this.address, privateKey: this.privateKey },
            data: "0x" + functionSig + data,
          })
          .then((res) => {
            this.$alert("hash:" + res, "success", {
              confirmButtonText: this.$t("confirm"),
              type: "success",
            });
          });
      });
    },
    getNodes() {
      axios
        .get("/api/node/validators", { params: { pageSize: 100000 } })
        .then((res) => {
          if (!this.nodes.length) {
            this.nodes = res.data.list;
          } else {
            for (let l of res.data.list) {
              let flag = false;
              for (let n of this.nodes) {
                if (n.id == l.id) {
                  flag = true;
                  n.bondedTokens = l.bondedTokens;
                }
              }
              if (!flag) {
                this.nodes.push(l);
              }
            }
          }
        });
    },
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
      this.addrVoteRecord();
      this.getFullBalance();
      this.refresh();
    },
    addrVoteRecord() {
      axios
        .get("/api/account/addrVoteRecord", {
          params: { address: this.address },
        })
        .then((res) => {
          let nodes = [];
          for (let n of this.nodes) {
            n.proxiedBalance = 0;
            n.voted = 0;
            n.pendingRefundBalance = 0;
            for (let l of res.data) {
              if (l.candidate == n.address) {
                n.proxiedBalance = l.proxied_balance.toString()
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d+[1-9])0+$/, "$1");
                n.voted = l.deposit_proxied_balance.toString()
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d+[1-9])0+$/, "$1");
                n.pendingRefundBalance = l.pending_refund_balance.toString()
                  .replace(/\.0+$/, "")
                  .replace(/(\.\d+[1-9])0+$/, "$1");
              }
            }
            nodes.push(n);
          }
          this.nodes = nodes;
        });
    },
    getFullBalance() {
      rpc.getFullBalance(this.address).then((res) => {
        this.balance = new BigNumber(parseInt(res.balance, 16))
          .dividedBy(Math.pow(10, 18))
          .toString();
        if (res.rewardDetail) {
          let nodes = [];
          for (let n of this.nodes) {
            n.reward = 0;
            for (let key in res.rewardDetail) {
              if (key == n.address) {
                n.reward = new BigNumber(res.rewardDetail[key])
                  .dividedBy(Math.pow(10, 18))
                  .toString();
              }
            }
            nodes.push(n);
          }
          this.nodes = nodes;
        }
      });
    },
    refresh() {
      //setInterval(() => {
      this.getNodes();
      this.addrVoteRecord();
      this.getFullBalance();
      //}, 1000);
    },
  },
};
</script>

<style scoped>
.box {
  height: auto;
}
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

