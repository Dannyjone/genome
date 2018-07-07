<template>
    <div>
        <el-row>
            <el-col :span="8">
                <el-card class="maincard" body-style="padding:0px">
                    <div slot="header" class="clearfix">
                        <span>物种管理</span>
                        <el-popover
                            placement="right"
                            width="400"
                            trigger="click">
                            <el-form ref="speciesForm" :model="speciesForm" label-width="80px">
                                <el-form-item label="物种名称">
                                    <el-input v-model="speciesForm.name"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submit">
                                        立即创建
                                    </el-button>
                                </el-form-item>
                            </el-form>

                            <el-button slot="reference" 
                                    style="float: right; padding: 3px 0" 
                                    type="text">
                                新建物种
                            </el-button>
                        </el-popover>

                        <el-button  slot="reference" 
                                    style="float: right; padding: 3px 3px" 
                                    type="text"
                                    @click="delspecies">
                            删除
                        </el-button>

                    </div>

                    <el-menu :default-active="active" @select="selectSpecies" >
                        <el-menu-item v-for="(i,index) in speciesData" :key="index" :index="index+''" >
                            {{i.name}}
                        </el-menu-item>
                    </el-menu>

                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card class="maincard" body-style="padding:0px">
                    <div slot="header" class="clearfix">
                        <span>项目管理</span>
                        
                        <el-popover
                            placement="right"
                            width="400"
                            trigger="click">
                            <el-form ref="projectForm" :model="projectForm" label-width="80px">
                                <el-form-item label="项目名称">
                                    <el-input v-model="projectForm.name"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitproject">
                                        立即创建
                                    </el-button>
                                </el-form-item>
                            </el-form>

                            <el-button slot="reference" 
                                    style="float: right; padding: 3px 0" 
                                    type="text">
                                新建项目
                            </el-button>
                        </el-popover>
                        
                        <el-button  slot="reference" 
                                    style="float: right; padding: 3px 3px" 
                                    type="text"
                                    @click="delproj">
                            删除
                        </el-button>

                    </div>
                    <el-menu :default-active="active" @select="selectProj" >
                        <el-menu-item v-for="(i,index) in projectData" :key="index" :index="index+''" >
                            {{i.name}}
                        </el-menu-item>
                    </el-menu>
                </el-card>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="8">
                <el-card body-style="padding:0px">
                    <div slot="header" class="clearfix">
                        <span>用户数据</span>
                    </div>
                    
                    <el-table 
                        border 
                        fit 
                        stripe 
                        :data="userLst"
                        highlight-current-row >
                        <el-table-column type="index" label="编号" width="100">
                        </el-table-column>
                        <el-table-column label="姓名" prop="name">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template scope="scope">
                                <el-switch
                                    v-model="scope.row.edit"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    @change="changeuser(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column> 
                    </el-table>

                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card body-style="padding:0px">
                    <div slot="header" class="clearfix">
                        <span>基因组数据</span>
                    </div>
                </el-card>

                
                <el-table 
                    border 
                    fit 
                    stripe 
                    :data="genelist"
                    highlight-current-row >
                    <el-table-column type="index" label="编号" width="100">
                    </el-table-column>
                    <el-table-column label="名称" prop="name">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-switch
                                v-model="scope.row.edit"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="changegene(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column> 
                </el-table>

            </el-col>
            <el-col :span="8">
                <el-card body-style="padding:0px">
                    <div slot="header" class="clearfix">
                        <span>基因数据</span>
                    </div>
                </el-card>

                
                <el-table 
                    border 
                    fit 
                    stripe 
                    :data="tracklist"
                    highlight-current-row >
                    <el-table-column type="index" label="编号" width="100">
                    </el-table-column>
                    <el-table-column label="名称" prop="name">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template scope="scope">
                            <el-switch
                                v-model="scope.row.edit"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="changetrack(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column> 
                </el-table>

            </el-col>
        </el-row>

    </div>
</template>
<script>
import { mapGetters } from "vuex";
import axios from "axios";
export default {
  computed: {
    ...mapGetters(["getUser"])
  },
  data() {
    return {
      active: "0",
      speciesData: [],
      speciesForm: {},
      currentSpecies: {},

      projectData: [],
      projectForm: {},
      currentProject: {},

      userLst: [],
      tracklist: [],
      genelist: [],
      loginUser: sessionStorage.getItem("session")
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    //删除物种
    delspecies() {
      let that = this;
      axios
        .get("/api/DelSpecies?name=" + this.currentSpecies.name)
        .then(res => {
          this.getlist();
        })
        .catch(err => console.log(err));
    },
    //获取物种信息
    getlist() {
      let that = this;
      axios
        .get("/api/ListSpecies")
        .then(res => {
          that.speciesData = res.data.data;
          that.currentSpecies = that.speciesData[0];
          this.getprojlist();
        })
        .catch(err => console.log(err));
    },
    //提交物种信息
    submit() {
      this.speciesData.push(this.speciesForm);
      axios
        .post("/api/CreateSpecies", { name: this.speciesForm.name })
        .then(res => {})
        .catch(err => console.log(err));
      this.speciesForm = {
        name: ""
      };
    },
    //选择物种
    selectSpecies(row) {
      this.currentSpecies = this.speciesData[row];
      this.getprojlist();
    },
    //选择项目
    selectProj(row) {
      this.currentProject = this.projectData[row];
      //console.log(this.currentProject);
      this.getuser();
      this.getgene();
      this.gettracks();
    },
    //获取项目信息
    getprojlist() {
      let that = this;
      axios
        .get("/api/ListProject?_sid=" + this.currentSpecies._id)
        .then(res => {
          that.projectData = res.data.data;
          if (that.projectData.length > 0) {
            that.currentProject = that.projectData[0];
            that.getuser();
            that.getgene();
            that.gettracks();
          } else {
            that.userLst = [];
            that.genelist = [];
            that.tracklist = [];
          }
        })
        .catch(err => console.log(err));
    },
    //删除项目
    delproj() {
      let that = this;
      axios
        .get("/api/DelProject?name=" + this.currentProject.name)
        .then(res => {
          this.getprojlist();
        })
        .catch(err => console.log(err));
    },
    //提交项目
    submitproject() {
      axios
        .post("/api/CreateProject", {
          name: this.projectForm.name,
          _sid: this.currentSpecies._id,
          users: [{ _id: this.loginUser, ismanager: true }]
        })
        .then(res => {
          this.getprojlist();
        })
        .catch(err => console.log(err));
      this.projectForm = {
        name: ""
      };
    },
    //获取用户
    getuser() {
      let that = this;
      axios
        .get("/api/GetUsersByProj?_id=" + this.currentProject._id)
        .then(res => {
          that.userLst = res.data.data;
        })
        .catch(err => console.log(err));
    },
    //更改用户
    changeuser(row) {
      let that = this;
      //console.log(row);
      let query = {
        projid: this.currentProject._id,
        userid: row._id,
        edit: row.edit
      };
      axios
        .post("/api/UpdateProjUser", query)
        .then(res => {
          if (res.data.success) {
            console.log("成功");
            that.getuser();
          } else {
            that.$message({
              message: res.data.msg,
              type: "error"
            });
            row.edit = true;
          }
        })
        .catch(err => console.log(err));
    },
    //获取基因和基因组信息
    getgene() {
      let that = this;
      axios
        .get("/api/GetGeneByProj?_id=" + this.currentProject._id)
        .then(res => {
          that.genelist = res.data.data;
        })
        .catch(err => console.log(err));
    },
    //设置项目基因组
    changegene(row) {
      let that = this;
      let query = {
        projid: this.currentProject._id,
        geneid: row._id
      };
      axios
        .post("/api/UpdateProjGene", query)
        .then(res => {
          if (res.data.success) {
            that.getgene();
          } else {
            that.$message({
              message: res.data.msg,
              type: "error"
            });
            row.edit = true;
          }
        })
        .catch(err => console.log(err));
    },
    //获取基因数据
    gettracks() {
      let that = this;
      axios
        .get("/api/GetTrackByProj?_id=" + this.currentProject._id)
        .then(res => {
          that.tracklist = res.data.data;
          console.log(that.tracklist);
        })
        .catch(err => console.log(err));
    },
    //更新基因数据
    changetrack(row) {
      let that = this;
      let query = {
        projid: this.currentProject._id,
        trackid: row._id,
        edit: row.edit
      };
      axios
        .post("/api/UpdateProjTrack", query)
        .then(res => {
          if (res.data.success) {
            console.log("成功");
            that.gettracks();
          } else {
            that.$message({
              message: res.data.msg,
              type: "error"
            });
            row.edit = true;
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
<style scoped>
.maincard {
  /* height: 400px; */
}
</style>

