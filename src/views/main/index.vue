<template>
  <div>
   <el-container class="mian-container">
     <el-header >
       电商后台管理系统
         <el-button class="main-button" type="info" v-on:click="goOut">退出</el-button>
     </el-header>
     <el-container>
       <!-- 侧边栏 -->
       <el-aside :width="isCollapse?'64px':'200px'">
         <div class="toggle-button" @click="toggleCollapse">|||</div>
         <el-menu :default-active="activePath" class="el-menu-vertical-demo" background-color="#333744"  text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isCollapse" :collapse-transition="false" router  >
                <!-- 一级菜单 -->
               <el-submenu  :index="''+items.id" :key="indexs"   v-for="(items,indexs) in navlist">
                 <template slot="title" style="padding-left:50px">
                   <div class="items_box">
                     <i :class="iconsObj[items.id]"></i>
                    <span>{{items.authName}}</span>
                   </div>
                   
                 </template>
                 <el-menu-item-group :key="indexs"  v-for="(item,indexs) in items.children"  >
                   <!-- 二级菜单 -->
                   <el-menu-item :index="item.path" class="el-menu-vertical-demo"  text-color="#fff" @click="saveNaveState(item.path)">
                     <i class="el-icon-menu"></i>
                     {{item.authName}}
                   </el-menu-item>
                 </el-menu-item-group>
               </el-submenu>
             </el-menu>
       </el-aside>
       <!-- 右侧主体 -->
       <el-main>
         <!-- 路由占位符 -->
         <router-view></router-view>
       </el-main>
     </el-container>
   </el-container>
  </div>
</template>

<script>
  import {getMenu} from "@/api/menu.js"
  export default {
      data(){
        return{
          navlist:[],
          iconsObj:{
            '125':'el-icon-user-solid',
            '103':'el-icon-s-help',
            '101':'el-icon-s-goods',
            '102':'el-icon-s-order',
            '145':'el-icon-s-data',
          },
          //是否折叠
          isCollapse:false
        }
      },
      methods: {
        //得到菜单信息
        getAllMenu(){
          getMenu().then((res)=>{
            // console.log(res);
            this.navlist=res.data.data;
          })
          // const {data:res} = await this.$http.get('menus')
          // console.log(res)
        },
        //退出登录
        goOut(){
          localStorage.removeItem("token");
          sessionStorage.removeItem("activePath");
          this.$router.push({path:"/login"})
        },
        //点击按钮，切换菜单的折叠和展开
        toggleCollapse(){
          this.isCollapse=!this.isCollapse;
        },
        //保存链接的激活状态
        saveNaveState(activePath){
          window.sessionStorage.setItem("activePath",activePath)
        }
      },
      created(){
        this.getAllMenu(),
        this.activePath = window.sessionStorage.getItem('activePath')
      }
    }
</script>

<style scoped="scoped">
  .mian-container{
    height: 100vh;
  }
  .main-button{
    float: right;
    line-height: 15px;
        
  }
  .main-button[data-v-567ae6d4][data-v-567ae6d4]{
    margin-top: 10px;
  }
  .el-header, .el-footer {
      background-color: #B3C0D1;
      color: #333;
      text-align: left;
      line-height: 60px;
    }

    .el-aside {
      background-color: #D3DCE6;
      color: #333;
      text-align: center;
      line-height: 200px;
    }

    .el-main {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
    }

    body > .el-container {
      margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
      line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
      line-height: 320px;
    }
    .main-button[data-v-567ae6d4]{
      margin-top:7px
    }
    .el-header{
      background-color:#373d41 ;
      color:#fff;
      font-size: 20px;
    }
    .el-aside{
      background-color:#333744 ;
      overflow: hidden;
    }
    .el-menu{
      background-color:#333744 ;
      color:whitesmoke;
      border:0;
    }
    .el-submenu__title{
      color:whitesmoke;
    }
    .el-main{
      background-color:#eaedf1 ;
      padding-top:15px;
    }
    .el-submenu__title{
      padding-right: 200px;
    }
    .items_box{
      padding-right: 50px;
      /* width:200px; */
    }
    .toggle-button{
      background-color: #4a5064;
      color:#fff;
      font-size: 10px;
      line-height: 24px;
      text-align: center;
      height: 24px;
      letter-spacing: 0.2em;
      cursor:pointer;
    }

</style>
