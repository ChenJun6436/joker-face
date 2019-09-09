<template>
  <div class="hello">
    <p>注册页面</p>
    <div>
      <p>请输入登陆账号:{{uName}}</p>
      <input v-model="uName" placeholder="请输入用户名"/>
      <p>请输入密码:{{uPass}}</p>
      <input type="password" v-model="uPass" placeholder="请输入用户名"/>
      <p>请确认密码:{{uPassRe}}</p>
      <input type="password" v-model="uPassRe" placeholder="请输入用户名"/>
      <p>请输入游戏昵称:{{uNamePlay}}</p>
      <input v-model="uNamePlay" placeholder="请输入用户名"/>
      <button  @click="register">进入</button>
    </div>
  </div>
</template>
<script>
import server from "../service/service.js";
export default {
  name: "Login",
  data() {
    return {
      uName: "",
      uPass: "",
      uPassRe: "",
      uNamePlay: ""
    };
  },
  methods: {
    register() {
      if (!this.uName) {
        alert("请输入手机号");
        return;
      }
      if (!this.uPass) {
        alert("请输入密码");
        return;
      }
      if (!this.uPassRe) {
        alert("请确认密码");
        return;
      }
      if (this.uPass != this.uPassRe) {
        alert("两次密码不对");
        return;
      }
      if (!this.uNamePlay) {
        alert("请输入游戏昵称");
        return;
      }
      const registerData = {
        userName: this.uName,
        userPassWord: this.uPass,
        userPlayName: this.uNamePlay
      };
      const _this = this;
      server()
        ._register(registerData)
        .then(function(res) {
          if (res.data.code == "1") {
            alert(res.data.msg);
            _this.$router.push({
              name: "Login",
              params:{
                name: _this.uName
              }
            });
          } else {
            alert(res.data.msg);
          }
        });
    }
  },
  created() {
    // this.$socket.emit('login', 'loginId');       //触发socket连接
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
