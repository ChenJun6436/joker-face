// code by chenjunlml@163.com 
import {get, post, push} from './http'

function servive () {
	let myServices = {}
	// /////////////账号模块
	// 注册用户
	myServices._register = (req) => {
		return post('/register',req)
	}
	//登陆
	myServices._login = (req) => {
		return post('/login',req)
	}
	return myServices
}

export default servive


// WEBPACK FOOTER //
// ./src/server/myServer.js