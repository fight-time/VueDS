// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from "./store/index"
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config=>{
  if(localStorage.getItem("token")){
    config.headers["Authorization"]=localStorage.getItem("token")
  }
  return config
})
Vue.prototype.$http=axios;

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y=dt.getFullYear()
  const m = (dt.getMonth()+1+'').padStart(2,"0")
  const d = (dt.getDate()+'').padStart(2,'0')
  const hh = (dt.getHours()+'').padStart(2,'0')
  const mm = (dt.getMinutes()+'').padStart(2,'0')
  const ss = (dt.getSeconds()+'').padStart(2,'0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

import {Pagination,Dialog,Autocomplete,Dropdown,DropdownMenu,DropdownItem,Menu,Submenu,MenuItem,MenuItemGroup,Input,InputNumber,Radio,RadioGroup,RadioButton,Checkbox,CheckboxButton,CheckboxGroup,Switch,Select,Option,OptionGroup,Button,ButtonGroup,Table,TableColumn,DatePicker,TimeSelect,TimePicker,Popover,Tooltip,Breadcrumb,BreadcrumbItem,Form,FormItem,Tabs,TabPane,Tag,Tree,Alert,Slider,Icon,Row,Col,Upload,Progress,Spinner,Badge,Card,Rate,Steps,Step,Carousel,CarouselItem,Collapse,CollapseItem,Cascader,ColorPicker,Transfer,Container,Header,Aside,Main,Footer,Timeline,TimelineItem,Link,Divider,Image,Calendar,Backtop,PageHeader,CascaderPanel,Loading,MessageBox,Message,Notification
} from 'element-ui';

Vue.use(Pagination).use(Dialog).use(Autocomplete).use(Dropdown).use(DropdownMenu).use(DropdownItem).use(Menu).use(Submenu).use(MenuItem).use(MenuItemGroup).use(Input).use(InputNumber).use(Radio).use(RadioGroup).use(RadioButton).use(Checkbox).use(CheckboxButton).use(CheckboxGroup).use(Switch).use(Select).use(Option).use(OptionGroup).use(Button).use(ButtonGroup).use(Table).use(TableColumn).use(DatePicker).use(TimeSelect).use(TimePicker).use(Popover).use(Tooltip).use(Breadcrumb).use(BreadcrumbItem).use(Form).use(FormItem).use(Tabs).use(TabPane).use(Tag).use(Tree).use(Alert).use(Slider).use(Icon).use(Row).use(Col).use(Upload).use(Progress).use(Spinner).use(Badge).use(Card).use(Rate).use(Steps).use(Step).use(Carousel).use(CarouselItem).use(Collapse).use(CollapseItem).use(Cascader).use(ColorPicker).use(Transfer).use(Container).use(Header).use(Aside).use(Main).use(Footer).use(Timeline).use(TimelineItem).use(Link).use(Divider).use(Image).use(Calendar).use(Backtop).use(PageHeader).use(CascaderPanel);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.config.productionTip = false

Vue.component("tree-table",TreeTable)

router.beforeEach((to,from,next)=>{
  if(to.path=="/login"){
    return next()
  }else{
    var getToken = localStorage.getItem("token");
    if(getToken){
      return next()
    }else{
      next("/login")
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
