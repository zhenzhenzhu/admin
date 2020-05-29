/**
 * 后台管理的路由组件
 */
import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

// 引入自定义组件
import memoryUtils from '../../utils/memoryUtils.js'

export default class Admin extends Component{
    render() {
        const  user = memoryUtils.user
        // 判断
        if (!user || !user._id) { //没有值==没有登陆，去登陆
            // 自定跳转到登陆
            return <Redirect to='/login'></Redirect>
        }
        return (
            <div>
                Hello  {user.username}
            </div>
        )
    }
}