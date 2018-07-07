<template>
    <el-card>
        <div slot="header" class="clearfix">
            <span style="color:#409EFF">「{{value}}」</span>上传到数据库
            <br>
            <span style="color:#909399;font-size:8px;margin-left:10px">
                    文件长度 <b>{{len}}</b> ,5W一组进行分割上传,共 <b>{{count}}</b> 组
            </span>
        </div>
        <div class="main">
            <el-col class="upload" v-show="!isLoading&&!hasBeedLoaded"  :span="12" v-for="(item,index) in items" :key="index">
                <el-col :span="24">
                    <el-progress :text-inside="true" :stroke-width="36" :percentage="item.percentage"></el-progress>
                </el-col>
            </el-col>
            <el-col :span="24">
                <el-button v-show="!isLoading&&!hasBeedLoaded"  @click="upload" :loading="isPost2Mongo" style="float:right" type="primary" icon="el-icon-edit">上传</el-button>
            </el-col>
            <el-col v-show="isLoading&&!hasBeedLoaded"  :span="24">
                <el-progress style="margin:0 auto"  type="circle" :percentage="percentage"></el-progress>
            </el-col>
            <el-col :span="24" v-show="hasBeedLoaded">
                <span>已上传</span>
                <el-button  @click="del" style="float:right;margin-left:2px"  type="danger" icon="el-icon-edit">删除</el-button>
                <el-button  @click="add(false)" style="float:right"  type="primary" icon="el-icon-edit">添加Track</el-button>
                <el-button  @click="add(true)" style="float:right"  type="primary" icon="el-icon-edit">添加Loop</el-button>
            </el-col>
        </div>
        <br>
        <br>
    </el-card>
</template>
<script>
import axios from "axios";
export default {
  props: ["value"],
  data() {
    return {
      len: 0,
      count: 0,
      items: [],
      isLoading: true,
      percentage: 0,
      isPost2Mongo: false,
      hasBeedLoaded: false
    };
  },
  watch: {
    value(n, o) {
      this.checkdata(() => this.GetFileLen());
    }
  },
  methods: {
    checkdata(callback) {
      let that = this;
      axios
        .get(`/api/CheckData?Path=${that.value}`)
        .then(res => {
          if (res.data.success) {
            that.hasBeedLoaded = res.data.data;
            if (!that.hasBeedLoaded) {
              //console.log(`${that.value}  ==== ${that.hasBeedLoaded}`);
              callback();
            }
          }
        })
        .catch(err => console.log(err));
    },
    post2mongo(index) {
      let that = this;
      if (index == that.count) {
        that.isPost2Mongo = false;
        return;
      }
      that.isPost2Mongo = false;
      let isuploading = true;
      let item = that.items[index];
      var suffix = that.value.substring(that.value.lastIndexOf("."));
      let api = suffix == ".bed" ? `/api/InserTrackData` : "/api/InserGeneData";
      axios
        .post(api, {
          start: item.start,
          end: item.end,
          Path: that.value
        })
        .then(res => {
          if (res.data.success) {
            index++;
            isuploading = false;
            item.percentage = 100;
            this.post2mongo(index);
            if (index >= that.count) {
              that.hasBeedLoaded = true;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });

      setInterval(() => {
        if (item.percentage < 88 && isuploading) {
          item.percentage++;
        }
      }, 200);
    },
    upload() {
      let index = 0;
      this.post2mongo(index);
    },
    GetFileLen() {
      let that = this;
      that.hasBeedLoaded = false;
      that.count = 0;
      that.len = 0;
      that.items = [];
      that.isLoading = true;
      that.percentage = 0;
      axios
        .get(`/api/GetFileLen?Path=${this.value}`)
        .then(res => {
          if (res.data.success) {
            that.len = parseInt(res.data.data);
            that.count = Math.ceil(that.len / 50000);

            for (let index = 0; index < that.count; index++) {
              var start = index * 50000;
              var end = start + 50000 > that.len ? that.len : start + 50000;
              that.items.push({
                start: start,
                end: end,
                percentage: 0
              });
            }
            that.isLoading = false;
            that.percentage = 100;
          }
        })
        .catch(err => {
          console.log(err);
        });
      setInterval(() => {
        if (that.percentage < 88 && that.isLoading) {
          that.percentage++;
        }
      }, 200);
    },
    del() {
      let that = this;
      axios
        .post(`/api/RemoveData`, { Path: that.value })
        .then(res => {
          if (res.data.success) {
            that.hasBeedLoaded = false;
          }
        })
        .catch(err => console.log(err));
    },
    add(val) {
      this.$emit("add", { value: this.value, isloop: val });
    }
  }
};
</script>

<style scoped>
.upload {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>

