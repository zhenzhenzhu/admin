/**
 * 权限管理页面
 */
import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";

import { PAGE_SIZE } from "../../utils/constans";
import { reqRoles,reqAddRole,reqUpdateRole } from "../../api";
import AddForm from "./add-form";
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'

export default class Role extends Component {
  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // 是否显示设置权限界面
  }

  constructor (props) {
    super(props)

    //   ref容器
    this.auth = React.createRef()
  }
    
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render:(create_time)=> formateDate(create_time)
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render:formateDate
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };

  // 发送请i去获取数据
  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      // 获取数据
      const roles = result.data;
      // 更新数据
      this.setState({
        roles,
      });
    }
  };
  // 点击行的时候提示
  onRow = (role) => {
    return {
      onClick: (event) => {
        // 点击行
        console.log("row onClick()", role);
        // alert('点击行')
        this.setState({
          role,
        });
      },
    };
  };

  // 关闭弹窗
  handleCancel = () => {
    // 清除输入数据
    this.form.resetFields();
    this.setState({
      isShowAdd: false,
    });
  };

  // 添加角色
  addRole = () => {
    // 1. 校验表单，通过了处理、
    this.form.validateFields(async (err, values) => {
        if (!err) {
        //   1.1 隐藏确认框
            this.setState({isShowAdd: false})

        // 2. 搜集输入数据
          const { roleName } = values
        //   2.1 清空输入框
          this.form.resetFields();
          
        // 3. 发送请求，调用接口
            const result = await reqAddRole(roleName)
        // 4. 根据结果提示
            if (result.status === 0) {
                //  4.1 添加成功
                message.success("添加角色成功")
                const role = result.data
                // 4.11 更新roles状态,先获取roles
                const roles =this.state.roles  // 获取
                roles.push(role) // 添加
                this.setState({roles}) // 更新
            } else {
                // 4.2 添加失败 
                message.error("添加角色失败")
            }
      }
    });
  };
 
    
    // 更新角色
    updateRole =async () => {

        // 0.关闭弹窗
        this.setState({
            isShowAuth:false
        })
        // 1.获取数据 role
        const { role } = this.state
        // 2.获取最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username  // 授权人

        // 3.发送请求
        const result = await reqUpdateRole(role)
        // 4.根据结果提示
        if (result.status ===0 ) {
            // 提示信息
            message.success('更新角色成功')
            // 5.更新
            // this.getRoles()
            this.setState({
                roles:[...this.state.roles]
            })

        }
    }
  /**
   * 第一次render之前
   */
  componentWillMount() {
    this.initColumn();
  }
  componentDidMount() {
    this.getRoles();
  }
  render() {
    const { roles, role, isShowAdd,isShowAuth} = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ isShowAdd: true });
          }}
        >
          创建角色
        </Button>{" "}
        &nbsp;&nbsp;
        <Button type="primary" 
        disabled={!role._id}
        onClick={()=>{this.setState({isShowAuth:true})}}
        >
          设置角色权限
        </Button>
      </span>
    );

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: "radio",
            selectedRowKeys: [role._id],
            onSelect:(role) => {
              this.setState({
                role
              })
            }
          }}
          onRow={this.onRow}
        />

        {/* 创建角色确认框 */}
        <Modal
          title="创建角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={this.handleCancel}
        >
          <AddForm
            setForm={(form) => {
              this.form = form;
            }}
          ></AddForm>
        </Modal>
        {/* 设置角色权限确认框 */}
        <Modal
          title="设置角色权"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={()=>{this.setState({isShowAuth:false})}}
        >
          <AuthForm role = {role} ref={this.auth}></AuthForm>
        </Modal>
      </Card>
    );
  }
}
