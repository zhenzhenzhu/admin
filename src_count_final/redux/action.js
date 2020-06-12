/**
 * 包含n个 同步action函数
 */

 import {DECREMENT,INCREMENT} from './action-type'
import { number } from 'prop-types'

// 增加的同步action
export const increment = (numer) => ({type:INCREMENT,date:numer})
// 减少的同步action
export const decrement = (numer) => ({ type: DECREMENT, date: numer })

// 增加的异步action
export const incrementAsync = (number) => {
    // 1. 返回一个带有dispatch参数的函数 // return (dispatch) =>{}
    return dispatch => {
        // 2. 执行异步
        setTimeout(() => {
            // 3. 有了结果以后分发一个同步action
            dispatch(increment(number))
        }, 1000);
    }
}