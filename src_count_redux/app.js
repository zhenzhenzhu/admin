import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {increment,decrement} from './redux/action'

export default class App extends Component{

    // state = {
    //     count:0
    // }

    static propTypes = {
        store:PropTypes.object.isRequired
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
        // this.setState(state => ({count:state.count + number}))
        this.props.store.dispatch(increment(number))
    }


    // 点击减少
    decrement = () => {
        // 1.获取select的值，通过ref  第三步 获取
        const number = this.numberRef.current.value * 1
        // 2.更新 使用函数，因为更新的额值需要依赖以前的值
        // this.setState(state => ({count:state.count - number}))
        this.props.store.dispatch(decrement(number))
    }
    // 点击 如果是2基数添加 偶数不变
    incrementIfOdd = () => {
        const number = this.numberRef.current.value * 1
        // const {count} = this.state
        if (this.props.store.getState() % 2 !== 0) {
            // this.setState(state => ({ count:state.count + number}))
            this.props.store.dispatch(increment(number))
        }
    }

    // 点击 异步更新
    incrementAsync = () => {
        const number = this.numberRef.current.value * 1
        setTimeout(() => {
            // this.setState(state => ({ count:state.count + number}))
            this.props.store.dispatch(increment(number))
        }, 2000);
    }

    render() {
        const count = this.props.store.getState()
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