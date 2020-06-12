/**
 * 添加角色
 */

import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'


const Item = Form.Item
class AddRole extends Component{

    static propTypes = {
        setForm:PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
          };
      
        return (
            <Form {...formItemLayout}>
            <Item label="角色名称" >
              {getFieldDecorator("roleName", {
                rules: [{ required: true, message: "角色名称必须指定!" }],
              })(<Input placeholder="请输入角色名称"></Input>)}
            </Item>
            </Form>
        )
    }
}
export default Form.create()(AddRole)