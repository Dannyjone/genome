<template>
    <div class="dzmain">
        <div class="dzborder" ref="dzborder" >
            <div v-if="maxwidth!=0"
                 ref="mydrag"
                 :style="style" 
                 v-mydrag="{max:maxwidth}" 
                 class="drag">
            </div>
        </div>
        <GeneSlider v-model="value"  
                    :min='0' 
                    :max='1000' />
    </div>
</template>

<script>
import GeneSlider from "../gene/GeneSlider";
export default {
  components: { GeneSlider },
  data() {
    return {
      style: {
        position: "absolute",
        left: "0px",
        top: 0
      },
      maxwidth: 0,
      value: [0, 100]
    };
  },
  mounted() {
    this.maxwidth = this.$refs.dzborder.clientWidth;
  },
  directives: {
    mydrag: {
      bind(el, binding, vnode) {
        let oDiv = el;
        let self = this;
        console.log(binding.value);
        oDiv.onmousedown = function(e) {
          let disX = e.clientX - oDiv.offsetLeft;
          document.onmousemove = function(e) {
            let l = e.clientX - disX;
            if (l < 0) l = 0;
            if (l > binding.value.max) l = binding.value.max;
            //console.log(`l:${l} max:${this.maxwidth}`);
            oDiv.style.left = l + "px";
            //binding.value({ x: e.pageX });
          };
          document.onmouseup = function(e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
  },
  methods: {
    //move(val) {}
  }
};
</script>

<style scoped>
.dzmain {
  height: 100%;
  width: 100%;
}
.dzborder {
  border: 1px solid #909399;
  height: 20px;
  position: relative;
}
.drag {
  border-left: 3px solid #303133;
  border-right: 3px solid #303133;
  border-top: 1px solid #303133;
  border-bottom: 1px solid #303133;
  height: 18px;
  width: 40px;
  background: #409eff;
  opacity: 0.3;
}
</style>


