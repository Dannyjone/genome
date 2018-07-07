<template>
   <el-form :label-position="labelPosition" 
             label-width="80px" 
            :model="StyleModel">
        <el-form-item label="线条颜色">
            <el-color-picker v-model="StyleModel.linecolor"></el-color-picker>
        </el-form-item>
        <el-form-item label="填充色1">
            <el-color-picker show-alpha v-model="StyleModel.background1"></el-color-picker>
        </el-form-item>
        <el-form-item label="填充色2">
            <el-color-picker show-alpha v-model="StyleModel.background2"></el-color-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
   </el-form>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {
      labelPosition: "right",
      StyleModel: {
        linecolor: "rgb(0, 0,0)",
        background1: "rgb(100, 200, 68)",
        background2: "rgb(125, 200, 131)"
      }
    };
  },
  methods: {
    cancel() {
      this.StyleModel = {
        linecolor: "rgb(0, 0,0)",
        background1: "rgb(100, 200, 68)",
        background2: "rgb(125, 200, 131)"
      };
      this.$emit("input", this.StyleModel);
      this.$emit("change", this.StyleModel);
    },
    onSubmit() {
      this.$emit("input", this.StyleModel);
      this.$emit("change", this.StyleModel);
    }
  }
};
</script>
<style scoped>
</style>


