// code by chenjun
'use strict'

import axios from 'axios'
import qs from 'qs'


const baseURL = 'http://192.168.10.197:3000'

//axios的跨域session设置为true，不配置session会丢失,每次请求都不同。
axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})
let showNum = 0
function checkStatus (response) {
  showNum ++ 
  if(response.status === 200 && response.data.message === '请登录' && showNum === 1){
    alert('请先登录！')
    setTimeout(function(){
      window.location.href='/'
    },1000)
    
  }
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    if(response.status === 200 && response.data.message === '请登录') {
      
    }
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {

  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    
  }
  if (res.data && (!res.data.success)) {
    
  }
  if (res.data.message === '请登录') {
    
  }
  if(!res){
    
  }
  return res
}



export const get = function (url, data) { 
  return axios({
      method: 'get',
      baseURL: baseURL,
      url,
      data: js.stringify(data),
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
      },
      xhrFields: {
        withCredentials: true
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
}
export const post = function (url, data) {
  return axios({
      method: 'post',
      baseURL: baseURL,
      url,
      data: JSON.stringify(data),
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      xhrFields: {
        withCredentials: true
      },
      withCredentials: false, // 允许携带cookie
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
}
//严格的json格式， content-type+++++++qs.stringify
export const push = function (url, data) {
  return axios({
      method: 'post',
      baseURL: baseURL,
      url,
      data: data,
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8;'
      },
      xhrFields: {
        withCredentials: true
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
}
///
export const Url = function () {
  let URL = 'http://192.168.10.197:3000'
  return URL
}

// WEBPACK FOOTER //
// ./src/server/http.js