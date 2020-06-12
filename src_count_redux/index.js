/**
 * 入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'
// 自定义
import App from './app'
import store from './redux/store'

ReactDOM.render(<App store={store}></App>, document.getElementById('root'))

store.subscribe(() => { // 监听store内部数据发生改变 重新渲染数据
    ReactDOM.render(<App store={store}></App>, document.getElementById('root'))
    
})