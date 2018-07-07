<template>
    <div class="main">
        <span v-if="parent">
            RealValue:{{[(parent[0]+tmpValue[0])*step,
                         (parent[0]+tmpValue[1])*step,
                         (parent[0]+tmpValue[1])*step-(parent[0]+tmpValue[0])*step
                         ]}}
        </span>
        <span v-else>
            RealValue:{{[(tmpValue[0])*step,(tmpValue[1])*step]}}
        </span>
        <br>
        <!-- Value:{{[tmpValue[0],tmpValue[1]]}} -->
        <br>
        <span v-show="parent">
            <!-- ParentValue:{{parent}} -->
        </span>
        <vueSlider  @drag-end="drag"
                    :fixed='fixed'
                    v-model="tmpValue"
                    :interval="interval"
                    processDragable
                    :tooltip="showtooltip"
                    :min='min'
                    :max='max'>
        </vueSlider>
        
    </div>
</template>
<script>
import vueSlider from "vue-slider-component";
export default {
  components: {
    vueSlider
  }, //
  props: ["value", "min", "max", "step", "parent", "fixed"],
  data() {
    return {
      showtooltip: true,
      interval: 1,
      tmpValue: [0, 1],
      tmpStep: 0
    };
  },
  watch: {
    value(n, o) {
      this.tmpValue = n;
    }
  },
  created() {
    this.tmpValue = this.value;
  },
  methods: {
    drag(value) {
      this.$emit("input", this.tmpValue);
      this.$emit("drag", this.tmpValue);
    }
  }
};
</script>
<style scoped>
</style>


