<template>
  <div class="hello">
    <p>我是内部</p>
    <div>
      <p>请输入用户名:{{uName}}</p>
      <input v-model="uName" placeholder="请输入用户名"/>
      <p>请输入密码:{{uPass}}</p>
      <input v-model="uPass" placeholder="请输入用户名"/>
      <button  @click="login">进入</button>
    </div>
    <button  @click="register">注册</button>
  </div>
</template>
<script>
import server from "../service/service.js";
export default {
  name: "Login",
  data() {
    return {
      uName: "",
      uPass: ""
    };
  },
  methods: {
    login() {
      if (!this.uName) {
        alert("请输入登陆账号");
        return;
      }
      if (!this.uPass) {
        alert("请输入密码");
        return;
      }
      const user = {
        userName: this.uName,
        userPassWord: this.uPass
      };
      const _this = this;
      server()
        ._login(user)
        .then(function(res) {
          if (res.data.code == "1") {
            localStorage.setItem("appUser", JSON.stringify(res.data.data));
            alert(res.data.msg);
            _this.$router.push({
              name: "Home"
            });
          } else {
            alert(res.data.msg);
          }
        });
    },
    register() {
      this.$router.push({
        name: "Register"
      });
    }
  },
  created() {
    this.uName = this.$route.params.name
    console.log(this.$route.params.name);
    // this.$socket.emit('login', 'loginId');       //触发socket连接
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
