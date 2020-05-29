/**
 * 后台管理的路由组件
 */
import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Layout } from "antd";

// 引入自定义组件
import memoryUtils from "../../utils/memoryUtils.js";
import LeftNav from "../../components/left-nav/index";
import Header from "../../components/header/index";
import Home from "../home/home";
import Category from "../category/category";
import Product from "../product/product";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
  render() {
    const user = memoryUtils.user;
    // 判断
    if (!user || !user._id) {
      //没有值==没有登陆，去登陆
      // 自定跳转到登陆
      return <Redirect to="/login"></Redirect>;
    }
    return (
      // 整体
      <Layout style={{ height: "100%" }}>
        <Sider>
          {/* 左侧边栏 */}
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          {/* 头部 */}
          <Header></Header>
          {/* 中间 */}
          <Content style={{ backgroundColor: "#fff" }}>
            <Switch>   
              <Route path="/home" component={Home} />
              <Route path="/category" component={Category} />
              <Route path="/product" component={Product} />
              <Route path="/user" component={User} />
              <Route path="/role" component={Role} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/charts/line" component={Line} />
              <Redirect to="/home" /> {/* {//重定向到home} */}
            </Switch>
          </Content>
          {/* 底部 */}
          <Footer style={{ textAlign: "center", color: "#ccc" }}>
            推荐使用谷歌浏览器，可以获得更加页面操作体验
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
