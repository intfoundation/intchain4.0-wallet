<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 1200px;
  font-family: PingFangSC-Medium, PingFangSC;
}
.main {
  background: rgba(243, 243, 243, 1);
}
.box {
  width: 1200px;
  height: auto;
  padding-bottom: 50px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;
  margin: -120px auto 0px auto;
  position: relative;
  text-align: left;
}
.aw {
  color: rgba(102, 102, 102, 1);
  font-size: 34px;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #e73737;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #e73737;
  background: #e73737;
}
.el-radio__inner:hover {
  border: 1px solid #e73737;
}
.sk {
  color: rgba(102, 102, 102, 1);
  font-size: 16px;
  font-weight: bold;
  margin-top: 30px;
}
.skbtn {
  width: 416px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid rgba(204, 204, 204, 1);
  line-height: 50px;
  cursor: pointer;
  color: rgba(102, 102, 102, 1);
  text-align: center;
  font-size: 14px;
}
.bg-box {
  overflow: hidden;
  height: 188px;
  width: 100%;
}

.el-select .el-input.is-focus .el-input__inner {
  border-color: #e73737;
}
.el-select .el-input__inner:focus {
  border-color: #e73737;
}
.el-select-dropdown__item.selected {
  color: #e73737;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
  border-color: #e73737;
}
</style>
