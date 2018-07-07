<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  created: function() {}
};
</script>

<style>
@import "../css/iconfont.css";
@import "../../node_modules/font-awesome/css/font-awesome.min.css";
@import "../../node_modules/flex.css/dist/flex.css";
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
body {
  margin: 0px;
  padding: 0px;
  background: #324057;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

#app {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.el-submenu [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}

.el-menu-item [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}
</style>
