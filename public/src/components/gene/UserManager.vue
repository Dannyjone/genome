<template>
    <el-tabs style="width:100%;">
        <el-tab-pane label="用户管理">
            <section>
                <el-col :span="24" class="toolbar">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item>
                            <el-input v-model="formInline.user" placeholder="姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click='getUserList'>查询</el-button>
                            <el-button type="primary" round @click="newCustomTable">新增用户</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <template>
                    <el-table border fit stripe :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%; height:100%">   
                        <el-table-column type="index" label="编号" width="85">
                        </el-table-column>
                        <el-table-column prop="UserID" label="账号" >
                        </el-table-column>
                        <el-table-column prop="UserName" label="姓名" >
                        </el-table-column>
                        <el-table-column prop="UserSex" label="性别" :formatter="formatSex" >
                        </el-table-column>
                        <el-table-column prop="UserAge" label="年龄" >
                        </el-table-column>

                        <el-table-column prop="UserCardID" label="身份证" >
                        </el-table-column>
                        <el-table-column prop="UserEmail" label="邮箱" >
                        </el-table-column>

                        <el-table-column prop="UserPhoneNum" label="手机号">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template scope="scope">
                                <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                                <el-button type="text" size="small" @click="handleDel(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>

                <!--分页-->
                <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]"
                        :page-size="currentPageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableDataLength"
                        style="float:right">
                    </el-pagination>
                </el-col>

                <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="true">
                    <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                      
                        <el-form-item label="账号" prop="UserID">
                            <el-input :disabled="editFormTtile.id == 0" v-model="editForm.UserID" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="UserPwd">
                            <el-input type="password" v-model="editForm.UserPwd" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="姓名" prop="UserName">
                            <el-input v-model="editForm.UserName" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="身份证" prop="UserCardID">
                            <el-input v-model="editForm.UserCardID" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="邮箱" prop="UserEmail">
                            <el-input v-model="editForm.UserEmail" auto-complete="off"></el-input>
                        </el-form-item>

                        <el-form-item label="性别" prop="UserSex">
                            <el-radio-group v-model="editForm.UserSex">
                                <el-radio class="radio" :label="1">男</el-radio>
                                <el-radio class="radio" :label="0">女</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="年龄" prop="UserAge">
                            <el-input v-model="editForm.UserAge" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="UserPhoneNum">
                            <el-input placeholder="请输入内容" v-model="editForm.UserPhoneNum">
                                <template slot="prepend">+86</template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="editFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
                    </div>
                </el-dialog>

            </section>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import util from "../../common/util";
import NProgress from "nprogress";
import axios from "axios";
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  computed: {
    // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      "getProj"
      // ...
    ])
  },
  data() {
    //验证工号是否重复
    var checkUserID = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("请输入工号"));
      }
      if (this.editForm.id) return callback();
      axios.get(`/api/user/checkID?UserID=${value}`).then(res => {
        if (!res.data.success) {
          return callback(new Error("工号不允许重复"));
        } else {
          console.log("验证完成!");
          return callback();
        }
      });
    };
    return {
      formInline: {
        user: ""
      },
      //编辑界面显是否显示
      editFormVisible: false,
      //编辑界面标题
      editFormTtile: "编辑",
      //编辑界面数据
      editForm: {
        id: 0,
        UserID: 0,
        UserName: "",
        UserSex: 1,
        UserAge: 0,
        UserPhoneNum: "",
        UserPwd: "123456",
        UserEmail: "",
        UserCardID: ""
      },
      editLoading: false,
      btnEditText: "提 交",
      editFormRules: {
        UserID: [{ validator: checkUserID, trigger: "blur" }],
        UserPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        UserName: [{ required: true, message: "请输入姓名", trigger: "blur" }]
        // UserPhoneNum: [
        //   { required: true, message: "请输入手机号", trigger: "blur" }
        // ]
      },
      tableData: [],
      tableDataLength: 0,
      listLoading: false,
      currentPage: 1,
      currentPageSize: 10
    };
  },
  created: function() {
    this.getUserList();
    //根据区域查询部门,职位表...
  },
  methods: {
    /**
     * 上传用户头像
     * */
    handleAvatarSuccess(res, file) {
      this.editForm.UserHeadImage = URL.createObjectURL(file.raw);

      //console.log(file);
      this.editForm.UserHeadImage = file.response.data;
      console.log(this.editForm.UserHeadImage);
    },
    /**
     * 检查上传图片
     */
    beforeAvatarUpload() {},
    //新建用户
    newCustomTable() {
      this.editFormTtile = "新建用户";
      this.editFormVisible = true;
      this.editForm = {
        id: 0,
        UserID: 0,
        UserName: "",
        UserSex: 1,
        UserAge: 0,
        UserPhoneNum: "",
        UserPwd: "123456",
        UserEmail: "",
        UserCardID: ""
      };
    },
    //显示编辑界面
    handleEdit: function(row) {
      this.editFormVisible = true;
      this.editFormTtile = "编辑";
      this.editForm.id = row._id;
      this.editForm.UserID = row.UserID;
      this.editForm.UserName = row.UserName;
      this.editForm.UserSex = row.UserSex;
      this.editForm.UserAge = row.UserAge;
      this.editForm.UserPhoneNum = row.UserPhoneNum;
      this.editForm.UserEmail = row.UserEmail;
      this.editForm.UserCardID = row.UserCardID;
    },
    //编辑 or 新增
    editSubmit: function() {
      var _this = this;
      _this.$refs.editForm.validate(valid => {
        if (!valid) return;
        _this.$confirm("确认提交吗？", "提示", {}).then(() => {
          _this.editLoading = true;
          NProgress.start();
          _this.btnEditText = "提交中";

          let url = _this.editForm.id
            ? `/api/user/${_this.editForm.id}`
            : "/api/user";
          axios.post(url, _this.editForm).then(function(res) {
            if (res.data.success) {
              _this.$message({
                message: "提交成功",
                type: "success"
              });
              _this.editFormVisible = false;
              _this.getUserList();
            } else {
              _this.$message({
                message: "提交失败",
                type: "error"
              });
            }
            _this.btnEditText = "提 交";
            _this.editLoading = false;
            NProgress.done();
          });
        });
      });
    },

    //性别显示转换
    formatSex: function(row, column) {
      return row.UserSex == 1 ? "男" : row.UserSex == 0 ? "女" : "未知";
    },
    //性别显示转换
    formatDate: function(row, column) {
      return moment(row.UserBirth).format("YYYY-MM-DD");
    },
    //删除记录
    handleDel: function(row) {
      var _this = this;
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          _this.listLoading = true;
          NProgress.start();
          axios.delete(`/api/user/${row._id}`).then(function(res) {
            if (res.data.success) {
              _this.$message({
                message: "删除成功",
                type: "success"
              });
              _this.listLoading = false;
              NProgress.done();
              _this.getUserList();
            } else {
              _this.$message({
                message: "删除失败",
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    //显示新增界面
    handleAdd: function() {
      var _this = this;
      this.editFormVisible = true;
      this.editFormTtile = "新增";
      this.editForm.UserID = 0;
      this.editForm.UserName = "";
      this.editForm.UserSex = 0;
      this.editForm.UserAge = 0;
      this.editForm.UserBirth = "";
      this.editForm.UserAddr = "";
      this.editForm.UserPhoneNum = "";
      this.editForm.UserEmail = "";
      this.editForm.UserCardID = "";
    },
    //获取用户列表
    getUserList: function() {
      var vm = this;
      var params = {
        limit: vm.$data.currentPageSize,
        page: vm.$data.currentPage
      };
      axios.get("/api/user", { params: params }).then(function(res) {
        vm.$data.tableData = res.data.data;
        vm.$data.tableDataLength = res.data.meta.count;
        console.log(res.data.data);
      });
    },
    handleSizeChange(val) {
      this.$data.currentPageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.$data.currentPage = val;
      this.getUserList();
    }
  }
};
</script>

<style lang="scss" scoped>
.toolbar .el-form-item {
  margin-bottom: 10px;
}

.toolbar {
  background: #fff;
  padding-top: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>