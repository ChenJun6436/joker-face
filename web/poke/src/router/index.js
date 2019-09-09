import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Family from '@/components/Family'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Game from '@/components/Game'
Vue.use(Router)

const routes = [
  
  {
    path: '/Home',   //大厅
    name: 'Home',
    component: Home 
  },
  {
    path: '/Family', //亲友圈
    name: 'Family',
    component: Family
  },
  {
    path: '/Login/:name',//登陆
    name: 'Login',
    component: Login
  },
  {
    path: '/Register',//注册 
    name: 'Register',
    component: Register
  },
  {
    path: '/Game/:room', //牌局
    name: 'Game',
    component: Game
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },
]
const myrouter = new Router({ routes })
// myrouter.beforeEach((to, from, next) => {
  // console.log(to)
  // if(to.name != 'Login'){
  //   if(!localStorage.getItem('appUser') && to.name != 'Register'){
  //     next('Login')
  //   }else{
  //     next()
  //   }
  // }else{
  //   next()
  // }
// })
export default myrouter
