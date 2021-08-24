<template>
  <div id="roles">
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 添加角色按钮 -->
        <el-row>
            <el-col>
                <el-button type="primary" class="addusers" @click="addDialogVisible=true">添加角色</el-button>
            </el-col>
        </el-row>
        <!-- 角色列表区 -->
        <el-table :data="rolelist" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom',i1===0?'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                        <!-- 渲染一级权限 -->
                        <el-col :span="5" >
                            <el-tag  closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二，三级权限 -->
                        <el-col :span="19">
                            <!-- 通过for循环嵌套渲染二级权限 -->
                            <el-row v-for="(item2,i2) in item1.children" :key="item2.id"  :class="[i2===0?'':'bdtop','vcenter']">
                                <el-col :span='6'>
                                    <el-tag type="success"  closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span='18'>
                                    <el-tag type="warning" v-for="(item3) in item2.children" :key='item3.id' closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
                    <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <!-- 内容主体区 -->
      <el-form :model="addrolelist" :rules="addRoleRules" ref="addRoleRef" label-width="90px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addrolelist.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addrolelist.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="roleForm" :rules="roleFormRules" ref="roleFormRef" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editroleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户的对话框 -->
    <!-- <template>
      <el-button type="text" @click="removeRoleById">点击打开 Message Box</el-button>
    </template> -->
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys='defkeys' ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "roles",
  data(){
      return{
          rolelist:[],
          addrolelist:
            {
                roleName:'',
                roleDesc:''
            },
          addRoleRules:{
            roleName:[
            {required:true,message:"请输入用户名",trigger:'blur'},
            {min:3,max:10,message:"用户名的长度在3~10个之间",trigger:'blur'}
            ],
            roleDesc:[
            {required:true,message:"请输入密码",trigger:'blur'},
            {min:3,max:10,message:"用户名的长度在3~10个之间",trigger:'blur'}
            ]
          },
          roleFormRules:{
            roleName:[
            {required:true,message:"请输入角色名称",trigger:'blur'},
            // {validator:checkEmail,trigger:'blur'}
            ],
            roleDesc:[
            {required:true,message:"请输入角色描述",trigger:'blur'},
            // {validator:checkMobile,trigger:'blur'}
            ]
          },
          roleForm:{}, //   所有权限的数据
          roleId:'',//当前即将分配权限的角色的id
          rightsList:[],
          defkeys:[],//默认选中的节点id值的数组
          treeProps:{//树形控件的绑定对象 
            label:'authName',
            children:'children'
          },
          addDialogVisible:false,
          editDialogVisible:false,
          setRightDialogVisible:false,
      }
  },
  created(){
      this.getRolesList()
  },
  methods:{
    async getRolesList(){
        const {data:res}= await this.$http.get('roles');
        if(res.meta.status !==200){
            return this.$message.error("获取角色列表失败")
        }
        this.rolelist = res.data;
        // console.log(this.rolelist)
    },
    addDialogClosed(){
        this.$refs.addRoleRef.resetFields();
    },
    addRole(){
        this.$refs.addRoleRef.validate(async valid =>{
            if(! valid) return
            const {data:res}=await this.$http.post('roles',{
                roleName:this.addrolelist.roleName,
                roleDesc:this.addrolelist.roleDesc
                })
                if(res.meta.status !==201){
                    // console.log(res)
                return this.$message.error("添加角色信息失败！")
            }
            //成功之后关闭对话框，更新用户信息表，提示修改成功
            this.addDialogVisible = false;
            this.getRolesList()
            this.$message.success("添加角色信息成功")
        })
    },
    editDialogClosed(){
        this.$refs.roleFormRef.resetFields();
    },
    async showEditDialog(id){
        const {data:res}=await this.$http.get("roles/"+id)
            if(res.meta.status !==200){
                return this.$message.error("更改用户信息失败")
            }
        this.roleForm = res.data;
        this.editDialogVisible=true;
    },
    editroleInfo(){
       this.$refs.roleFormRef.validate(async valid=>{
        //    console.log(this.roleForm)
        if(! valid) return
        const {data:res} = await this.$http.put('roles/'+this.roleForm.roleId,{
            roleName:this.roleForm.roleName,
            roleDesc:this.roleForm.roleDesc
        })
        if(res.meta.status !==200){
            // console.log(res)
            return this.$message.error("更新用户信息失败！")
        }

        this.editDialogVisible = false;
        this.getRolesList()
        this.$message.success("更新用户信息成功")
       }) 
    },
    async removeRoleById(id){
        const confirmResult=await this.$confirm('你确定要踢了这个傻逼吗?', '提示', {
          confirmButtonText: '滚吧',
          cancelButtonText: '饶他一命',
          type: 'warning'
                  //箭头函数内容只有一行时可以简写
        }).catch(err=>err)
        if(confirmResult !=='confirm'){
            return this.$message.info('已经取消删除')
        }
        const {data:res} = await this.$http.delete('roles/'+id)
        if(res.meta.status !==200){
            return this.$message.error('删除用户失败')
        }
        this.getRolesList()
        this.$message.success("删除用户成功")
    },
    //根据id删除对应的图标
    async removeRightById(role,rightId){
        const confirmResult=await this.$confirm('这个宝贵的权限即将离他而去?', '提示', {
          confirmButtonText: '他不配！',
          cancelButtonText: '施舍给他',
          type: 'warning'
                  //箭头函数内容只有一行时可以简写
        }).catch(err=>err)
        if(confirmResult!=='confirm'){
            return this.$message.info('我大发慈悲饶他一命')
        }
        
        const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if(res.meta.status!==200){
            return this.$message.error("删除权限失败")
        }
        role.children=res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role){
        this.roleId=role.id;
        //获取所有权限数据
        const {data:res}=await this.$http.get('rights/tree')
        if(res.meta.status!==200){
            return this.$message.error("权限获取失败")
        }
        //将获取到的权限数据保存到data中
        this.rightsList = res.data;
        // console.log(this.rightsList)
        // 递归获取三级节点id
        this.getLeafKeys(role,this.defkeys)

        this.setRightDialogVisible=true;
    },
    //通过递归的形式，获取角色下所有的三级权限的ID，并保存到defKeys数组中
    getLeafKeys(node,arr){
        // 如果当前node节点不包含children属性，那就是三级节点
        if(!node.children){
            return arr.push(node.id);
        }
        node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed(){
        this.defkeys=[];
    },
    async allotRights(){
        const keys = [
            this.$refs.treeRef.getCheckedKeys(),
            this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status!==200){
            return this.$message.error("权限分配失败")
        }
        this.$message.success('权限分配成功')
        this.getRolesList()
        this.setRightDialogVisible=false
    }
  }
}
</script>

<style scoped>
.el-breadcrumb{
    margin-bottom: 15px;
}
.addusers{
    float: left;
    margin-bottom: 15px;
}
.el-tag{
    margin:7px;
}
.bdtop{
    border-top:1px solid #EEE;
}
.bdbottom{
    border-bottom:1px solid #EEE;
}
.vcenter{
    display: flex;
    align-items: center;
}

</style>