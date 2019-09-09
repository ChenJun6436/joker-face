// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketio from 'vue-socket.io';
import axios from 'axios'
Vue.config.productionTip = false
/* eslint-disable no-new */
Vue.use(new VueSocketio({
  connection: 'ws://192.168.10.197:3000/',
}))


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
