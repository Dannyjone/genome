<template>
  <div>
      <el-col :span="16">
          <el-upload
              class="upload-base"
              drag
              action="/api/UploadFile"
              multiple
              auto-upload
              accept="Gene|*.bed"
              :file-list="uploadlst"
              :before-upload="beforeAvatarUpload"
              :on-success="uploadOver"
              :show-file-list="ShowFileList"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__text">注意仅允许基因数据*.bed|*.ucsc</div>
          </el-upload>
          <br>
          <br>
      </el-col>
      <el-col :span="8">
        <p>
          提示:文件比较大的时候会分批次上传到数据库,每{{this.uploadstep}}行一个批次,上传时请耐心等待!!!
        </p>
      </el-col>
      <el-col :span="24">
        <el-table 
            border 
            fit 
            stripe 
            :data="genelist"
            highlight-current-row 
            v-loading="listLoading" >
            <el-table-column type="index" label="编号" width="85">
            </el-table-column>
            <el-table-column prop="name"  label="名称" />
            <el-table-column prop="class" label="类型" />
            <el-table-column prop="path" label="路径" />
            <el-table-column prop="len" label="长度" />
            <el-table-column prop="status" label="状态" :formatter="formatstatus" />
            <el-table-column v-if="uploadstatus.isshow" prop="plan" :label="uploadstatus.txt">
                <template scope="scope">
                    <el-progress :text-inside="true" 
                                :stroke-width="28"
                                status="success" 
                                :percentage="scope.row.plan"/>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button :loading='uploadstatus.isupload' type="info" size="small" @click="upload(scope.row)">上传</el-button>
                    <el-button :loading='uploadstatus.isupload' type="danger" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column> 
        </el-table>
      </el-col>
  </div>
</template>
<script>
import GeneProjManager from "./GeneProjManager";
import axios from "axios";
export default {
  components: {
    GeneProjManager
  },
  data() {
    return {
      uploadlst: [],
      activeNames: "1",
      genelist: [],
      ShowFileList: false,
      listLoading: false,
      uploadstatus: {
        txt: "进度",
        isupload: false,
        isshow: false
      },
      beforestart: 0,
      uploadstep: 200000
    };
  },
  created() {
    this.getlist();
  },
  methods: {
    getlist() {
      let that = this;
      axios
        .get("/api/GetGeneDataList")
        .then(res => {
          that.genelist = res.data.data;
        })
        .catch(err => console.log(err));
    },
    uploadOver(res) {
      this.uploadlst = [];
      this.ShowFileList = false;
      if (res.success) {
        this.getlist();
      } else {
        this.$message({
          message: "文件已存在",
          type: "error"
        });
      }
    },
    beforeAvatarUpload(file) {
      this.ShowFileList = true;
      let strarr = file.name.split(".");
      const isGeneFile =
        strarr[strarr.length - 1] === "bed" ||
        strarr[strarr.length - 1] === "ucsc";
      if (!isGeneFile) {
        this.$message({
          message: `仅允许上传基因数据`,
          type: "error"
        });
      }
      return isGeneFile;
    },
    formatstatus(row, col) {
      return row.status == 1 ? "已上传" : "未上传";
    },
    upload(row) {
      this.beforestart = 0;
      this.uploadstatus = {
        isshow: true,
        isupload: true,
        txt: "进度"
      };
      let maxcount = Math.floor(row.len / this.uploadstep);
      //模拟进度
      var inter = setInterval(() => {
        if (row.plan < 99) {
          row.plan++;
        }
      }, 200);
      //上传数据
      if (row.class == ".ucsc") {
        axios
          .post("/api/InserGeneData", {
            start: 0,
            end: maxcount,
            Path: row.path
          })
          .then(res => {
            if (res.data.success) {
              this.uploadstatus = {
                isshow: false,
                isupload: false,
                txt: "进度"
              };
              this.getlist();
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        if (row.status == 0) {
          let count = 1;
          let last = row.len % this.uploadstep;
          if (last != 0) maxcount = maxcount + 1;
          //数据上传接口
          this.post2mongo(row, maxcount, 0, last);
        } else {
          row.plan = 100;
          this.uploadstatus.isupload = false;
          this.uploadstatus.isshow = false;
          this.$message({
            message: `该数据已经上传`,
            type: "error"
          });
        }
      }
    },
    post2mongo(row, allcount, index, last) {
      if (index == allcount) {
        this.uploadstatus = {
          isshow: false,
          isupload: false,
          txt: "进度"
        };
        this.$message({
          message: `上传完成`,
          type: "success"
        });
        this.getlist();
        return;
      }
      this.uploadstatus.txt = `进度:[${index}/${allcount}]`;
      //模拟进度
      var inter = setInterval(() => {
        if (row.plan < 99) {
          row.plan++;
        }
      }, 200);
      let taht = this;
      var step = this.uploadstep;
      var query = {
        start: index * step + (index == 0 ? 0 : index),
        end:
          index == allcount - 1
            ? last + ((index - 1) * step + step)
            : index * step + step + (index == 0 ? 0 : index),
        index: index,
        path: row.path
      };
      axios
        .post("/api/Upload2mongo", query)
        .then(res => {
          this.beforestart = res.data.data.beforeStart;
          clearInterval(inter);
          row.plan = 0;
          index++;
          this.uploadstatus.txt = `进度:[${index}/${allcount}]`;
          this.post2mongo(row, allcount, index, last);
        })
        .catch(err => console.log(err));
    },
    del() {}
  }
};
</script>

<style scoped>
.el-collapse-item__content {
  padding: 0px;
}
</style>

