<template>
    <div>
      <el-menu :collapse='iscollapse2' 
                  :default-active="$route.path" 
                  :default-openeds="openedArr" 
                  collapse-transition 
                  class="aside-menu"  
                  theme="dark" 
                  unique-opened 
                  router>
          <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
              <el-submenu :key="index" :index="index.toString()">
                  <template slot="title">
                      <i :class="item.iconCls"/>
                      {{item.name}}
                  </template>
                  <el-menu-item :key="child.path"
                                  v-for="child in item.children"
                                  v-if="!child.hidden"
                                  :index="child.path">
                      <template slot="title">
                          <i :class="child.iconCls" style="font-size:16px"/>
                          {{child.name}}
                      </template>
                  </el-menu-item>
              </el-submenu>
          </template>
      </el-menu>
      <!-- <projselect /> -->
    </div>
</template>

<script>
import axios from "axios";
import util from "./common/util";
import NProgress from "nprogress";
import projselect from "./components/gene/projselect";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { projselect },
  computed: {
    // ...mapGetters(["getProj", "getUser", "getMenu"])
  },
  props: ["iscollapse"],
  data() {
    return {
      iscollapse2: this.iscollapse,
      openedArr: [],
      Menus: this.$router.options.routes
    };
  },
  methods: {
    // ...mapActions(["setLoadMenu"])
  },
  watch: {
    iscollapse(nval, oval) {
      this.iscollapse2 = nval;
    }
  },
  created() {
    //这里判断权限
    // let isLoadNodes = sessionStorage.getItem("isLoadNodes");
    // if (!isLoadNodes) {
    //   let data = JSON.parse(window.sessionStorage.getItem("MenuInfo"));
    //   this.Menus.push(...data);
    //   sessionStorage.setItem("isLoadNodes", "true");
    // }
  }
};
</script>

<style scoped>
.el-submenu [class^="fa"] {
  margin-right: 24px;
}

.el-menu--collapse {
  width: 60px;
}

i {
  margin-right: 24px;
  font-size: 24px;
}
</style>


