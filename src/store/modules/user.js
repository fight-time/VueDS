import { loginByUsername } from "@/api/login.js"
const user = {
  state:{
    token:''
},
mutations:{
    SET_TOKEN(state,token){
        state.token=token;
    }
},

  actions: {
    // 用户名登录
    loginByUsername({ dispatch, commit }, userInof) {
      console.log(userInof)
      // 去除两边空格
      const username = userInof.username.trim();

      return new Promise((resolve, reject) => {
        //发送请求
        loginByUsername(username, userInof.password).then(res => {
          // console.log(res);
          commit('SET_TOKEN', res.data.data.token)
          localStorage.setItem('token', res.data.data.token)
          resolve()
        }).catch(error=>{
          reject("登录失败!")
        })
      })
    }
  },
}

export default user