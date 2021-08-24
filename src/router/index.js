import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//解决路由导航重复会报错的问题
const originalPush = Router.prototype.push
    Router.prototype.push = function push(location) {
      return originalPush.call(this, location).catch(err => err)
    }

const login =()=>import ("@/views/login/index")
const home =()=>import ("@/views/main/index")
const welcome =()=>import ("@/views/main/Welcome/welcome.vue")
const users =()=>import ("@/views/main/user/users.vue")
const rights =()=>import ("@/views/power/Rights")
const Roles =()=>import ("@/views/power/roles")
const Cate =()=>import ("@/views/goods/Cate")
const Params =()=>import ("@/views/goods/Params")
const Goodlist =()=>import ("@/views/goods/List")
const Add =()=>import ("@/views/goods/Add")
const Order =()=>import ("@/views/order/order")
const Report =()=>import ("@/views/report/report")

export default new Router({
  routes: [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/login",
      component:login
    },
    {
      path:"/home",
      component:home,
      redirect:"/home/welcome",
      children:[
        {
          path:"/home/welcome",
          component:welcome
        },
        {
          path:"/home/users",
          component:users
        },
        {
          path:"/home/rights",
          component:rights,
        },
        {
          path:"/home/roles",
          component:Roles,
        },
        {
          path:"/home/categories",
          component:Cate,
        },
        {
          path:"/home/goods",
          component:Goodlist,
        },
        {
          path:"/home/params",
          component:Params,
        },
        {
          path:"/home/goods/add",
          component:Add,
        },
        {
          path:"/home/orders",
          component:Order,
        },
        {
          path:"/home/reports",
          component:Report,
        },
      ]
    },
    
  ]
})
