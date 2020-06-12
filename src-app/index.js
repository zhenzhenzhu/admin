/**
 * 入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'

// 自定义
import App from './App'

// 页面进入就加载local里面的user
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'
// 如果local中有user，把它保存到内存中
const user = storageUtils.getUser()
if (user && user._id) {
    memoryUtils.user = user
}
// import 'antd/dist/antd.less'
ReactDOM.render(<App></App>,document.getElementById('root'))