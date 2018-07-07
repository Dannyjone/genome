<template>
<el-row class="panel">
    <el-col :span="24">
        <NavBar :iscollapse='iscollapse' @ChangeCollapse='changeMenu' />
    </el-col>
    <el-col :span="24" class="panel-center">

        <aside class="left-aside">
            <!-- <MenuUser/> -->
            <RouterMenu :iscollapse="iscollapse"/>
        </aside>
        <HomeContent :iscollapse="iscollapse"/>
        <!-- <i class="iconfont icon-poweroff"></i> -->
    </el-col>
</el-row>
</template>

<script>
import NavBar from "../businesscontrols/NavBar.vue";
// import MenuUser from "../businesscontrols/MenuUser.vue";
import RouterMenu from "../../RouterMenu.vue";
import HomeContent from "../businesscontrols/HomeContent.vue";
export default {
  components: {
    NavBar,
    // MenuUser,
    RouterMenu,
    HomeContent
  },
  data() {
    return {
      iscollapse: true
    };
  },
  computed: {
    contentStyle() {
      return this.iscollapse ? "panel-c-c2" : "panel-c-c";
    }
  },
  methods: {
    changeMenu() {
      this.iscollapse = !this.iscollapse;
    }
  }
};
</script>

<style scoped>
.panel {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}
.panel-center {
  background: #324057;
  position: absolute;
  top: 60px;
  bottom: 0px;
  overflow: hidden;
}
.left-aside {
  width: 230px;
}
.logout {
  background-size: contain;
  width: 20px;
  height: 20px;
  float: left;
}
.logo {
  width: 40px;
  float: left;
  margin: 10px 10px 10px 18px;
}
.tip-logout {
  float: right;
  margin-right: 20px;
  padding-top: 5px;
}
.tip-logout i {
  cursor: pointer;
}
.admin {
  color: #c0ccda;
  margin-left: 20px;
}
.admin i {
  margin-right: 5px;
}
</style>
