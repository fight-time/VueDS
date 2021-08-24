<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区 -->
      <el-table :data="goodslist" border stripe>
          <el-table-column type='index'></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格" prop="goods_price" width="90px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="160px">
              <template slot-scope="scope">
                  {{scope.row.add_time | dataFormat}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
              </template>
          </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "App",
  data(){
      return{
        //   查询参数对象
          queryInfo:{
              query:'',
              pagenum:1,
              pagesize:10
          },
          goodslist:[],
          total:0,
      }
  },
  created(){
      this.getGoodsList()
  },
  methods:{
    //   根据分页获取对应的商品列表
     async getGoodsList(){
        const { data: res } = await this.$http.get("goods",{params:this.queryInfo});
        if (res.meta.status !== 200) {
            return this.$message.error("获取商品列表失败");
        }
        console.log(res);
        this.goodslist = res.data.goods;
        this.total = res.data.total;
        // this.getGoodsList()
        // return this.$message.success("获取商品列表成功");
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize=newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getGoodsList()
    },
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "你确定要删除该商品吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
          //箭头函数内容只有一行时可以简写
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete(
        `goods/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败");
      }
      this.getGoodsList();
      this.$message.success("删除参数成功");
    },
    goAddpage(){
      this.$router.push('./goods/add')
    }
  }
};
</script>

<style scoped>
.el-table{
    margin-top:15px;
}
</style>