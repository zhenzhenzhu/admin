/**
 * 发送异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是一个promise对象
 * 优化1：统一处理请求异常
 *      在外层包一个自己创建的promise对象
 *      请求错误不调用，提示错误信息
 * 优化2：返回的时候直接得到response.data
 *           resolve(response.data)
 */

import axios from 'axios'
import {message} from 'antd'
// 参数1：请求路径
// 参数2：请求数据
// 参数3：请求方式
export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve,reject) => {
        let promise
        // 1.执行异步Ajax请求
        if (type === 'GET') { //发送get请求
            promise = axios.get(url, { //第二个参数配置对象
                  // params: {} // 是一个对象
                  params:data //上面默认给打他一个空对象
                })  
          } else { //发送post
            promise = axios.post(url,data)
          }
        // 2.如果请求成功，调用reslove
        promise.then(response => {
            resolve(response.data)
        }).catch(error => { // 3.如果请求失败，不调用reject，而是提示错误信息
            message.error('请求出错了:'+ error.message)
        })  
    })
    
}
 
