/**
 * 登陆的路由组件
 */
import React, { Component } from "react";
import { Form, Icon, Input, Button, message } from "antd";
import {Redirect} from 'react-router-dom'

// 引入自定义
import "./login.less";
import logo from "./images/logo.png";
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils.js'
import storageUtils from '../../utils/storageUtils.js'
class Login extends Component {
  handleSubmit = (event) => {
    //1.阻止默认提交行为
    event.preventDefault();
    // 校验
      this.props.form.validateFields(async(err, values) => {
        // 成功了
        if (!err) {
          const {username, password} = values //获取参数
          
          const result = await reqLogin(username, password)
          console.log(result);
          if (result.status === 0) { //请求成功
            message.success('请求成功')
            // 跳转之前先获取user，保存到内存
            const user = result.data
            console.log('user',user);
            memoryUtils.user = user // 保存到内存
            storageUtils.saveUser(user) // 保存到local storage

            // 跳转
            this.props.history.replace('/')
          } else { //请求失败
            message.error(result.msg)
          }
            // console.log('成功了',response.data);
        } else {
            console.log('校验失败');
            
        }
      });
      
    // // 获取form对象
    // const form = this.props.form;
    // // 获取表单项的输入数据
    // const values = form.getFieldsValue();
    // console.log("hadle", values);
    };
    
    /** 
     * 用户名/密码的的合法性要求 
      1). 必须输入 
      2). 必须大于等于 4 位 
      3). 必须小于等于 12 位 
      4). 必须是英文、数字或下划线组成 
     */
    // 自定义校验 --- 对密码进行校验
    validatorPwd = (rule, value, callback) => {
        // console.log('rule',rule);
        // console.log('value',value);
        // callback()
       if (!value) {
            callback('密码必须输入')
        } else if(value.length < 4) {
            callback('密码最少4位')
        } else if (value.length > 12) {
            callback('密码最多12位')   
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
       } else {
           callback()
        }
    }
  render() {
    const { getFieldDecorator } = this.props.form;
    const user = memoryUtils.user
    // 判断是否登陆过，如果登陆过去对应的页面
    if (user && user._id) { //有值说明登陆过
      return <Redirect to='/'></Redirect>
    }
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="logo" />
          <h1>React项目:后台管理系统</h1>
        </header>
        <section className="login-content">
          <h1>用户登陆</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                    {/*
                    getFieldDecorator（ '',{} ）（）
                    参数1：唯一标示符 username
                    参数2：配置对象，属性名是特定的一些属性
                    用户名/密码的的合法性要求 
                    1). 必须输入 
                    2). 必须大于等于 4 位 
                    3). 必须小于等于 12 位 
                    4). 必须是英文、数字或下划线组成 
                    */}
                        {getFieldDecorator("username", { 
                //   第一种声明式验证：直接使用别人定义好的规则来验证
                rules: [
                  { required: true, message: "请输入用户名!" },
                  { min: 4, message: "用户名最少4位!" },
                  { max: 12, message: "用户名最大12位!" },
                  { pattern:/^[a-zA-Z0-9_]+$/,message:"用户名必须是英文、数字或下划线组成" },
                  { whitespace: true, message: "用户名错误" },
                ],
                initialValue:'admin' //默认值
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Form.Item>

            <Form.Item>
              {getFieldDecorator("password",
                { //第二种：自定义校验 
                    rules:[
                        {validator:this.validatorPwd}
                    ]
                }
              )(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登陆
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
/**
 * 1.高阶函数
 *   1):一类特别的函数
 *      a:接受函数类型的函数
 *      b:返回值是函数
 *   2):常见的高阶函数
 *     a:定时器和延迟器 setTimeout()/setInterval()
 *     b:promise: promise( () => {}).then( value => {} , reason => {})
 *     c:数组的方法: forEach()/map()/findIndex()/filter()/reduce()
 *     d:函数对象的bind()
 *     e:Form.create()() / getFieldDecorator()()
 *    3):高阶函数更新状态，更加具有扩展性
 *
 * 2.高阶组件
 *   1):本质是一个函数   （参数是一个组件）
 *   2):接受一个组件（被包装的组件），返回一个新的组件（包装组件），包装组件会向被包装
 *                                 组件传递一个特定的属性
 *   3):作用：扩展组件的功能
 *   4):高阶组件也是一个高阶函数：接受的是一个组件函数，返回的是一个新的组件函数
 *
 * 包装form组件，生成一个新的组件：form（login)
 * 新的组件会向Form组件传递一个强大的对象属性:form
 *
 * 1.前台表单验证
 * 2.收集表单输入数据
 */
const WarpLogin = Form.create()(Login);
export default WarpLogin;
