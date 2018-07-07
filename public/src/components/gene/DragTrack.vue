<template>
  <div>
    <el-row>
      <!-- <GenomeTree/>
      <GeneList/> -->
      <projselect @GetGeneClass="GetGeneClass"
                  @GetGene="GetGene"
                  @GetTracks="GetTracks"/>
    </el-row>
    <el-row>
      <el-col :span="24">
        <GeneSlider v-model="sliderBig" 
                    :min='0' 
                    :max='1000' 
                    :step="stepNum" 
                    @drag="bigDrag"
                    fixed/>
        <GeneSlider v-model="sliderSmall"
                    :parent="sliderBig" 
                    :min='minSmall' 
                    :max='maxSmall' 
                    :step="stepNum"
                    @drag="BeginUpdate"/>
      </el-col>
      <el-col :span="24">
        <Genome v-if="GenomeData.name!=''"
                :genename='GenomeName'
                :data="GenomeData" 
                :isUpdate="UpdateCarts"
                :geneclass="CurrentGenome"
                @SelectGenome="SelectGenome"/>
      </el-col>
      <el-col :span="24">
        <draggable v-model="charts">
          <transition-group>
              <GeneTrack  v-for="(item,index) in charts"
                         :key="item.name" 
                         :index="index.toString()"
                         :data="item"
                         :isUpdate="item.UpdateCarts"
                         :geneclass="CurrentGenome"
                         />
          </transition-group>
        </draggable>  
      </el-col>
    </el-row>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import echarts from "echarts";
import uploadGene from "./uploadGene";
import GeneMongo from "./GeneMongo";
import GeneTrack from "./GeneTrack";
import GeneSlider from "./GeneSlider";
import StyleManager from "./StyleManager";
import GeneList from "./GeneList";
import Genome from "./Genome";
import GenomeTree from "./GenomeTree";
import DataZoom from "../controls/DataZoom";
import projselect from "./projselect";
import axios from "axios";
import _ from "lodash";
export default {
  components: {
    DataZoom,
    draggable,
    uploadGene,
    GeneMongo,
    GeneTrack,
    GeneSlider,
    StyleManager,
    Genome,
    GeneList,
    GenomeTree,
    projselect
  },
  data() {
    return {
      GenomeName: "",
      GenomeData: {
        name: "", //susScr11_ensgene
        start: 0,
        end: 10
      },
      CurrentGenome: "",
      activeNames: "",
      sliderBig: [0, 50],
      sliderSmall: [0, 50],
      minSmall: 0,
      maxSmall: 100,
      stepNum: 0,
      currentFile: "",
      UpdateCarts: false,
      charts: [],
      start: 0,
      end: 0,
      /********************************* */
      oldCharts: [],
      oldSliderValue: [0, 100],
      genechange: false,
      geneclasschange: false
    };
  },
  created() {
    //this.GetMaxAndMinNumber();
  },
  methods: {
    //选择基因数据
    GetGene(gene) {
      console.log(gene);
      this.genechange = true;
      this.GenomeData.name = gene;
      this.GenomeName = gene;
      this.refashData();
    },
    GetGeneClass(geneclass) {
      this.geneclasschange = true;
      this.CurrentGenome = geneclass;
      this.GetMaxAndMinNumber(() => {
        this.BeginUpdate();
      });
    },
    GetTracks(tracks) {
      this.charts = tracks.map(val => {
        return {
          name: val.name,
          start: this.start,
          end: this.end,
          isloop: val.class != ".loop",
          UpdateCarts: false
        };
      });
      this.refashnewtrack();
      console.log(this.charts);
    },
    //更新echarts 增量更新
    refashData() {
      if (
        this.oldSliderValue != this.sliderSmall ||
        this.geneclasschange ||
        this.genechange
      ) {
        setTimeout(() => {
          this.UpdateCarts = !(this.UpdateCarts || false);
          this.charts.forEach(i => (i.UpdateCarts = !i.UpdateCarts));
        }, 500);
        this.oldSliderValue = this.sliderSmall;
        this.genechange = false;
        this.geneclasschange = false;
      }
    },
    //增量更新
    refashnewtrack() {
      setTimeout(() => {
        var item = this.charts[this.charts.length - 1];
        if (item) {
          item.UpdateCarts = !(item.UpdateCarts || false);
          console.log(item.name + ":刷新？" + item.UpdateCarts);
        }
      }, 500);
    },
    //更新
    BeginUpdate(val) {
      this.getStartAndEndNum();
      //this.oldCharts = [];
      this.refashData();
    },
    /********************************************************* */
    SelectGenome(val) {
      this.CurrentGenome = val;
    },
    add2render(val) {
      if (val.value.indexOf(".ucsc") > 0) return;
      if (
        this.charts.length == 0 ||
        this.charts.filter(i => i.name == val.value).length == 0
      ) {
        var data = {
          name: val.value,
          start: this.start,
          end: this.end,
          isloop: val.isloop
        };
        this.charts.push(data);
      }
    },
    getStartAndEndNum() {
      this.start = (this.sliderBig[0] + this.sliderSmall[0]) * this.stepNum;
      this.end = (this.sliderBig[0] + this.sliderSmall[1]) * this.stepNum;
      this.charts.forEach(i => {
        i.start = this.start;
        i.end = this.end;
      });
      this.GenomeData.start = this.start;
      this.GenomeData.end = this.end;
    },
    bigDrag(val) {
      //this.UpdateCarts = !this.UpdateCarts;
      this.sliderSmall = [0, 100];
      this.getStartAndEndNum();
    },
    GetMaxAndMinNumber(over) {
      var that = this;
      axios
        .get("/api/GetMaxAndMinNumber")
        .then(res => {
          that.stepNum = Math.round(res.data.data.stepNum);
          over();
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
<style scoped>
.main {
  /* height: 120px; */
  /* width: 100%; */
  /* border-bottom: 1px solid; */
  /* margin-top: 20px; */
}
</style>


