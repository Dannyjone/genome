<template>
<el-col :span="6">
    <el-card :body-style="{ padding: '0px' }">
        <div slot="header" class="clearfix">
            <span>基因组列表</span>    
            <el-popover
                @hide='newproj.isshow=false'
                v-model="newproj.isshow"
                placement="right"
                width="400"
                trigger="click">
                <el-form ref="newproj" 
                         :model="newproj" 
                         label-width="80px">
                    <el-form-item label="项目所属">
                        <el-input disabled v-model="newproj.class"/>
                    </el-form-item>     
                    <el-form-item label="项目名称">
                        <el-input v-model="newproj.name"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="newproject">立即创建</el-button>
                        <el-button @click="newproj.isshow=false">取消</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="text" @click="newproj.isshow=true"
                           style="float: right; padding: 3px 3px" 
                           slot="reference">新建项目</el-button>
            </el-popover>
        </div>
        <el-tree
            @check-change='selectnode'
            ref="tree"
            node-key='key'
            :default-checked-keys=defaultnode
            :default-expanded-keys=defaultnode
            :data="treedata"
            show-checkbox
            :expand-on-click-node=false
            check-on-click-node
            auto-expand-parent
            check-strictly  
            highlight-current
            accordion>
            <span class="custom-tree-node" slot-scope="{ node, data }">
                test
            </span>
        </el-tree>  
    </el-card>
</el-col>
</template>

<script>
export default {
  data() {
    return {
      newproj: {
        isshow: false,
        class: "",
        name: "默认项目",
        id: ""
      },
      defaultnode: [0],
      checkednode: null,
      treedata: [
        {
          key: 0,
          label: "猪基因组",
          root: true,
          children: [
            { label: "工程 1", key: 2 },
            { label: "工程 2", key: 3 },
            { label: "工程 3", key: 4 }
          ]
        },
        {
          key: 1,
          label: "人基因组",
          root: true,
          children: [
            { label: "工程 4", key: 5 },
            { label: "工程 5", key: 6 },
            { label: "工程 6", key: 7 }
          ]
        }
      ]
    };
  },
  created() {
    // this.checkednode = this.treedata[0];
    // this.newproj.class = this.checkednode.label;
    this.$refs.tree.setCurrentKey([0]);
  },
  methods: {
    newproject() {},
    selectnode(node) {
      if (node.root) {
        this.newproj.class = node.label;
      }
    }
  }
};
</script>

</style>

