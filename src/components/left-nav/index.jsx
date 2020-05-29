/**
 * 左边侧边栏功能模块
 */
import React, { Component } from "react";
import { Link,withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";

// 引入自定义
import "./index.less";
import logo from "../../asstes/images/logo.png";
import menuList from "../../config/menuConfig";

const { SubMenu } = Menu;

class LeftNav extends Component {
  /**
   * 第一种 使用map() + 递归调用
   */
  getMenuNodes_map = (menuList) => {
    return menuList.map((item) => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
           <Link to={item.key}>
            <Icon type={item.icon} />
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
       )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            } >
            {this.getMenuNodes(item.children)}
            </SubMenu>
        )
      }
    });
  };
  /**
   * 第二种 使用reduce() + 递归调用
   * reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
    reduce() 可以作为一个高阶函数，用于函数的 compose。
    注意: reduce() 对于空数组是不会执行回调函数的。
    array.reduce(function(total, currentValue, currentIndex, arr), initialValue)
    参数	描述
    total	必需。初始值, 或者计算结束后的返回值。
    currentValue	必需。当前元素
    currentIndex	可选。当前元素的索引
    arr	可选。当前元素所属的数组对象。
   */
  getMenuNodes = (menuList) => {

    // 获取当前请求的路由路径
    const path = this.props.location.pathname

    // (第一个参数：(pre,item)=>{遍历的回调函数},第二个参数[]:初始值)
    // pre:上一次的值，初始值为[]
    // item:遍历数组里面的每一项
    return menuList.reduce((pre, item) => {
      // 向pre中 添加 <Menu.Item />
      if (!item.children) {//没有值
        pre.push((
          <Menu.Item key={item.key}>
           <Link to={item.key}>
            <Icon type={item.icon} />
            <span>{item.title}</span>
          </Link>
        </Menu.Item>
        ))
      } else {
          // 查找一个与当前请求路径匹配的item
      const cItem = item.children.find(cItem => cItem.key === path)
        // 如果存在，说明当前的item需要展开
        if (cItem) {
          this.openKey = item.key
        }
        // 向pre中 添加 <SubMenu />
        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            } >
            {this.getMenuNodes(item.children)}
            </SubMenu>
        ))
      }
      return pre
    },[])
  }
  /**
   * 在第一次render之前执行一次
   * 为第一次render（）准备数据 ---必须同步
   */
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    // debugger;
    // 获取当前请求的路由路径
    const path = this.props.location.pathname
    console.log('render()', path);
    // 得到需要打开菜单项的key
    const openKey = this.openKey
    console.log('openKey',openKey);
    
    
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt={logo} />
          <h1>React后台</h1>
        </Link>
        <Menu mode="inline" theme="dark" selectedKeys={[path]}
          defaultOpenKeys={[openKey]}>
          {this.menuNodes}
        </Menu>
      </div>
    );
  }
}
/**任何让一个非路由组件变成一个路由组件
 * withRouter高阶函数
 * 包装非路由组件，得到一个新的路由组件
 * 新的路由组件会向非路由组件传递3个属性hhistroy/location/match
 */
export default withRouter(LeftNav)
