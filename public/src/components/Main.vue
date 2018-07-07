<template>        
  <section class="chart">
    <el-row>
      <el-col :span="24">
          <el-checkbox v-model="i.checked" v-for="i in showList"  :key="i.id" :label="i.label">
          </el-checkbox>
      </el-col>
      <el-col :span="12">
          <el-upload
            class="upload-base"
            drag
            action="/api/UploadFile"
            multiple
            auto-upload
            accept="Gene|*.bed"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__text">注意仅允许基因数据*.bed|*.ucsc</div>
          </el-upload>

      </el-col>
      <el-col :span="12">
          <el-form ref="FileManager" :model="FileManager" label-width="80px">
            <el-form-item label="文件名称">
              <el-input v-model="FileManager.name"></el-input>
            </el-form-item>
            <el-form-item label="入库">
              <el-button  type="primary" round>插入数据库</el-button>
            </el-form-item>
          </el-form>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span>文件列表</span>
          </div>
          <el-menu :default-active="default_active" @select="handleselect" >
            <el-menu-item v-for="(item,index) in FileList" :index="item.index" :key="index">{{item.name}}</el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="12"><el-input v-model="SliderSmall.Start" /></el-col>
      <el-col :span="12"><el-input v-model="SliderSmall.End" /></el-col>
      <el-col :span="24">
        <vueSlider 
        v-model="Slider.value" 
                :interval='Slider.interval' 
                fixed 
                processDragable 
                @drag-end="SliderCallBack"
                :tooltip='Slider.showtooltip' 
                :min='Slider.min'
                :max='Slider.max'>
        </vueSlider>

        <vueSlider 
        v-model="SliderSmall.value" 
                :interval='SliderSmall.interval' 
                fixed 
                processDragable 
                @drag-end="SliderSmallCallBack"
                :tooltip='SliderSmall.showtooltip' 
                :min='SliderSmall.min'
                :max='SliderSmall.max'>
        </vueSlider> 
      </el-col>
    </el-row>

    <el-row>
        <el-col :span="12" v-for="(i,index) in showList" :key="index" v-show="i.checked">
          <el-card :body-style="{ padding: '0px' }">
            <div :id="i.id" style="width:100%; height:200px;"></div>
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <time class="time">{{ currentDate }}</time>
                <el-button type="text" class="button">操作按钮</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
    </el-row>
    
  </section>
</template>

<script>
import echarts from "echarts";
import axios from "axios";
import vueSlider from "vue-slider-component";

export default {
  components: {
    vueSlider
  },
  data() {
    return {
      Slider: {
        min: 0,
        max: 10000,
        interval: 1,
        value: [0, 500],
        StepNum: 0,
        showtooltip: false
      },
      SliderSmall: {
        min: 0,
        max: 1000,
        interval: 1,
        value: [0, 50],
        showtooltip: false,
        Start: 0,
        End: 1
      },

      TrackData: {
        YMin: 0,
        YMax: 100,
        XMin: 0,
        XMax: 100,
        datamin: 0,
        datamax: 100
      },
      FileManager: {
        name: ""
      },
      FileList: [],
      default_active: "1",
      showList: [
        { id: "GeneChart", label: "Gene", checked: true },
        { id: "TrackChart", label: "Track", checked: true }
      ],
      currentDate: new Date(),
      TrackChart: null,
      GeneChart: null
    };
  },
  created() {
    this.GetMaxAndMinNumber();
    this.GetFileList();
    this.default_active = "1";
  },
  methods: {
    GetMaxAndMinNumber() {
      var that = this;
      axios
        .get("/api/GetMaxAndMinNumber")
        .then(res => {
          that.Slider.StepNum = Math.round(res.data.data.stepNum);
          that.SliderSmall.Start = 0;
          that.SliderSmall.End = that.Slider.StepNum * 5;
        })
        .catch(err => console.log(err));
    },
    SliderCallBack() {
      this.SliderSmall.min = 0;
      this.SliderSmall.max = this.Slider.value[1] - this.Slider.value[0];
      this.SliderSmall.value = [
        0,
        (this.SliderSmall.max - this.SliderSmall.min) * 0.05
      ];

      var smallstep = this.Slider.StepNum * 0.1;
      var bigvalue = this.Slider.value[0] * this.Slider.StepNum;
      this.SliderSmall.Start = Math.round(
        this.SliderSmall.value[0] * smallstep + bigvalue
      );
      this.SliderSmall.End = Math.round(
        this.SliderSmall.value[1] * smallstep + bigvalue
      );
      this.refashGeneData();
      this.refashTrackData();
    },
    SliderSmallCallBack() {
      var smallstep = this.Slider.StepNum * 0.1;
      var bigvalue = this.Slider.value[0] * this.Slider.StepNum;
      this.SliderSmall.Start = Math.round(
        this.SliderSmall.value[0] * smallstep + bigvalue
      );
      this.SliderSmall.End = Math.round(
        this.SliderSmall.value[1] * smallstep + bigvalue
      );

      this.refashGeneData();
      this.refashTrackData();
    },
    handleselect(key) {
      this.FileManager.name = this.FileList.find(i => i.index == key).name;
    },
    UpLoadFile(file) {},
    GetFileList() {
      let that = this;
      axios
        .get("/api/GetFileList")
        .then(res => {
          that.FileList = res.data.data;
          that.FileManager.name = res.data.data[0].name;
        })
        .catch(err => console.log(err));
    },
    beforeAvatarUpload(file) {
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
    refashTrackData() {
      var that = this;
      axios
        .get(
          `/api/GetGeneData?filename=JCBrowser.neg.testing.bed&start=${
            this.SliderSmall.Start
          }&end=${this.SliderSmall.End}`
        )
        .then(res => {
          let xdatas1 = res.data.data.data.map(i => i[0]);
          let xdatas2 = res.data.data.data.map(i => i[1]);
          let ydatas = res.data.data.data.map(i => i[2]);

          that.TrackData.YMin = Math.min.apply(null, ydatas) - 5;
          that.TrackData.YMax = Math.max.apply(null, ydatas) + 5;
          that.TrackData.YMax =
            that.TrackData.YMax < 0 ? 4 : that.TrackData.YMax;

          that.TrackData.XMin = Math.min.apply(null, xdatas1) - 1;
          that.TrackData.XMax = Math.max.apply(null, xdatas2) + 1;

          this.TrackChart.setOption({
            xAxis: [
              {
                type: "value",
                min: that.TrackData.XMin,
                max: that.TrackData.XMax
              }
            ],
            yAxis: [
              {
                type: "value",
                min: that.TrackData.YMin,
                max: that.TrackData.YMax
              }
            ],
            series: [
              {
                type: "custom",
                renderItem: (params, api) => {
                  var x1 = api.value(0);
                  var x2 = api.value(1);
                  var y = api.value(2);
                  var start = api.coord([api.value(0), y]);
                  var end = api.coord([api.value(1), y]);
                  var size = api.coord([api.value(0) - api.value(1), y]);
                  var zeroheight = api.coord([0, 0])[1];
                  var height = api.coord([0, y * 2])[1];
                  var style = api.style();
                  return {
                    type: "bezierCurve",
                    shape: {
                      x1: start[0],
                      x2: end[0],
                      cpx1: start[0] + (end[0] - start[0]) / 2,
                      y1: zeroheight,
                      y2: zeroheight,
                      cpy1: height,
                      percent: [0, 1]
                    },
                    style: {
                      fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                          offset: 0,
                          color: "rgb(100, 200, 68)"
                        },
                        {
                          offset: 1,
                          color: "rgb(125, 200, 131)"
                        }
                      ]),
                      stroke: "black"
                    }
                  };
                },
                data: res.data.data.data
              }
            ]
          });
        });
    },
    refashGeneData() {
      var that = this;
      axios
        .get(
          `/api/GetGeneData?filename=susScr11_ensgene.ucsc&start=${
            this.SliderSmall.Start
          }&end=${this.SliderSmall.End}`
        )
        .then(res => {
          this.GeneChart.setOption({
            xAxis: {
              data: res.data.meta.xdata,
              min: that.SliderSmall.Start,
              max: that.SliderSmall.End,
              axisLabel: {
                interval: 0
              }
            },
            yAxis: {
              data: res.data.meta.groupdata,
              //type: "value",
              axisLabel: {
                interval: 0
              }
            },
            series: [
              {
                type: "custom",
                renderItem: (params, api) => {
                  var categoryIndex = api.value(1);

                  var ts = api.value(2);
                  var te = api.value(3);
                  var cs = api.value(4);
                  var ce = api.value(5);
                  var zf = api.value(6) == "+" ? "green" : "blue";
                  var ttss = api.value(7);
                  var ttes = api.value(8);

                  var height = api.size([0, 1])[1] * 0.6;

                  var childrens = [];
                  //1. 画半大的方块
                  var isdrawbegin = ts - cs != 0;

                  var begin_start = api.coord([ts, categoryIndex]);
                  var begin_end = api.coord([cs, categoryIndex]);

                  var end_start = api.coord([ce, categoryIndex]);
                  var end_end = api.coord([te, categoryIndex]);

                  if (isdrawbegin) {
                    var begin = {
                      type: "rect",
                      shape: {
                        x: begin_start[0],
                        y: begin_start[1] - height * 0.25 - height,
                        width: begin_end[0] - begin_start[0],
                        height: height * 0.5
                      },
                      style: { fill: zf }
                    };

                    childrens.push(begin);
                  }

                  var line_start = api.coord([ts, categoryIndex]);
                  var line_end = api.coord([te, categoryIndex]);

                  //画辅助线
                  var itemline = {
                    type: "rect",
                    shape: {
                      x: line_start[0] - 10,
                      y: line_start[1] - height * 0.125 * 0.5 * 0.5 - height,
                      width: line_end[0] - line_start[0] + 20,
                      height: height * 0.25 * 0.5 * 0.5
                    },
                    style: { fill: zf },
                    lineWidth: 10
                  };
                  childrens.push(itemline);

                  var tmpttss = ttss.split(",");
                  var tmpttes = ttes.split(",");
                  var tmpindex = tmpttss.length - 1;

                  while (tmpindex >= 0) {
                    var begin = api.coord([tmpttss[tmpindex], categoryIndex]);
                    var end = api.coord([tmpttes[tmpindex], categoryIndex]);

                    if (begin[0] < begin_end[0] && begin[0] < begin_start[0]) {
                    } else if (
                      begin[0] == begin_start[0] &&
                      end[0] == begin_end[0]
                    ) {
                    } else {
                      if (begin[0] < begin_end[0]) {
                        begin = begin_end;
                      }
                      if (end[0] > end_start[0]) {
                        end = end_start;
                      }
                      //画大方块
                      var item = {
                        type: "rect",
                        shape: {
                          x: begin[0],
                          y: begin[1] - height * 0.5 - height,
                          width: end[0] - begin[0],
                          height: height
                        },
                        style: { fill: zf }
                      };
                      childrens.push(item);
                    }

                    tmpindex--;
                  }

                  //3. 画半大方块
                  var isdrawend = te - ce != 0;

                  if (isdrawend) {
                    var end = {
                      type: "rect",
                      shape: {
                        x: end_start[0],
                        y: end_end[1] - height * 0.25 - height,
                        width: end_end[0] - end_start[0],
                        height: height * 0.5
                      },
                      style: { fill: zf }
                    };
                    childrens.push(end);
                  }

                  return {
                    type: "group",
                    children: childrens
                  };
                },
                data: res.data.data
              }
            ]
          });
        })
        .catch(err => console.log(err));
    }
  },
  mounted: function() {
    var _this = this;
    /************************************************************************ */
    /************************************************************************ */
    /************************************************************************ */
    this.TrackChart = echarts.init(document.getElementById("TrackChart"));
    this.GeneChart = echarts.init(document.getElementById("GeneChart"));
    this.TrackChart.setOption({
      title: {
        text: "Track数据",
        subtext: "动物基因曲线图"
      },
      calculable: true,
      xAxis: [
        {
          type: "value",
          min: 1700
        }
      ],
      yAxis: [
        {
          type: "value",
          min: this.TrackData.datamin,
          max: this.TrackData.datamax
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: []
    });

    this.GeneChart.setOption({
      title: {
        text: "Gene数据",
        subtext: "动物基因方块图"
      },
      xAxis: {},
      yAxis: {
        data: [0, 1, 2, 3, 4, 5],
        show: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: []
    });

    /************************************************************************ */
    /************************************************************************ */
    /************************************************************************ */
  }
};
</script>

<style scoped>
.custom-label {
  height: 12px;
  width: 12px;
  background-color: "#ccc";
  visibility: visible;
  font-size: 1px;
}

.chart {
  width: 100%;
  float: left;
}
.el-col {
  padding: 30px 20px;
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>