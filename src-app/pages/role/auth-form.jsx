/**
 * 添加角色
 */

import React, { Component } from "react";
import { Form, Input,Tree } from "antd";
import PropTypes from "prop-types";

import menuList from '../../config/menuConfig'

const Item = Form.Item;
const { TreeNode } = Tree;

export default class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };

  // 根据传递过来的role生成初始值
  constructor(props) {
    super(props)
    const { menus } = this.props.role
    this.state = {
      checkedKeys:menus
    }
}
  

  // 遍历获取所有二点权限
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      )

      return pre
    },[])
  }

  // 选择某个node时的回调
  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  // 为父组件提供最新获取menus的方法
getMenus = () => this.state.checkedKeys

  
  // 当组件接受到新的属性时调用
  componentWillReceiveProps(nextProps ) {
    const menus = nextProps.role.menus
    // 更新
    this.setState({checkedKeys:menus})
  }
  
  componentWillMount() {
    this.menuList = this.getTreeNodes(menuList)
  }
  
  render() {
    const { role } = this.props;
    const {checkedKeys} = this.state
    // const{menus} = role
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    };

    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
          checkable
          defaultExpandAll={true} // 展开全部
          checkedKeys={checkedKeys} // 默认选择的角色
          onCheck={this.onCheck} // 监听
        >
          <TreeNode title="平台权限" key="all">
           {this.menuList}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
