/**
 * 包含应用中所有接口请求模块
 * 返回值必须是一个promise
 * 
 */

import ajax from './ajax'

const BASE =''
// 登陆功能
export const reqLogin = (username, password) =>ajax(BASE + '/login', { username, password }, 'POST')
// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

