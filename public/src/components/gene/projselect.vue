<template>
    <div class="projselect">
        <el-cascader
            v-model="defaultsp"
            placeholder="请输入物种"
            :options="spnames"
            filterable                    
        ></el-cascader>
       <el-cascader
            v-model="defaultproj"
            placeholder="请输入项目"
            :options="projnames"
            filterable
            @change="selectproj"                    
        ></el-cascader>
         <el-cascader
            v-model="defaultgeneclass"
            placeholder="请输入基因组"
            :options="geneclass"
            filterable    
            @change="selectgeneclass"                 
        ></el-cascader>
        <el-select v-model="currenttrack" 
                   @change="selecttrack"
                   multiple 
                   placeholder="请选择数据">
            <el-option
                v-if="item.edit"
                v-for="item in tracks"
                    :key="item._id"
                    :label="item.name"
                    :value="item._id">
            </el-option>
        </el-select>

    </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      loginuser: sessionStorage.getItem("session"),
      defaultsp: [],
      spnames: [],

      defaultproj: [],
      projnames: [],

      currentGene: "",
      currentProj: "",
      defaultgeneclass: [],
      geneclass: [],

      tracks: [],
      currenttrack: []
    };
  },
  created() {
    this.getsp();
  },
  methods: {
    getsp() {
      let that = this;
      axios
        .get("/api/ListSpecies")
        .then(res => {
          that.spnames = res.data.data.map(item => {
            return {
              label: item.name,
              value: item._id
            };
          });
          that.defaultsp = [that.spnames[0].value];
          that.getprojbysp();
        })
        .catch(err => console.log(err));
    },
    getprojbysp() {
      let that = this;
      axios
        .get(
          `/api/GetProjbyUserandSp?_sid=${this.defaultsp[0]}&userid=${
            this.loginuser
          }`
        )
        .then(res => {
          that.projnames = res.data.data.map(i => {
            return {
              label: i.name,
              value: i._id,
              tracks: i.tracks,
              gene: i.gene
            };
          });
          that.defaultproj = [that.projnames[0].value];
          that.currentGene = that.projnames[0].gene;
          that.currentProj = that.projnames[0].value;
          that.getcurrentgene();
          that.gettracksbyproj();
        })
        .catch(err => console.log(err));
    },
    selectproj(proj) {
      this.currentProj = proj[0];
      this.currentGene = this.projnames.filter(
        i => i.value == this.currentProj
      )[0].gene;
      this.getcurrentgene();
      this.gettracksbyproj();
    },
    gettracksbyproj() {
      let that = this;
      axios
        .get("/api/GetTrackByProj?_id=" + this.currentProj)
        .then(res => {
          that.tracks = res.data.data;
          that.currenttrack = [];
        })
        .catch(err => console.log(err));
    },
    //选择基因组数据
    getcurrentgene() {
      let that = this;
      axios
        .get("/api/GetCurrentGene?gene=" + this.currentGene)
        .then(res => {
          that.geneclass = res.data.data.map(i => {
            return {
              label: i,
              value: i
            };
          });
          that.defaultgeneclass = [that.geneclass[0].value];
          that.$emit("GetGeneClass", that.defaultgeneclass[0]);
          that.$emit("GetGene", res.data.meta.FileName);
        })
        .catch(err => console.log(err));
    },
    selectgeneclass() {
      this.$emit("GetGeneClass", this.defaultgeneclass[0]);
    },
    //选择基因数据
    selecttrack() {
      var data = this.currenttrack.map(i => {
        var t = this.tracks.filter(t => {
          return t._id == i;
        })[0];

        return {
          name: t.name,
          class: t.class
        };
      });

      this.$emit("GetTracks", data);
    }
  }
};
</script>
<style scoped>
.projselect {
  margin-bottom: 20px;
}
</style>


