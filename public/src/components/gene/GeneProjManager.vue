<template>
    <div class="projmain">
        <el-col :span="8">
            <el-card :body-style="{ padding: '0px' }">
                <div slot="header" class="clearfix">
                    <span>基因组数据</span>
                </div>
                <el-menu default-active="0">
                    <el-menu-item v-for="(item,index) in genelist" 
                                 :key="index" :index="index.toString()">
                                 {{item}}
                    </el-menu-item>
                </el-menu>
            </el-card>
        </el-col>
        <el-col :span="16">
            <el-card :body-style="{ padding: '0px' }">
                <div slot="header" class="clearfix">
                    <span>基因数据</span>
                </div>
            </el-card>
        </el-col>
    </div>
</template>
<script>
export default {
  data() {
    return {
        genelist:[
            "test","test2"
        ]
    };
  }
};
</script>
<style scoped>
.projmain {
}
</style>


