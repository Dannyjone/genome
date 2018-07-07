<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm card-box loginform">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="UserID">
      <el-input type="text" v-model="ruleForm2.UserID" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="UserPwd">
      <el-input type="password" v-model="ruleForm2.UserPwd" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked style="margin:0px 0px 35px 0px;">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" :loading="Loginloading" @click.native.prevent="checklogin">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import util from "../common/util";
import NProgress from "nprogress";
import moment from "moment";
export default {
  computed: {
    ...mapGetters(["getProj", "getSession", "getYSToken"])
  },
  data() {
    //检查是否登录成功
    var checkLogin = (rule, value, callback) => {};
    return {
      Loginloading: false,
      ruleForm2: {
        UserID: "",
        UserPwd: ""
      },
      rules2: {
        UserID: [{ required: true, message: "请输入账号", trigger: "blur" }],
        UserPwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      checked: true
    };
  },
  methods: {
    ...mapActions(["setLogin"]),
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    checklogin(ev) {
      var _this = this;
      this.Loginloading = true;
      axios.post("/api/login", this.ruleForm2).then(function(res, err) {
        if (err || !res.data.success) {
          console.log("登录失败");
          _this.$message({
            type: "error",
            message: res.data.msg
          });
          _this.Loginloading = false;
          return false;
        }
        _this.setLogin(res.data.data);
        sessionStorage.setItem("session", res.data.data._id);
        sessionStorage.setItem("UserName", res.data.data.UserName);
        _this.$router.replace("/table");
      });
    }
  }
};
</script>

<style scoped>
.card-box {
  padding: 20px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin-bottom: 20px;
  background-color: #f9fafc;
  margin: 120px auto;
  width: 400px;
  border: 2px solid #8492a6;
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.loginform {
  width: 350px;
  padding: 35px 35px 15px 35px;
}
</style>
