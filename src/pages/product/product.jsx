/**
 * 商品管理页面
 */
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// 引入自定义组件
import ProductHome from "./home.jsx";
import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import './product.less'

export default class Product extends Component {
  render() {
    return (
        <Switch>
            {/* exact: bool =>如果为 true，则只有在路径完全匹配 location.pathname 时才匹配。 */}
          <Route path='/product' component={ProductHome} exact></Route>
          <Route path="/product/addupdate" component={ProductAddUpdate}></Route>
          <Route path="/product/detail" component={ProductDetail}></Route>
          <Redirect to='/product'></Redirect>
        </Switch>
    );
  }
}
