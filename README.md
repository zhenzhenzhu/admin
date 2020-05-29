<!-- /**
 * 登陆的路由组件
 */
import React, { Component } from 'react'

export default class Login extends Component{
    render() {
        return (
            <div>login</div>
        )
    }
} -->
<!-- 
creat-react-app 脚手架创建项目
引入ant
按需加载
自定义主题有问题
创建login和admin文件

 -->

## Available Scripts

In the project directory, you can run:

### `跨域问题`
  开发过程中，使用代理解决Ajax请求跨域的问题
  更改配置文件需要重启
### `关于登陆`
    1.使用form表单 包装from表单，生成一个新的form表单
    2.给登陆注册点击事件 - 进行前台表单验证- 收集表单，输入数据
    3.使用高阶函数和高阶组件进行校验-1声明式校验，直接使用别人定义好的规则进行校验2-自定义校验
    4.校验成功发送请求 - 写登陆的请求接口
    5.成功进行跳转，失败提示信息
    

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
