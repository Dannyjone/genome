<template>
    <div class="box usernav">
        <!-- <el-input placeholder="请选择项目" 
          suffix-icon="el-icon-search" 
          class="searchProj" 
          v-model="SelectProj" disabled>
            <el-button @click="OpenDialog" slot="append" icon="el-icon-search"></el-button>
        </el-input> -->
        <span>{{UserName}}</span>
        <!-- <p></p> -->
        <i class="LogoutStyle iconfont icon-poweroff" @click="Logout"/>
        <!-- <el-dialog close="dialog" title="请选择项目" v-model="isOpenDialog">
            <div class="nav">
                <div class="center">
                    <el-col :span=8>
                        <SelectProv />
                    </el-col>
                    <el-col :span=8>
                        <SelectCity @ChangeCity="ChangeCity"/>
                    </el-col>
                    <el-col :span=8>
                    </el-col>
                    <el-col :span="24">
                      <ProjMenu :SetVuex="true" :CityID="SelectCityID" @SelectProjChange="SelectProjChange"/>
                    </el-col>
                </div>
            </div>
        </el-dialog> -->
    </div>
</template>

<script>
// import SelectCity from "./SelectCity.vue";
// import SelectProv from "./SelectProv.vue";
// import ProjMenu from "./ProjMenu.vue";
// import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    // SelectCity,
    // SelectProv,
    // ProjMenu
  },
  // computed: {
  //   ...mapGetters(["getProj"]),
  //   CurrentProj() {
  //     return this.$store.state.Proj;
  //   }
  // },
  // watch: {
  //   CurrentProj(val) {
  //     console.log(val);
  //   }
  // },
  data() {
    return {
      // SelectProj: "XX|XX「XXXXXXXX」",
      // EditProj: {},
      // isOpenDialog: false,
      // SelectCityID: "",
      UserName: sessionStorage.getItem("UserName")
    };
  },
  created() {
    // if (this.getProj) {
    //   this.SelectProj = `${this.getProj.ProvName}|${this.getProj.CityName}「${
    //     this.getProj.ProjName
    //   }」`;
    // }
  },
  methods: {
    // ...mapActions(["setCity"]),
    //更新项目的ID
    // SelectProjChange(proj) {
    //   if (this.getProj) {
    //     this.SelectProj = `${this.getProj.ProvName}|${this.getProj.CityName}「${
    //       this.getProj.ProjName
    //     }」`;
    //   }
    //   this.isOpenDialog = false;
    // },
    // ChangeCity(val) {
    //   this.SelectCityID = val;
    //   this.setCity(val);
    // },
    Logout() {
      var _this = this;
      this.$confirm("确认退出吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          //调用api logout
          //sessionStorage.setItem("UserIsLogin", "no");
          _this.$router.replace("/login");
        })
        .catch(() => {});
    },
    OpenDialog() {
      this.isOpenDialog = !this.isOpenDialog;
    }
  }
};
</script>

<style scoped>
.usernav {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: Center;
  width: 120px;
  float: right;
}

.LogoutStyle {
  border-radius: 50%;
  float: right;
  margin-right: 30px;
  color: #f56c6c;
  font-size: 36px;
}
</style>
