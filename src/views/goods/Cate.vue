<template>
  <div id="cate">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot-scope="scope" slot="order">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level==2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-edit" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager,jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="提示" :visible.sync="addCateDialogVisble" width="50%" @close="addCateDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form ref="addCateformRef" :rules="addCateformRules" :model="addCateform" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateform.cat_name"></el-input>
        </el-form-item>
        <!-- options指定数据源 -->
        <!-- props用来指定配置对象 -->
        <el-form-item label="父级分类">
          <el-cascader expand-trigger='hover' v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChanged" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类名称 -->
    <el-dialog title="修改分类名" :visible.sync="cateNameDialog" width="50%">
      <el-form :model="cateform" :rules="cateFormRules" ref="cateFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateform.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateNameDialog = false">取 消</el-button>
        <el-button type="primary"  @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      //查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          // 表示 将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok"
        },
        {
          label: "排序",
          // 表示 将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order"
        },
        {
          label: "操作",
          // 表示 将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt"
        }
      ],
      // 控制添加分类对话框的显示
      addCateDialogVisble: false,
      // 添加分类的表单数据对象
      addCateform:{
        cat_name:'',//将要添加的分类的名称
        cat_pid:0,//父级分类的id
        cat_level:0,//分类的等级，默认为一级分类
      },
      addCateformRules:{
        cat_name:[
          {required:true,message:"请添加分类名称",trigger:'blur'}
        ]
      },
      // 父级分类的数据列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      // 选中的父级分类的id数组
      selectedKeys:[],
      cateNameDialog:false,
      //获取到的商品数据
      cateform:{},
      cateFormRules:{
        cat_name:[
          {required:true,message:"请输入分类名称",trigger:'blur'}
        ]
      },
      asdsa:'达年代阿萨德',
    };
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.querInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败");
      }
      // console.log(res);
      this.catelist = res.data.result;
      this.total = res.data.total;
      // return this.$message.success("更改用户状态成功")
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 按钮控制添加分类对话框的显示
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisble = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
      const { data: res } = await this.$http.get("categories",{params:{type:2}})
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败");
      }
      // console.log(res);
      this.parentCateList = res.data;
    },
    // 选择项发生变化触发这个函数
    parentCateChanged(){
      // console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0,证明选中了父级分类，反之说明没有选中父级分类
      if(this.selectedKeys.length>0){
        // 父级分类的id
        this.addCateform.cat_pid=this.selectedKeys[this.selectedKeys.length-1],
        // 父级分类的等级
        this.addCateform.cat_level=this.selectedKeys.length
        return
      }else{
        this.addCateform.cat_pid=0
        this.addCateform.cat_level=0
      }
      this.getCateList()
    },
    // 点击分类添加
    addCate(){
      this.$refs.addCateformRef.validate(async valid=>{
        if(!valid) return
        const {data:res}= await this.$http.post('categories',this.addCateform)
        console.log(res)
        if (res.meta.status !== 201) {
        return this.$message.error("添加分类失败");
      }
      this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisble=false;
      })
    },
    addCateDialogClosed(){
      this.$refs.addCateformRef.resetFields();
      this.selectedKeys=[];
      this.addCateform.cat_level=0
      this.addCateform.cat_pid=0
    },
    async showCateDialog(id){
      // console.log(id)
      const { data: res } = await this.$http.get(`categories/${id}`,)
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品信息失败");
      }
      this.cateform=res.data;
      this.cateNameDialog = true;
      // console.log(res);
    },
    async editCateInfo(){
      const { data: res } = await this.$http.put(`categories/${this.cateform.cat_id}`,{cat_name:this.cateform.cat_name})
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("更新商品名称失败");
      }
      this.getCateList()
      this.cateNameDialog = false;
      return this.$message.success("更新商品名称成功");
    },
    async removeCateById(id){
        const confirmResult=await this.$confirm('你确定要删除这个分类吗?', '提示', {
          confirmButtonText: '滚吧',
          cancelButtonText: '取消',
          type: 'warning'
                  //箭头函数内容只有一行时可以简写
        }).catch(err=>err)
        if(confirmResult !=='confirm'){
            return this.$message.info('已经取消删除')
        }
        const {data:res} = await this.$http.delete('categories/'+id)
        if(res.meta.status !==200){
            return this.$message.error('删除分类失败')
        }
        this.getCateList()
        this.$message.success("删除分类成功")
    },
  },
  created() {
    this.getCateList();
  }
};
</script>

<style scopedss>
.tree-table {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>