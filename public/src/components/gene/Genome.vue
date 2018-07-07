<template>
    <div class="main2">

    <div class="border">
      <div class="chartstitle">
      </div>
    </div>
    <div :id="data.name" class="genomestyle"></div>

    </div>
</template>
<script>
import echarts from "echarts";
import axios from "axios";
export default {
  props: ["data", "isUpdate", "geneclass", "genename"],
  data() {
    return {
      chart: {},
      DefaultValue: [],
      GenomeNames: [],
      SpecicesNames: [],
      beginmove: false
    };
  },
  watch: {
    isUpdate(n, o) {
      this.refashData();
    },
    DefaultValue(n, o) {
      this.$emit("SelectGenome", n);
    },
    genename(n, o) {
      this.genename = n;
    }
  },
  methods: {
    refashData() {
      let that = this;
      axios
        .get(
          `/api/GetGeneData?filename=${this.genename}&classname=${
            this.geneclass
          }&start=${this.data.start}&end=${this.data.end}`
        )
        .then(res => {
          if (!res.data.success) return;
          console.log(this.genename + "刷新成功");
          /*************************************************** */
          this.chart.clear();
          this.chart.setOption({
            grid: {
              right: 35,
              bottom: 0,
              top: 0,
              left: 0
            },
            dataZoom: [
              {
                type: "slider",
                yAxisIndex: 0,
                startValue: -1,
                endValue: 8,
                right: 0
              },
              {
                type: "inside",
                yAxisIndex: 0,
                startValue: -1,
                endValue: 8
              }
            ],
            xAxis: {
              type: "value",
              show: false,
              data: res.data.meta.xdata,
              min: that.data.start,
              max: that.data.end,
              axisLabel: { interval: 0 }
            },
            yAxis: {
              data: res.data.meta.groupdata,
              axisLabel: { interval: 0 },
              inverse: true,
              type: "value",
              show: false,
              min: -1,
              max: 20
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

                  var height = api.size([0, 1])[1] * 0.3;

                  var childrens = [];
                  //1. 画半大的方块
                  var isdrawbegin = ts - cs != 0;

                  var begin_start = api.coord([ts, categoryIndex]);
                  var begin_end = api.coord([cs, categoryIndex]);

                  var end_start = api.coord([ce, categoryIndex]);
                  var end_end = api.coord([te, categoryIndex]);

                  var line_start = begin_start;
                  var line_end = end_end;
                  var itemliney = line_start[1] + height * 0.5;

                  if (isdrawbegin) {
                    var begin = {
                      type: "rect",
                      shape: {
                        x: line_start[0],
                        y: itemliney - height * 0.25,
                        width: begin_end[0] - begin_start[0],
                        height: height * 0.5
                      },
                      style: {
                        fill: "#C0C4CC",
                        stroke: zf
                      }
                    };
                    childrens.push(begin);
                  }

                  //画辅助线
                  var itemline = {
                    type: "line",
                    shape: {
                      x1: line_start[0],
                      y1: itemliney,
                      x2: line_end[0],
                      y2: itemliney
                    },
                    style: { stroke: zf },
                    lineWidth: 10
                  };
                  childrens.push(itemline);

                  //3. 画字 false&&
                  var str = api.value(9); //.substring(7)
                  var fontcenter =
                    line_start[0] + (line_end[0] - line_start[0]) * 0.5;

                  //线条的长度大于字体的长度才显示
                  if (line_end[0] - line_start[0] > str.length) {
                    var itemfont = {
                      type: "text",
                      z: 100,
                      style: {
                        text: str,
                        x: fontcenter,
                        y: line_start[1] + height,
                        font: api.font({
                          fontSize: 8
                        }),
                        textAlign: "center"
                      }
                    };
                    childrens.push(itemfont);
                  }

                  //4. 画箭头
                  //+ >||- <
                  var jtlen = 30;
                  var jtwidth = line_end[0] - line_start[0] - jtlen;
                  var jtcount = Math.floor(jtwidth / jtlen);
                  var jtstart = line_start[0] + jtlen;
                  var jty = itemliney;
                  var jtfx = api.value(6) == "+" ? 5 : -5;
                  while (jtcount >= 0) {
                    var jt1 = {
                      type: "polyline",
                      shape: {
                        points: [
                          [jtstart + jtlen * jtcount + jtfx, jty + 2],
                          [jtstart + jtlen * jtcount, jty],
                          [jtstart + jtlen * jtcount + jtfx, jty - 2]
                        ]
                      },
                      style: api.style({
                        stroke: api.value(6) == "+" ? "green" : "blue",
                        fill: null
                      })
                    };
                    childrens.push(jt1);
                    jtcount--;
                  }

                  var tmpttss = ttss.split(",");
                  var tmpttes = ttes.split(",");
                  var tmpindex = tmpttss.length - 1;

                  //画大方块
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
                      var item = {
                        type: "polygon",
                        shape: {
                          points: [
                            [begin[0], begin[1]],
                            [begin[0] + end[0] - begin[0], begin[1]],
                            [begin[0] + end[0] - begin[0], begin[1] + height],
                            [begin[0], begin[1] + height]
                          ]
                        },
                        style: { fill: zf }
                      };
                      childrens.push(item);
                    }

                    tmpindex--;
                  }

                  //5. 画半大方块
                  var isdrawend = te - ce != 0;

                  if (isdrawend) {
                    var end = {
                      type: "rect",
                      shape: {
                        x: end_start[0],
                        y: end_end[1] + height * 0.25,
                        width: end_end[0] - end_start[0],
                        height: height * 0.5
                      },
                      style: {
                        fill: "#C0C4CC",
                        stroke: zf
                      }
                    };
                    childrens.push(end);
                  }

                  return {
                    type: "group",
                    children: childrens
                  };
                },
                data: res.data.data,
                animation: true,
                large: true,
                animationDuration: idx => idx * 30,
                animationDelay: idx => idx * 20
              }
            ]
          });
          /*************************************************** */
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    var dom = document.getElementById(this.data.name);
    this.chart = echarts.init(dom);
    this.chart.setOption({
      grid: {
        right: 35,
        bottom: 0,
        top: 0,
        left: 0
      },
      xAxis: {
        type: "value",
        show: false
      },
      dataZoom: [
        {
          type: "slider",
          yAxisIndex: 0,
          startValue: -1,
          endValue: 8,
          throttle: 0
          // right: 20
        },
        {
          type: "inside",
          yAxisIndex: 0,
          startValue: -1,
          endValue: 8,
          throttle: 0,
          zoomLock: true
        }
      ],
      yAxis: {
        inverse: true,
        type: "value",
        show: false,
        min: -1,
        max: 20
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
.main2 {
  height: 240px;
}
.genomestyle {
  left: 25px;
  position: absolute;
  width: 100%;
  height: 240px;
}

.border {
  left: 25px;
  width: 100%;
  height: 240px;
  position: absolute;
  border-left: 1px solid black;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>


