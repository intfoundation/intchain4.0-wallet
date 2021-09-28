<template>
  <div class="main">
    <div class="bg-box">
      <img
        style="margin-top: -80px; width: 100%"
        src="../../assets/backgroud.jpg"
        alt=""
      />
    </div>
    <div class="box" style="height: 527px;">
      <div style="margin: 48px 0 0 108px">
        <div class="item">
          <p style="font-size: 14px">{{ $t("yAddr") }}</p>
          <el-input
            style="width: 420px"
            :placeholder="$t('yAddr')"
            v-model="address"
          ></el-input>
        </div>
      </div>
      <el-button @click="sendTx" class="gtc" type="danger">{{
        $t("gtc")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import int4 from "int4.js";

export default {
  data() {
    return {
      address: "",
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    sendTx() {
      if (!int4.utils.isAddress(this.address)) {
        this.info("error", this.$t("errAddr"));
        return;
      }
      axios
        .get("/api/wallet/getTestCoin", { params: { address: this.address } })
        .then((res) => {
          if (res.data.errMsg) {
            this.$message({
              message: res.data.errMsg,
              type: "warning",
            });
          } else {
            this.$alert("hash:" + res.data, "success", {
              confirmButtonText: this.$t("confirm"),
              type: "success",
            });
          }
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
.gtc {
  width: 280px;
  height: 44px;
  margin-left: 150px;
  margin-top: 10px;
}
</style>

<style>
.el-message-box__message p {
  margin: 0;
  line-height: 24px;
  word-break: break-all;
}
</style>

