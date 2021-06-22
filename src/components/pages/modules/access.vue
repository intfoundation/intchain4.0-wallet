<template>
  <div style="padding-bottom: 90px">
    <div class="box">
      <div style="margin-left: 200px">
        <p class="aw">{{ $t("accessWallet") }}</p>
        <el-radio-group v-model="radio">
          <el-radio :label="1">KeyStore</el-radio>
          <el-radio :label="2">{{ $t("privatekey") }}</el-radio>
        </el-radio-group>
        <div v-if="radio == 1">
          <p class="sk">{{ $t("selectKeyStoreFile") }}</p>

          <div class="skbtn" @click="selectKeyStore">
            {{ $t("selectKeyStore") }}
          </div>
          <input
            @change="onFileChange"
            style="display: none"
            id="f"
            ref="f"
            type="file"
          />
          <el-input
            type="textarea"
            style="width: 416px; margin-top: 20px"
            :rows="4"
            :placeholder="$t('etKeyStore')"
            v-model="keyStore"
          ></el-input>
          <br />
          <eye-input
            @change="onPwdChange"
            style="width: 416px; margin-top: 20px"
            v-model="pwd"
            :placeholder="$t('etWalletPwd')"
          ></eye-input>
          <br />
          <el-button
            @click="keyStoreUnlock"
            style="width: 240px; height: 50px; margin-top: 40px"
            type="danger"
            >{{ $t("unlock") }}</el-button
          >
        </div>
        <div v-if="radio == 2">
          <p class="sk">{{ $t("etPrivakey") }}</p>

          <eye-input
            @change="onPrivakeyChange"
            style="width: 416px"
            v-model="privakey"
            :placeholder="$t('etPrivakey')"
            type="password"
          ></eye-input>
          <br />

          <el-button
            @click="unlockPrivakey"
            :disabled="!privakey"
            style="width: 240px; height: 50px; margin-top: 40px"
            type="danger"
            >{{ $t("unlock") }}</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let Account = require("int4.js").account;
let KeyStore = require("int4.js").keystore;
import EyeInput from "./eyeInput";
export default {
  data() {
    return {
      radio: 1,
      keyStore: "",
      pwd: "",
      privakey: "",
    };
  },
  components: {
    EyeInput,
  },
  created() {},
  mounted() {},
  methods: {
    selectKeyStore() {
      document.getElementById("f").click();
    },
    onFileChange(f) {
      let vm = this;
      let file = document.getElementById("f").files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function () {
        vm.keyStore = this.result;
      };
    },
    onPwdChange(val) {
      this.pwd = val;
    },
    onPrivakeyChange(val) {
      this.privakey = val;
    },
    keyStoreUnlock() {
      try {
        let account = KeyStore.fromV3Keystore(
          JSON.parse(this.keyStore),
          this.pwd
        );
        this.$emit("unlock", account);
      } catch (e) {
        this.info("error", this.$t("errPwd"));
      }
    },
    unlockPrivakey() {
      if (this.privakey.indexOf("0x") < 0) {
        this.privakey = "0x" + this.privakey;
      }
      try {
        let account = Account.fromPrivate(this.privakey);
        this.$emit("unlock", account);
      } catch (e) {
        this.info("error", this.$t("errPrivatekey"));
      }
    },
  },
};
</script>

<style >
</style>
