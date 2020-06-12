/**
 * 根据老额state，action产生新的state
 */
import {
    combineReducers
} from 'redux'

import {SET_HEAD_TITLE,RECEIVER_USER,SHOW_ERROR_MESG,RESET_USER } from './action-type'
import storageUtils from '../utils/storageUtils'

// 管理 头部 的函数
const initHeadTitle = '首页'

function headTitle(state = initHeadTitle, action) {
    switch (action.type) {
        case SET_HEAD_TITLE:
            return action.data
        default:
            return state
    }
}
// 管理当前用户的reducer函数
const initUser = storageUtils.getUser()

function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVER_USER:
            return action.user
        case SHOW_ERROR_MESG:
            const errorMsg = action.errorMsg
            return {...state,errorMsg}
        case RESET_USER:
            return {}
        default:
            return state
    }
}

// 向外暴露合并后产生的reducer函数
export default combineReducers({
    headTitle,
    user
})