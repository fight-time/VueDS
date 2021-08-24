<template>
  <div id="users">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsers(queryInfo)"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUsers(queryInfo)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">
          <!-- 修改用户 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <!-- 删除用户 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
          <!-- 分配角色 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="addRole(scope.row)"></el-button>
          </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser(addForm)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户的对话框 -->
    <!-- <template>
      <el-button type="text" @click="removeUserById">点击打开 Message Box</el-button>
    </template> -->
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="30%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import {getUser,addUsers} from "@/api/users.js";
export default {
  name: "users",
  data() {

    // 验证邮箱的规则
    var checkEmail = (rule,value,cb)=>{
      const regEmail = /^([a-zA-z0-9_-])+@([a-zA-z0-9_-])+([a-zA-z0-9_-])+/
      if(regEmail.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule,value,cb)=>{
      //验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if(regMobile.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      queryInfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 4
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与影藏
      addDialogVisible:false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible:false,
      //控制分配角色对话框的显示
      setRoleDialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      //查询到的用户信息对象
      editForm:{},
      //需要被分配角色的用户信息
      userInfo:{},
      //所有角色的数据列表
      rolesList:[],
      //已选中的roleId值
      selectedRoleId:'',
      // 添加表单的验证规则对象
      addFormRules:{
        username:[
          {required:true,message:"请输入用户名",trigger:'blur'},
          {min:3,max:10,message:"用户名的长度在3~10个之间",trigger:'blur'}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:'blur'},
          {min:3,max:10,message:"用户名的长度在3~10个之间",trigger:'blur'}
        ],
        email:[
          {required:true,message:"请输入邮箱",trigger:'blur'},
          // {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:"请输入电话",trigger:'blur'},
          // {validator:checkMobile,trigger:'blur'}
        ]
      },
      editFormRules:{
        email:[
          {required:true,message:"请输入用户邮箱",trigger:'blur'},
          // {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:"请输入用户电话",trigger:'blur'},
          // {validator:checkMobile,trigger:'blur'}
        ]
      }
    };
  },
  methods: {
    getUsers(queryInfo) {
      getUser(queryInfo).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！");
        }
        this.userlist = res.data.data.users;
        this.total = res.data.data.total;
        console.log(res);
      });
    },
    //监听 pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUsers(this.queryInfo);
    },
    //监听 页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage;
      this.getUsers(this.queryInfo);
    },
    //监听switch开关状态的改变
    async userStateChange(userinfo) {
      // console.log(userinfo);
      const {data:res} = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if(res.meta.status!==200){
        userinfo.mg_state=!userinfo.mg_state
        return this.$message.error("修改用户状态失败")
      }
      return this.$message.success("更改用户状态成功")
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    //点击按钮添加新用户
    addUser(addForm){
      console.log(addForm);
      this.$refs.addFormRef.validate(valid=>{
        if(!valid)return
        //如果通过就发送添加新用户请求
        addUsers(addForm).then(res => {
          if (res.data.meta.status !== 201) {
            console.log(res.data.meta.status)
            console.log(res.data)
            return this.$message.error("获取用户列表失败！");
          }
          console.log(res);
          this.getUsers(this.queryInfo);
          this.addDialogVisible=false;
          return this.$message.success("添加成功！");
          
          
      });
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id){
      
      // console.log(id)
      const {data:res}=await this.$http.get("users/"+id)
      if(res.meta.status !==200){
        return this.$message.error("更改用户信息失败")
      }
      this.editForm = res.data;
      this.editDialogVisible=true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return
        //如果表单验证通过就发起修改请求
        const {data:res}=await this.$http.put('users/'+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
          })
        if(res.meta.status !==200){
          return this.$message.error("更新用户信息失败！")
        }
        //成功之后关闭对话框，更新用户信息表，提示修改成功
        this.editDialogVisible = false;
        this.getUsers(this.queryInfo)
        this.$message.success("更新用户信息成功")
      })
    },
    //根据id删除对应用户
    async removeUserById(id){
      // console.log(id)
      const confirmResult=await this.$confirm('你确定要踢了这个傻逼吗?', '提示', {
          confirmButtonText: '滚吧',
          cancelButtonText: '饶他一命',
          type: 'warning'
                  //箭头函数内容只有一行时可以简写
        }).catch(err=>err)
        //如果用户确认删除返回的值是字符串
        console.log(confirmResult)
        if(confirmResult !== 'confirm'){
          return this.$message.info('已经取消删除')
        }
        const {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status !==200){
          return this.$message.error('删除用户失败')
        }
        this.$message.success("删除用户成功")
        this.getUsers(this.queryInfo)
    },
    //监听分配角色对话框的显示
    async addRole(userInfo){
      this.userInfo=userInfo;
      
      //在展示对话框之前先获取角色列表
      const {data:res}=await this.$http.get('roles')
        if(res.meta.status !==200){
          return this.$message.error('获取角色列表失败')
        }
      this.rolesList=res.data;
      this.setRoleDialogVisible = true;
  },
  //点击按钮分配角色
  async saveRoleInfo(){
    if(!this.selectedRoleId){
      return this.$message.error("请选择要分配的角色")
    }
    const {data:res}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
    if(res.meta.status !==200){
      return this.$message.error('更新角色失败')
    }
    this.$message.success('更新角色成功')
    this.getUsers(this.queryInfo)
    this.setRoleDialogVisible = false;
  },
  //监听分配角色的对话框的关闭事件
  setRoleDialogClosed(){
    this.selectedRoleId=''
    this.userInfo='';
  }
  },
  created() {
    this.getUsers(this.queryInfo);
  },
  components: {}
};
</script>

<style scoped="scoped">
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.5) !important;
}
.el-breadcrumb {
  padding-bottom: 10px;
  font-size: 15px;
}
.el-card__body {
  padding: 20px;
}
.card-box {
  height: 40px;
  line-height: 20px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
