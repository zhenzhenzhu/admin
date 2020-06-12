/**
 * 包含n个 action creator 模块
 * 同步action：对象 {type：'xxx'，data:数据值}
 * 异步action：函数 dispatch =>{}
 */

 import {reqLogin} from '../api'
 import {SET_HEAD_TITLE,RECEIVER_USER,SHOW_ERROR_MESG,RESET_USER} from './action-type'
import storageUtils from '../utils/storageUtils'

//  设置头部标题的同步action
export const setHeadTitle = (headeTitle) => ({ type: SET_HEAD_TITLE, data: headeTitle })
//  接受用户的同步action
export const receiverUser = (user) => ({ type: RECEIVER_USER, user })

//  失败错误信息提示的同步action
export const showErrorMsg = (errorMsg) =>({type:SHOW_ERROR_MESG,errorMsg})

// 退出的同步action
export const logout = () => {
    // 1.删除local中的user
    storageUtils.removeUser()
    // 2.返回action对象
    return {type:RESET_USER}
}

// 登陆的 异步action
export const login = (username, password) => {
    return async dispatch => {
        // 1.执行异步ajax请求
        const result = await reqLogin(username, password)
        // 2.请求成功，分发一个成功的同步action
        if (result.status === 0) {
            // 获取user，并保存到local/内存中
            const user = result.data
            // 保存到local
            storageUtils.saveUser(user)
            // 同步action，并保存到内存
            dispatch(receiverUser(user))
        } else {
            // 3.请求失败，分发一个失败的同步action
            const msg = result.msg
            dispatch(showErrorMsg(msg))
        }
    }
}