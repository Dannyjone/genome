<template>
  <div class="trackmain">

    <div class="border">
      <div class="chartstitle">
        <el-popover
          :popper-class='propstyle'
          placement="right"
          width="400"
          trigger="click">  
          <div style="height:300px">
            <div slot="header" class="head">
              <span style="font-size:20px">{{this.data.name}}设置</span>
            </div>

            <el-form ref="chartinfo" :model="chartinfo" label-width="80px">
              <el-form-item label="Y轴反转">
                <el-switch v-model="chartinfo.inverseY"></el-switch>
              </el-form-item>
              
              <el-form-item label="Y轴高度">
                <template>
                  <el-input-number v-model="miny" 
                    label="Y轴最小值" />
                  <el-input-number v-model="maxy" 
                    label="Y轴最大值" />
                </template>
              </el-form-item>

              <el-form-item v-if="chartinfo.currenttrack ==''" label="外框颜色">
                <el-color-picker v-model="chartinfo.linecolor"></el-color-picker>
              </el-form-item>
              <el-form-item v-if="chartinfo.currenttrack ==''" label="填充颜色">
                <template>
                  <el-color-picker show-alpha v-model="chartinfo.background1"></el-color-picker>
                  <el-color-picker v-if="!data.isloop" show-alpha v-model="chartinfo.background2"></el-color-picker>
                </template>
              </el-form-item>
              <el-form-item label="合并展示">
                <el-select multiple v-model="chartinfo.currenttrack" placeholder="请选择">
                  <el-option
                    v-for="item in chartinfo.tracks"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>

          </div>
          <div slot="reference" class="title">
            {{this.data.name}}
          </div>
        </el-popover>
      </div>
    </div>
    <div :id="data.name" :style="MainStyle"  class="charts"></div>
  </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
export default {
  props: [
    "height",
    "data",
    "isUpdate",
    "background1",
    "background2",
    "linecolor",
    "geneclass"
  ],
  data() {
    return {
      propstyle: "trackpopover",
      chart: {},
      chartinfo: {
        inverseY: false,
        linecolor: "rgb(100, 200, 68)",
        background1: "rgba(100, 200, 68,0.5)",
        background2: "rgba(125, 200, 131,0.25)",
        tracks: [
          { label: "测试1", value: "1" },
          { label: "测试2", value: "2" },
          { label: "测试3", value: "3" },
          { label: "测试4", value: "4" }
        ],
        currenttrack: ""
      },
      currentdata: [],
      miny: 0,
      maxy: 0,
      interval: 0
    };
  },
  watch: {
    isUpdate(n, o) {
      this.getdata(() => this.refashData());
    },
    "chartinfo.inverseY"(n, o) {
      this.refashData();
    },
    "chartinfo.linecolor"(n, o) {
      this.refashData();
    },
    "chartinfo.background1"(n, o) {
      this.refashData();
    },
    "chartinfo.background2"(n, o) {
      this.refashData();
    },
    miny(n, o) {
      this.refashData();
    },
    maxy(n, o) {
      this.refashData();
    }
  },
  computed: {
    MainStyle() {
      return {
        height: this.Height
      };
    }
  },
  methods: {
    getdata(cb) {
      console.log(this.data.name + "刷新开始拉！！！");
      var that = this;
      axios
        .get(
          `/api/GetGeneData?filename=${this.data.name}&start=${
            this.data.start
          }&end=${this.data.end}&classname=${this.geneclass}&geneclass=0`
        )
        .then(res => {
          if (res.data.success) {
            console.log(this.data.name + "刷新完成拉！！！");
            that.currentdata = res.data.data.data;
            that.miny = res.data.data.minh;
            that.maxy = res.data.data.maxh;
            that.interval = res.data.data.interval;
            cb();
          }
        })
        .catch(err => console.log(err));
    },
    refashData() {
      var that = this;
      if (!this.data.isloop) {
        that.chart.setOption({
          xAxis: [
            {
              type: "value",
              min: that.data.start,
              max: that.data.end
            }
          ],
          yAxis: [
            {
              type: "value",
              min: that.miny,
              max: that.maxy,
              interval: that.interval,
              inverse: this.chartinfo.inverseY
            }
          ],
          series: {
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
                  cpx1: start[0] + (end[0] - start[0]) / 40,
                  cpx2: start[0] + (end[0] - start[0]) / 40 * 39,
                  y1: zeroheight,
                  y2: zeroheight,
                  cpy1: height,
                  cpy2: height,
                  percent: [0, 1]
                },
                style: {
                  fill: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: that.chartinfo.background1
                    },
                    {
                      offset: 1,
                      color: that.chartinfo.background2
                    }
                  ]),
                  stroke: that.chartinfo.linecolor
                }
              };
            },
            data: that.currentdata,
            large: true,
            animationDuration: idx => idx * 30,
            animationDelay: idx => idx * 20
          }
        });
      } else {
        that.chart.setOption({
          xAxis: [
            {
              type: "value",
              min: that.data.start - 5,
              max: that.data.end
            }
          ],
          yAxis: [
            {
              type: "value",
              min: that.miny,
              max: that.maxy,
              interval: that.interval,
              inverse: this.chartinfo.inverseY
            }
          ],
          series: {
            type: "custom",
            renderItem: (params, api) => {
              var y = api.value(2);
              var start = api.coord([api.value(0), y]);
              var end = api.coord([api.value(1), y]);
              var height = api.coord([0, y])[1];
              var zeroheight = api.coord([0, 0])[1];
              var center = (end[0] - start[0]) * 0.5;
              var style = api.style({
                stroke: that.chartinfo.linecolor,
                fill: that.chartinfo.background1
              });
              return {
                type: "polyline",
                shape: {
                  points: [
                    [start[0] - 2, zeroheight],
                    [start[0] + center, height],
                    [end[0] + 2, zeroheight]
                  ]
                },
                style: style
              };
            },
            data: that.currentdata,
            large: true,
            animationDuration: idx => idx * 30,
            animationDelay: idx => idx * 20
          }
        });
      }
    },
    //获取与自己类型相同的所有的track名称
    gettrackdata() {}
  },
  mounted() {
    var dom = document.getElementById(this.data.name);
    this.chart = echarts.init(dom);
    this.chart.setOption({
      // title: {
      //   text: this.data.name
      // },
      grid: {
        show: false,
        right: 15,
        bottom: 0,
        top: 0,
        left: 24
      },
      // toolbox:{
      //   show: true,
      //   feature: {
      //       restore: {},
      //       saveAsImage: {}
      //   }
      // },
      xAxis: {
        type: "value",
        show: false,
        splitLine: {
          show: false
        }
      },
      yAxis: {
        inverse: this.chartinfo.inverseY,
        splitLine: {
          show: false
        },
        nameTextStyle: {
          fontSize: 8,
          verticalAlign: "bottom",
          lineHeight: 56
        }
      }
    });
    window.onresize = () => {
      return (() => {
        this.chart.resize();
      })();
    };
  }
};
</script>
<style scoped>
.trackmain {
  height: 100px;
  margin-top: 10px;
}
.charts {
  position: absolute;
  width: 100%;
  height: 100px;
}
.border {
  left: 25px;
  width: 100%;
  height: 100px;
  position: absolute;
  border-bottom: 1px solid black;
  border-top: 1px solid black;
}
.chartstitle {
  float: right;
  width: 20px;
  height: 100%;
}

.title {
  width: 20px;
  color: #409eff;
  height: 100%;
  margin: 0 auto;
  font-size: 14px;
  float: right;
  text-align: center;
  vertical-align: middle;
  word-wrap: break-word;
  border-left: 1px solid black;
  border-right: 1px solid black;
}
</style>


