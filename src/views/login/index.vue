<template>
  <div id="Login" style="height:100%">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avater_box">
        <img src="@/assets/logo.png" alt="">
      </div>
      <el-form ref="form" class="login_form" :model="form" :rules="loginFormRules" label-width="80px">
        <!-- 登录表单区 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮区 -->
        <el-form-item>
          <el-button @click="onSubmit" type="success">登录</el-button>
          <el-button type="info" round @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
      return {
        form: {
          username: 'admin',
          password:'123456',
        },
        loginFormRules:{
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      onSubmit() {
      this.$store.dispatch("loginByUsername", this.form).then((res) => {
        if(res)
          this.$message.success("登录成功")
          this.$router.push({ path: "/home" });
      });
      // this.$refs.loginFormRef
    },
    //点击重置登录表单
    resetLoginFrom(){
      // console.log(this)
      this.$refs.form.resetFields();
    }
    }
}
</script>

<style scoped>
</style>
