/**
 * 根据当前的state和指定的action生成一个新的state
 */

 /**
  * 管理count状态数据的reducer
  */

 import {DECREMENT,INCREMENT} from './action-type'

export default function count(state = 1, action) {
    console.log('reducer()',state,action);
    
    switch (action.type) {
        case INCREMENT:
           return state + action.date
        case DECREMENT:
            return state - action.date
        default:
            return state
    }
    
}