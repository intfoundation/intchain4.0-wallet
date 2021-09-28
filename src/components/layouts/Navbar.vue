<template>
  <div class="nav-container">
    <div class="nav-panel">
      <router-link tag="div" to="/" class="common-inline-block ii">
        <img
          src="../../assets/int-logo.png"
          alt="int logo"
          class="nav-logo logo-int common-inline-block"
        />
      </router-link>
      <div class="common-inline-block ic" style="">
        <router-link
          to="/"
          id="home"
          :class="{ 'nav-active': $route.path === '/' }"
          class="pgy"
          >{{ $t("walletInfo") }}</router-link
        >
        <router-link
          to="/newWallet"
          id="home"
          :class="{ 'nav-active': $route.path === '/newWallet' }"
          class="pgy"
          >{{ $t("newWallet") }}</router-link
        >

        <!-- <router-link to="/mapping" id="home" :class="{'nav-active': $route.path === '/mapping'}" class="pgy">{{$t('mapping')}}</router-link> -->

        <router-link
          to="/transfer"
          id="home"
          :class="{ 'nav-active': $route.path === '/transfer' }"
          class="pgy"
          >{{ $t("transfer") }}</router-link
        >

<!--        <router-link-->
<!--          to="/contract"-->
<!--          id="home"-->
<!--          :class="{ 'nav-active': $route.path === '/contract' }"-->
<!--          class="pgy"-->
<!--          >{{ $t("contract") }}</router-link-->
<!--        >-->
        <router-link
          to="/register"
          id="home"
          :class="{ 'nav-active': $route.path === '/register' }"
          class="pgy"
          >{{ $t("register") }}</router-link
        >
        <router-link
          to="/unRegister"
          id="home"
          :class="{ 'nav-active': $route.path === '/unRegister' }"
          class="pgy"
        >{{ $t("unRegister") }}</router-link
        >
        <router-link
          to="/editValidator"
          id="home"
          :class="{ 'nav-active': $route.path === '/editValidator' }"
          class="pgy"
        >{{ $t("editValidator") }}</router-link
        >
<!--        <router-link-->
<!--          to="/unForbidden"-->
<!--          id="home"-->
<!--          :class="{ 'nav-active': $route.path === '/unForbidden' }"-->
<!--          class="pgy"-->
<!--          >{{ $t("unForbidden") }}</router-link-->
<!--        >-->
        <router-link
          v-if="isTestNetwork"
          to="/faucet"
          id="home"
          :class="{ 'nav-active': $route.path === '/faucet' }"
          class="pgy"
          >{{ $t("faucet") }}</router-link
        >

        <router-link
          to="/stake"
          id="home"
          :class="{ 'nav-active': $route.path === '/stake' }"
          class="pgy"
          >{{ $t("vote") }}</router-link
        >

<!--        <router-link-->
<!--          v-if="!isTestNetwork"-->
<!--          to="/bridge"-->
<!--          id="home"-->
<!--          :class="{ 'nav-active': $route.path === '/bridge' }"-->
<!--          class="pgy"-->
<!--          >{{ $t("bridge") }}</router-link-->
<!--        >-->
        <div
          class="common-inline-block vg"
          style="margin-left: 30px"
        >
          <a href="javacript:void(0);">
            <span>{{ $t("language") }}</span>
            <i class="triangle"></i>
          </a>
          <div class="chain-dropdown">
            <div @click="$i18n.locale = 'zh'" class="chain-dropdown-i">
              中文
            </div>
            <div @click="$i18n.locale = 'en'" class="chain-dropdown-i">
              English
            </div>
          </div>
        </div>
        <div class="common-inline-block">
          <button id="connectButton">Connect Wallet</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MetaMaskOnboarding from '@metamask/onboarding';

export default {
  name: "NavPanel",
  data() {
    return {
      curNav: "Home",
      searchContent: "",
      otherSearch: "",
      chainId: '0x7ff',
      testChainId: '0x800',
      blockchainList: [
        {
          name: this.$t("nav.blockchain.block"),
          url: "/blockchain/blocklist/1",
        },
        {
          name: this.$t("nav.blockchain.transaction"),
          url: "/blockchain/txlist/1",
        },
        {
          name: this.$t("nav.blockchain.token"),
          url: "/blockchain/tokenlist/1",
        },
        {
          name: this.$t("nav.blockchain.account"),
          url: "/blockchain/accountlist/1",
        },
        {
          name: this.$t("nav.blockchain.referendum"),
          url: "/referendum",
        },
      ],
      guidelist: [
        { name: this.$t("nav.enVersion"), url: "/static/help/en.pdf" },
        {
          name: this.$t("nav.cnVersion"),
          url: "/static/help/cn.pdf",
        },
      ],
      isTestNetwork: true,
    };
  },
  created() {
    this.getLocaction();
  },
  mounted() {
    this.initialize();
  },
  methods: {
    hh() {
      console.log(this);
    },
    strTrim(str) {
      str = str + "";
      return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    highlight(index) {
      this.curNav = index;
    },

    getLocaction() {
      this.isTestNetwork = window.location.hostname.substr(0, 4) === "test" || window.location.hostname.substr(0, 4) === "loca";
    },

    async initialize () {
      const onboardButton = document.getElementById('connectButton');
      const onboarding = new MetaMaskOnboarding();

      // 判断是否安装
      const isMetaMaskInstalled = () => {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
      };


      const onClickInstall = () => {
        onboardButton.innerText = 'Onboarding in progress';
        onboardButton.disabled = true;
        onboarding.startOnboarding()
      }

      const onClickConnect = async () => {
        await RequestAccount()
      }

      const onClickSwitchChain = async () => {
        await switchToEtheruemChain()
      }

      const MetaMaskClientCheck = () => {
        if (!isMetaMaskInstalled()) {
          onboardButton.innerText = 'Click here to install MetaMask!';
          onboardButton.onclick = onClickInstall;
          onboardButton.disabled = false
        } else {
          onboardButton.innerText = this.$t('connect');
          onboardButton.onclick = onClickConnect;
          onboardButton.disabled = false
        }
      };

      // TODO: 判断是否为 INT 的链
      const RequestAccount = async () => {
        try {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          if (chainId !== this.chainId && chainId !== this.testChainId) {
            window.location.reload();
          } else {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            onboardButton.innerText = `${accounts[0].substr(0, 6)}...${accounts[0].slice(-4)}`
            window.location.reload()
          }

        } catch (e) {
          console.log('request accounts error:', e);
          // this.info("error", this.$t("reqeustAccountsError"));
        }
      };

      const ConnectAccount = async () => {
        try {
          const chainId = await ethereum.request({ method: 'eth_chainId' });
          if (chainId !== this.chainId  && chainId !== this.testChainId) {
            onboardButton.innerText = this.$t('wrongNetwork');
            onboardButton.onclick = onClickSwitchChain;
          }else {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            onboardButton.innerText = `${accounts[0].substr(0, 6)}...${accounts[0].slice(-4)}`;
          }
        } catch (e) {
          console.log('request accounts error:', e);
          // this.info("error", this.$t("reqeustAccountsError"));
        }
      };

      const switchToEtheruemChain = async () => {
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7ff'}]
          })
          window.location.reload();
        } catch (e) {
          if (e.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x7ff',
                  chainName: 'INT Chain',
                  nativeCurrency: {
                    name: "INT",
                    symbol: "INT",
                    decimals: 18
                  },
                  rpcUrls: ["https://titansrpc.intchain.io"],
                  blockExplorerUrls: ['https://titansexplorer.intchain.io']
                }]
              })

              window.location.reload();
            } catch (e) {
              console.log('add network error', e)
            }
          }
        }
      };

      ethereum.on('chainChanged', (_chainId) => {
        window.location.reload();
      });

      ethereum.on('accountsChanged', (_accounts) => {
        window.location.reload();
      });

      MetaMaskClientCheck();
      ConnectAccount();
    }
  },
};
</script>

<style lang="scss">
.nav-container {
  box-shadow: 0px 4px 8px 0px rgba(230, 230, 230, 0.6);
  background-color: rgba(255, 255, 255, 1);
  height: 80px;
  .nav-panel {
    text-align: left;
    box-sizing: border-box;
    width: 1200px;
    margin: 0 auto;
    .logo-int {
      width: 80px;
      height: 80px;
      /*margin-top: 20px*/
    }
    .ii {
      vertical-align: middle;
    }
    .ic {
      margin-left: 10px;
      width: 1100px;
      & a {
        margin-right: 15px;
        color: #666666;
        text-decoration: none;
        font-weight: 500;
        span {
          vertical-align: middle;
        }
      }
      .vg {
        position: relative;
        top: -2px;
        display: inline-block;
        height: 55px;
        &:hover > .chain-dropdown {
          display: block !important;
        }
        .chain-dropdown {
          position: absolute;
          width: 110px;
          top: 45px;
          box-shadow: 0px 6px 10px 0px #ccc;
          background-color: #fff;
          padding: 10px 15px;
          left: -16px;
          font-size: 14px;
          display: none;
          z-index: 1000;
          .chain-dropdown-i {
            cursor: pointer;
          }
          .chain-dropdown-i:not(:first-child) {
            margin-top: 8px;
          }
          .chain-dropdown-i:hover {
            color: #e73737;
          }
        }
        .triangle {
          display: inline-block;
          width: 0;
          height: 0;
          border-width: 7px 7px 0;
          border-style: solid;
          border-color: #999 transparent transparent;
          margin-left: 8px;
          vertical-align: middle;
        }
      }
      .nav-active {
        color: #e73737;
      }
      .triangle-active {
        border-color: #e73737 transparent transparent !important;
      }
    }
    .help:hover {
      color: #e73737;
      padding-bottom: 2px;
      border-bottom: 2px solid #e73737;
    }
    .iv {
      height: 52px;
      line-height: 52px;
      float: right;
      & input {
        width: 280px;
        box-sizing: border-box;
        height: 37px;
        padding-left: 10px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border: 1px solid #ccc;
        border-right: none !important;
        outline: none;
        vertical-align: middle;
      }
      & span {
        display: inline-block;
        width: 53px;
        height: 37px;
        line-height: 3;
        background-color: #3a3cda;
        text-align: center;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
        vertical-align: middle;
      }
      .search-icon {
        background-image: url("../../assets/search.png");
        background-size: cover;
        display: inline-block;
        width: 24px;
        height: 22px;
      }
    }

    #connectButton {
      width: 150px;
      height: 30px;
      color: #ffffff;
      border: 1px solid #e73737;
      border-radius: 20px;
      background-color: #f56c6c;
      font-size: 16px;
      cursor: pointer;
    }

    #connectButton:hover {
      opacity: 0.75;
    }
  }
}
.common-inline-block {
  display: inline-block;
  cursor: pointer;
}
</style>
