<template>
    <div class="main">
        <el-col :span="12">
            <el-upload
                class="upload-base"
                drag
                action="/api/UploadFile"
                multiple
                auto-upload
                accept="Gene|*.bed"
                :file-list="UpLoadFileList"
                :before-upload="beforeAvatarUpload"
                :on-success="uploadOver"
                :show-file-list="ShowFileList"
                >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__text">注意仅允许基因数据*.bed|*.ucsc</div>
            </el-upload>
        </el-col>
        <el-col :span="12">
            <el-card>
                <div slot="header" class="clearfix">
                    <span>基因文件列表</span>
                </div>
                <el-menu @select="select" default-active="0">
                    <el-menu-item v-for="(item,index) in FileList" :key="index" :index="index.toString()">
                        {{item.name}}
                    </el-menu-item>
                </el-menu>
            </el-card>
        </el-col>
    </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      UpLoadFileList: [],
      FileList: [],
      ShowFileList: false,

    };
  },
  created() {
    this.GetFileList();
  },
  methods: {
    select(val) {
      this.$emit("select", this.FileList[val].name);
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
    GetFileList() {
      let that = this;
      axios
        .get("/api/GetFileList")
        .then(res => {
          that.FileList = res.data.data;
          this.$emit("select", that.FileList[0].name);
        })
        .catch(err => console.log(err));
    },
    uploadOver(path) {
      this.UpLoadFileList = [];
      this.ShowFileList = false;
      this.GetFileList();
      console.log(path);
    }
  }
};
</script>

<style scoped>
</style>

