/**
 * redux 最核心的store对象
 */
import { createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './reducer'

// 向外暴露一个store对象
// 创 建 store 对象内部会第一次调用 reducer()得到初始状态值
export default createStore(reducer,composeWithDevTools(applyMiddleware(thunk)))