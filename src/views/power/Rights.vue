<template>
  <div id="right">
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                    <el-tag type="success" v-if="scope.row.level==='1'">二级</el-tag>
                    <el-tag type="warning" v-if="scope.row.level==='2'">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'right',
  data(){
      return{
          //权限列表
          rightsList:[],
      }
  },
  methods:{
        async  getRightList(){
        const {data:res}=await this.$http.get("rights/list")
        if(res.meta.status !==200){
            return this.$message.error('获取权限列表失败');
        }
        this.rightsList = res.data;
        // console.log(this.rightsList)
      },
  },
  created(){
      this.getRightList();
  }
}
</script>

<style scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
</style>