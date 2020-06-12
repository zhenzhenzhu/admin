/**
 * redux最核心管理对象 store
 */

import { createStore, applyMiddleware } from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
 import thunk from 'redux-thunk'
import reducer from './reducer'
 
// 创建store对象内部第一次调用reducer()得到初始值
//  export default createStore(reducer,applyMiddleware(thunk)) 
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))