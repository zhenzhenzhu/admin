/**
 * redux最核心管理对象 store
 */

 import {createStore} from 'redux'
import reducer from './reducer'
 
// 创建store对象内部第一次调用reducer()得到初始值
 export default createStore(reducer) 