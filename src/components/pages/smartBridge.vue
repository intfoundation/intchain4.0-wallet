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
            <p style="font-size: 18px">From Chain</p>
            <el-select
              @change="changeFromOptions(fromChainId)"
              style="width: 420px"
              v-model="fromChainId"
            >
              <template>
                <el-option
                  v-for="item in chains"
                  :key="item.name"
                  :label="item.name"
                  :value="item.chainId"
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
            <p style="font-size: 18px">To Chain</p>
            <el-select
              @change="changeToOptions(toChainId)"
              style="width: 420px"
              v-model="toChainId"
            >
              <template>
                <el-option
                  v-for="item in chains"
                  :key="item.name"
                  :label="item.name"
                  :value="item.chainId"
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
            <p style="font-size: 14px">{{$t("chooseToken")}}</p>
            <el-select
              @change="changeToken(fromCoin)"
              style="width: 420px"
              v-model="fromCoin"
              :placeholder="fromCoin"
            >
              <el-option
                v-for="item in tokenList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
                <img style="width: 22px; vertical-align: middle;" :src="item.url" alt="">
                <span style="color: #e73737;">{{ item.name }}</span>
                <span style="float: right;">{{item.amount}}</span>
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <p style="font-size: 14px">{{ $t("amount") }}</p>
            <el-input
              style="width: 420px"
              v-model="amount"
              :placeholder="0.0"
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
const Utils = int4.utils;
let rpc = require("../../../int/rpc");
let erpc = require("../../../eth/rpc");

const intUrl = require("../../assets/coins/INT.png");
const btcUrl = require("../../assets/coins/BTC.png");
const ethUrl = require("../../assets/coins/ETH.png");
export default {
  data() {
    return {
      step: 2,
      balance: 0,
      address: "",
      privateKey: "",
      contracts: [],
      selectContract: "",
      toAddress: "0x17C801AA5841D2f481Af1bab82768e97b102AA95",
      amount: "",
      limit: "100000",
      price: "",
      chains: [
        {chainId: "0x800", name: "INT Chain"},
        {chainId: "0x3", name: "Ethereum"},
        {chainId: "0x61", name: "Binance Smart Chain"}
      ],
      intList:[
        {"name": "INT", "address": "", url: intUrl, amount: 0, decimals: 18},
        {"name": "BTC", "address": "0xb230cba4ce0509c01515391f2cfdfe56ae322956", "url": btcUrl, amount: 0, decimals: 18},
        {"name": "ETH", "address": "0xf4a7a68c04c8e94f4d399639966a95323dc32d8b", "url": ethUrl, amount: 0, decimals: 18}
      ],
      ethList:[
        {"name": "INT", "address": "0x7408af64bc449029badcf763c8dedfd85af8ae73", "url": intUrl, amount: 0, decimals: 18},
        {"name": "WBTC", "address": "0x2a223d92494ec26e49e3d2b035f4a3c93097fd2f", "url": btcUrl, amount: 0, decimals: 18},
        {"name": "WETH", "address": "0x7564b3244270161cce125f44ffa0230aefd4a2d9", "url": ethUrl, amount: 0, decimals: 18}
      ],
      bscList:[
        {"name": "INT", "address": "0xcf555062c986305bb9f5887f565a5d71bebc4c42", "url": intUrl, amount: 0, decimals: 18},
        {"name": "BTC", "address": "0x462b8aa34a02367d3558a985e80ab7eaf24b5f1d", "url": btcUrl, amount: 0, decimals: 18},
        {"name": "ETH", "address": "0x8e4de294b2020b4c82aabff6e702d7dd57a21a0e", "url": ethUrl, amount: 0, decimals: 18}
      ],
      tokenList: [],
      fromChainId: "0x800",
      // fromChain: "INT Chain",
      fromCoin: "",
      fromContractAddr: "",
      toChainId: "0x3",
      // toChain: "Ethereum",
      toCoin: "",
      direction: 0,
      isINT: true,
      isETH: false,
      isBSC: false,
      tokenBalance: 0,
      tokenDecimals: 0,
      chainParams: {
        "0x800": [{
          chainId: '0x800',
          chainName: 'INT Chain Testnet',
          nativeCurrency: {
            name: "INT",
            symbol: "INT",
            decimals: 18
          },
          rpcUrls: ["https://testnet.titansrpc.intchain.io"],
          blockExplorerUrls: ['https://test.titansexplorer.intchain.io']
        }],
        "0x61": [{
          chainId: '0x61',
          chainName: 'Binance Testnet',
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          blockExplorerUrls: ['https://testnet.bscscan.com/']
        }]
      }
    };
  },
  components: {
    Access,
    EyeInput,
  },
  watch: {
    fromChainId: function (newId, oldId) {
      // console.log("from chain id", "new id", newId, "old id", oldId, "fromChainId", this.fromChainId, "toChainId", this.toChainId)
      if (newId === this.toChainId) {
        this.toChainId = oldId
      }
      this.switchToEtheruemChain(this.fromChainId);
    },
    toChainId: function (newId, oldId) {
      // console.log("to chain id", "new id", newId, "old id", oldId,  "fromChainId", this.fromChainId, "toChainId", this.toChainId)
      if (newId === this.fromChainId) {
        this.fromChainId = oldId
        this.switchToEtheruemChain(this.fromChainId);
      }
    }
  },
  created() {
    this.tokenList = this.intList;
    this.initialize();
    this.$nextTick(async () => {
      await this.connectAccount();
      await this.switchToEtheruemChain(this.fromChainId);
    })
  },
  mounted() {},
  methods: {
    initialize () {
      ethereum.on('chainChanged', (_chainId) => {
        // console.log('chain changed', _chainId);
        this.switchToEtheruemChain(_chainId);
      });

      ethereum.on('accountsChanged', async (_accounts) => {
        // console.log('account changed', _accounts);
        this.address = _accounts[0];
        await this.getBalance();
        await this.getTokenBalance();
      })
    },

    changeDirection() {
      // console.log("change direction", this.isINT, this.isETH, this.isBSC, this.fromChainId, this.toChainId);
      [this.fromChainId, this.toChainId] = [this.toChainId, this.fromChainId];
      this.switchToEtheruemChain(this.fromChainId);
    },

    changeFromOptions(param) {
      // console.log("param", param);
      // console.log("change from options", this.isINT, this.isETH, this.isBSC, this.fromChainId, this.toChainId);
      // this.changeTokenList();
    },
    changeTokenList() {
      if (this.fromChainId === "0x800") {
        this.isINT = true;
        this.isETH = false;
        this.isBSC = false;
        this.tokenList = this.intList;
      }

      if (this.fromChainId === "0x3") {
        this.isINT = false;
        this.isETH = true;
        this.isBSC = false;
        this.tokenList = this.ethList;
      }

      if (this.fromChainId === "0x61") {
        this.isINT = false;
        this.isETH = false;
        this.isBSC = true;
        this.tokenList = this.bscList;
      }
      // console.log("change token list", this.isINT, this.isETH, this.isBSC, this.fromChainId, this.toChainId);

      this.getGasPrice();
      this.getTokenBalance();
      this.changeToken(this.fromCoin)
    },
    changeToOptions(param) {
      // console.log("param", param);
      // console.log("change to options", this.isINT, this.isETH, this.isBSC, this.fromChainId, this.toChainId);
      // this.changeTokenList();
    },

    changeToken(token) {
      for (let l of this.tokenList) {
        if (token === l.name) {
          this.tokenBalance = l.amount;
          this.tokenDecimals = l.decimals;
          this.fromContractAddr = l.address;
        }
      }
    },

    getGasPrice() {
      ethereum
        .request({
          method: 'eth_gasPrice',
          params: []
        })
        .then((result) => {
            // console.log('gasprice', result);
            this.price = Utils.toINT(result);
          }
        )
        .catch((error) => {
            console.log('error', error)
          }

        )
    },
    unlock(account) {
      this.step = 2;
      this.address = account.address;
      this.privateKey = account.privateKey;
      this.step = 2;
      this.getBalance();
      this.getTokenBalance()
    },

    async connectAccount () {
      try {
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        this.address = accounts[0];
        await this.getBalance();
        await this.getGasPrice();
        await this.getTokenBalance();
        this.changeToken(this.fromCoin);
      } catch (e) {
        console.log('request accounts error:', e);
      }
    },

    async getBalance () {
      try {
        const b = await ethereum.request({
          method: 'eth_getBalance',
          params: [this.address]
        });
        this.balance = Utils.toINT(b)
      } catch (e) {
        console.log('get balance error:', e)
      }
    },

    async getTokenBalance() {
      for (let token of this.tokenList) {
        if (token.address === "") {
          token.amount = this.balance;
        } else {
          let decimalsSig = int4.abi.methodID('decimals', []);
          let params1 = [
            {
              from: this.address,
              to: token.address,
              // value: "0x0",
              data: decimalsSig
            },
          ];

          let d = await ethereum.request({
            method: 'eth_call',
            params: params1
          })
          // console.log('decimals', d);
          token.decimals = parseInt(d, 16);

          let functionSig = int4.abi.methodID("balanceOf", ["address"]);
          let data = int4.abi.encodeParams(["address"], [this.address]);
          let params2 = [
            {
              from: this.address,
              to: token.address,
              // value: "0x0",
              data: functionSig + data.substring(2)
            },
          ];

          let b = await ethereum.request({
            'method': 'eth_call',
            params: params2
          })

          token.amount = new BigNumber(parseInt(b, 16)).dividedBy(Math.pow(10, d)).toString(10);
          // console.log('token amount', token.amount)
        }
      }
    },

    async switchToEtheruemChain (chainId) {
      let vm = this;
      const oldChainId = await ethereum.request({ method: 'eth_chainId' });
      if (oldChainId !== chainId) {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId}]
          });

          vm.getGasPrice();
          vm.getBalance();
          vm.changeTokenList();
          vm.fromCoin = "";
          vm.amount = 0;
        } catch (e) {
          if (e.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: vm.chainParams[chainId]
              });

              vm.getGasPrice();
              vm.getBalance();
              vm.changeTokenList();
              vm.fromCoin = "";
              vm.amount = 0;
            } catch (e) {
              console.log('add network error', e)
            }
          }
        }
      }

    },
    chainToDirection(fromChain, toChain) {
      const key = `${fromChain}to${toChain}`;
      switch (key) {
        case '0x800to0x3':
          this.direction = 1;
          break;
        case '0x3to0x800':
          this.direction = 2;
          break;
        case '0x800to0x61':
          this.direction = 3;
          break;
        case '0x61to0x800':
          this.direction = 4;
          break;
        case '0x3to0x61':
          this.direction = 5;
          break;
        case '0x61to0x3':
          this.direction = 6;
          break;
        default:
          console.log('no match direction')

      }
    },
    sendTx() {
      if (!this.address) {
        this.info("error", this.$t("pleaseUnlockAccount"));
        return;
      }
      if (!int4.utils.isAddress(this.toAddress)) {
        this.info("error", this.$t("errAddr"));
        return;
      }
      if (isNaN(this.amount) || this.amount < 0) {
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

      let transferAmount = this.fromContractAddr === "" ? this.balance : this.tokenBalance;

      if (new BigNumber(this.amount).gt(new BigNumber(transferAmount))) {
        this.info("error", this.$t("notEnough"));
        return;
      }

      this.chainToDirection(this.fromChainId, this.toChainId);

      let vm = this;
      if (vm.fromContractAddr === "") {
        // transfer INT
        let gasFee = new BigNumber(this.price).multipliedBy(new BigNumber(this.limit));
        if (new BigNumber(this.amount).plus(gasFee).gt(new BigNumber(this.balance))) {
          this.info("error", this.$t("notEnough"));
          return;
        }

        const params = [
          {
            from: this.address,
            to: this.toAddress,
            gas: Utils.toHex(this.limit),
            gasPrice: Utils.toHex(Utils.fromINT(this.price)),
            value: Utils.toHex(Utils.fromINT(this.amount)),
          },
        ];

        ethereum
          .request({
            method: 'eth_sendTransaction',
            params,
          })
          .then((result) => {
            console.log('hash', result);
            const data = {
              body: {from: vm.address, hash: result},
              url: "",
              isInt: vm.isINT,
              isEth: vm.isETH,
              isBsc: vm.isBSC,
              exchange: true,
              direction: vm.direction
            };

            axios
              .post('/api/wallet/transfer', data)
              .then((res) => {
                console.log('api/wallet/transfer result', res)
              })
              .catch((err) => {
                console.log('api/wallet/transfer err', err)
              });
            this.$alert("hash:" + result, "success", {
              confirmButtonText: this.$t("confirm"),
              type: "success",
            });

            setTimeout(() => {
              vm.getBalance();
              vm.getTokenBalance();
            }, 10000)
          })
          .catch((error) => {
            console.log('transfer INT tx error', error)
          });

      } else {
        // transfer token
        let data = int4.abi.encodeParams(
          ["address", "uint256"],
          [
            this.toAddress,
            new BigNumber(
              Math.round(
                this.amount * Math.pow(10, vm.tokenDecimals)
              )
            ),
          ]
        );
        let functionSig = int4.abi.methodID("transfer", ["address", "uint256"]);

        const params = [
          {
            from: vm.address,
            to: vm.fromContractAddr,
            gas: Utils.toHex(vm.limit),
            gasPrice: Utils.toHex(Utils.fromINT(vm.price)),
            value: '0x0',
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
            const data = {
              body: {from: vm.address, hash: result},
              url: "",
              isInt: vm.isINT,
              isEth: vm.isETH,
              isBsc: vm.isBSC,
              exchange: true,
              direction: vm.direction
            };

            axios
              .post('/api/wallet/transfer', data)
              .then((res) => {
                console.log('api/wallet/transfer result', res)
              })
              .catch((err) => {
                console.log('api/wallet/transfer err', err)
              });
            this.$alert("hash:" + result, "success", {
              confirmButtonText: this.$t("confirm"),
              type: "success",
            });

            setTimeout(() => {
              vm.getBalance();
              vm.getTokenBalance();
            }, 10000)
          })
          .catch((error) => {
            console.log('tx error', error)
          });
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

