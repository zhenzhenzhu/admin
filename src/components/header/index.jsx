/**
 * 头部功能模块
 */
import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
//引入自定义
import LinkButton from '../link-button/index'
import {reqWeather} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils.js'
import { formateDate } from '../../utils/dateUtils'
import menuList from '../../config/menuConfig.js'
import './index.less'
 class Header extends Component{
    // 初始值
    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串
        dayPictureUrl: '', // 天气图片的 url
        weather: '' // 天气的文本 
    }
    // 根据请求的 path 得到对应的标题
    getTitle = () => {
        // 得到当前请求的路径 
        const path = this.props.location.pathname
        // 遍历获取  查找menuList的key值和 请求路径对应的 
        let title
        menuList.forEach(item => {
            // 如果当前item的key和请求路径path一样，item的title就是需要展示的title
            if (item.key === path) {
                title = item.title
            }else if (item.children) { //说明请求的是item的子item
                // 在所有的子item中找
               const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                if (cItem) { // 有值 说明是匹配的
                    title = cItem.title
                }
            }
        })
        return title
    }
    // 发异步 ajax 获取天气数据并更新状态
    getWeather =async() => {
        // 调用接口 并 获取需要的数据 => {dayPictureUrl,weather} 
        // 想要得到数据 使用 == await/async
        const { dayPictureUrl, weather } =await reqWeather('北京')
        // 更新数据
        this.setState({
            dayPictureUrl,
            weather
        })
    }

    // 启动循环定时器，每个1秒更新一次时间currentTime
    getTime = () => {
       this.intervalId = setInterval(() => {
            // 获取当前时间
            const currentTime = formateDate(Date.now())
            // 更新时间
            this.setState({currentTime})
        }, 1000);
    }

    //  退出功能
     logout = () => {
        Modal.confirm({
            content: '确定退出吗',
            onOk :() => { //确认退出
            //   console.log('OK');
                // 1.清除内存及本地local中的user
                    // 清除本地
                    storageUtils.removeUser()
                    // 清除内存
                    memoryUtils.user = {}
                // 2.跳转到登陆页面 this问题 使用箭头函数 
                this.props.history.replace('/login')
            },
            onCancel() {
              console.log('Cancel');
            },
          });
    }
    /**
     * 第一次render()之后
     * 一般在此执行异步操作： 发送ajax请求/启动定时器
     */
    componentDidMount() {
        // 启动定时器
        this.getTime()

        // 更新天气
        this.getWeather()
     }
    //  卸载之前
     componentWillUnmount() {
         clearInterval(this.intervalId)
     }
    render() {
        // 获取值
        const { currentTime, dayPictureUrl, weather } = this.state
        // 从内存中获取user
        const username = memoryUtils.user.username
        // 得到当前需要展示的title
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎, {username}</span>
                    <LinkButton onClick = {this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div> 
        )
    }
}
export default withRouter(Header)
