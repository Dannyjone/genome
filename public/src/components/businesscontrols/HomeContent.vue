<template>
    <section class="panel-c-c2" :style="contentStyle">
        <div class="grid-content bg-purple-light">
        <el-col :span="24" class="panel-inner-top">
            <strong>{{$route.name}}</strong>
            <el-breadcrumb separator="/" class="bread-crumb" >
                <el-breadcrumb-item
                    :to="{ path: '/' }"
                    v-if="$route.path!='/'">
                首页
                </el-breadcrumb-item>
                <el-breadcrumb-item v-if="$route.path!='/'">
                    {{$route.matched[0].name}}
                </el-breadcrumb-item>
                <el-breadcrumb-item>
                    {{$route.name}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="panel-inner-bottom">
            <router-view></router-view>
        </el-col>
        </div>
    </section>
</template>
<script>
export default {
  props: ["iscollapse"],
  data() {
    return {
      iscollapse2: this.iscollapse
    };
  },
  watch: {
    iscollapse(nval, oval) {
      this.iscollapse2 = nval;
    }
  },
  computed: {
    contentStyle() {
      return this.iscollapse2 ? { left: "60px" } : { left: "230px" };
    }
  }
};
</script>

<style scoped>
strong {
  width: 200px;
  float: left;
  color: #475669;
}
.panel-c-c2 {
  background: #fff;
  position: absolute;
  right: 0px;
  top: 0px;
  bottom: 0px;
  left: 60px;
  overflow-y: scroll;
  padding: 20px;
}
.panel-inner-bottom {
  background-color: #fff;
  box-sizing: border-box;
  padding: 15px;
}
.panel-inner-top {
  margin-bottom: 15px;
}
.bread-crumb {
  height: 22px;
  line-height: 22px;
  float: right;
}
</style>

