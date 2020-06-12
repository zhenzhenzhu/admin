/**
 * 包含n个 同步action函数
 */

 import {DECREMENT,INCREMENT} from './action-type'

// 增加的action
export const increment = (numer) => ({type:INCREMENT,date:numer})
// 增加的action
export const decrement = (numer) => ({type:DECREMENT,date:numer})