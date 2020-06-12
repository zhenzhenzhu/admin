import React, { Component } from 'react'
// import {Select} from 'antd'

export default class App extends Component{

    state = {
        count:0
    }

    constructor(props) {
        super(props)

        // 1.通过ref获取值 第一步 准备一个ref容器
        this.numberRef = React.createRef()
    }

    // 点击添加按钮
    increment = () => {
        // 1.获取select的值，通过ref  第三步 获取
        const number = this.numberRef.current.value * 1
        // 2.更新 使用函数，因为更新的额值需要依赖以前的值
        this.setState(state => ({count:state.count + number}))
    }


    // 点击减少
    decrement = () => {
        // 1.获取select的值，通过ref  第三步 获取
        const number = this.numberRef.current.value * 1
        // 2.更新 使用函数，因为更新的额值需要依赖以前的值
        this.setState(state => ({count:state.count - number}))
    }
    // 点击 如果是2基数添加 偶数不变
    incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1
        const {count} = this.state
        if (count % 2 !== 0) {
            this.setState(state => ({ count:state.count + number}))
        }
    }

    // 点击 异步更新
    incrementAsync = () => {
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
            this.setState(state => ({ count:state.count + number}))
        }, 2000);
    }

    render() {
        const {count} = this.state
        return (
            <div>
                <p>点击了{count}次</p>
                <div>
                    {/* 2.ref获取值 第二步  挂在到需要获取的元素上 */}
                <select ref={this.numberRef}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                </select>&nbsp;&nbsp;
                <button onClick={this.increment}>increment</button>&nbsp;&nbsp;
                <button onClick={this.decrement}>decrement</button>&nbsp;&nbsp;
                <button onClick={this.incrementIfOdd}>increment if Odd</button>&nbsp;&nbsp;
                <button onClick={this.incrementAsync}>increment async </button>
                </div>
            </div>
        )
    }
}