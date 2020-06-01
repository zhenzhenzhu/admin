/**
 * 分类管理页面
 */
import React, { Component } from "react";
import { Card, Table, Icon, Button, message, Modal } from "antd";

import LinkButton from "../../components/link-button/index";
import {
  reqCategorys,
  reqUpateCategory,
  reqAddCategory,
} from "../../api/index";
import AddForm from "./add-form";
import UpdateForm from "./update-form";

export default class Category extends Component {
  // 初始化数据
  state = {
    categorys: [], //  一级分类
    subCategorys: [], // 二级分类
    parentId: "0", // 父分类的 ID
    parentName: "", // 父分类的名称
    loading: false, // 	页面是否加载中
    showStatus: 0, // 添加/更新的弹窗是否显示  初始0=>都不显示;  1=>添加; 2=>更新
  };
  // 初始化table所有列的数据
  initColums = () => {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
      },
      {
        title: "操作",
        render: (category) => (
          //返回需要显示的界面标签
          /*
          this.showUpdate不能直接传值 => () => this.showUpdate(category)
          */
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>
              修改分类
            </LinkButton>
            {this.state.parentId === "0" ? (
              <LinkButton
                onClick={() => {
                  this.showsubCategorys(category);
                }}
              >
                查看子分类
              </LinkButton>
            ) : null}
          </span>
        ),
        width: 300,
      },
    ];
  };

  // 异步获取所有一级分类列表
  // parentId如果没指定，根据状态里的parentId请求，如果指定了，根据指定的parentId请求
  getCategorys = async (parentId) => {
    //发送数据之前，打开loding状态
    this.setState({ loading: true });

    // // 获取父分类的 ID parentId
    // const {parentId} = this.state
    // 如果传入的parentId有值。值就是传入的parentId，否则就是state里面的parentId
    parentId = parentId || this.state.parentId;

    // 发送ajax请求，获取数据 （需要用async，await）
    const result = await reqCategorys(parentId);
    console.log(result);

    //发送数据之前，关闭loding状态
    this.setState({ loading: false });

    if (result.status === 0) {
      // 说明成功
      // 获取对应的数据分类 （可能是一级/二级）
      const categorys = result.data;
      if (parentId === "0") {
        //说明是一级分类
        // 更新数据
        this.setState({ categorys });
      } else {
        //二级分类
        this.setState({
          subCategorys: categorys,
        });
      }
    } else {
      //失败
      message.error("获取一级列表失败了");
    }
  };

  // 显示指定一级分类对应的二级分类
  showsubCategorys = (category) => {
    // 1.更新状态
    this.setState(
      {
        parentId: category._id,
        parentName: category.name,
      },
      () => {
        //setstate 第二个参数是一个回调函数，在状态更新且重新render之后执行
        console.log("parentId", this.state.parentId); //此时是 正确的
        // 2.获取二级分类展示
        this.getCategorys();
      }
    );
    // setsate() 不能立即执行获取最新的状态值，setstate是异步获取更新状态的
    // console.log('parentId1',this.state.parentId); //此时是 0
  };
  // 点击显示指定的一级分类
  showCategorys = () => {
    this.setState({
      parentId: "0",
      subCategorys: [],
      parentName: "",
    });
  };
  // 关闭弹窗
  handleCancel = () => {
    // 清除输入数据
    this.form.resetFields();

    this.setState({
      showStatus: 0,
    });
  };
  // 显示添加分类弹窗
  showAdd = () => {
    this.setState({
      showStatus: 1,
    });
  };

  // 添加分类
  addCategory = () => {
    // 做校验，表单校验通过才处理
    this.form.validateFields(async (err,values) => {
      if (!err) {
        // 1.关闭弹窗
    this.setState({
      showStatus: 0,
    });
    // 2.收集数据，并提交添加分类请求 = 发送请求
    // const { parentId, parentName } = this.form.getFieldsValue();
        const { parentId, parentName } = values;
        console.log('aaaa',parentName);
        console.log('11aaaa',parentId);
        
    // 2.1.清除数据
    this.form.resetFields();

    // 2 发请求
    const result = await reqAddCategory(parentId, parentName);

    if (result.status === 0) {
      //请求成功
      // 添加的分类就是当前列表下的分类
      if (parentId === this.state.parentId) {
        // 3.重新获取当前分类列表数据显示
        this.getCategorys();
        // 在二级分类下添加一级分类，重新获取一级分类列表，但不需要显示一级列表
      } else if (parentId === "0") {
        // this.setState({ parentId: '0' }, () => {
        //   // 3.重新获取当前分类列表数据显示
        //   this.getCategorys()  // 此时会跳转到一节分类显示数据

        // })
        // 重新获取当前分类列表数据显示
        this.getCategorys("0");
      }
    }
      }
    })

    
  };

  // 显示更新的弹窗
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category;
    // 更新状态
    this.setState({
      showStatus: 2,
    });
  };

  // 更新分类
  updateCategory = () => {
    // console.log('updateCategory()');

    // 进行表单验证，验证通过才执行下面操作
    this.form.validateFields(async (err, values) => {
      if (!err) {
        //校验成功
        // 1.关闭弹窗
        this.setState({
          showStatus: 0,
        });

        // 2.0 获取数据
        const categoryId = this.category._id;
        const {categoryName} = values;
        // console.log('11',categoryId, categoryName);

        // 2.2 清除输入数据
        this.form.resetFields();

        // 2.1 发送请求
        const result = await reqUpateCategory({ categoryId, categoryName });
        if (result.status === 0) {
          //说明成功了
          // 3.重新显示列表
          this.getCategorys();
        }
      }
    });
  };
  /**
   * 第一次render之前调用
   * 为reder准备需要的数据
   */
  componentWillMount() {
    this.initColums();
  }
  /**
   * 异步获取一级分类列表数据
   * render之后执行
   * 发送请求
   */
  componentDidMount() {
    // 获取一级分类
    this.getCategorys();
  }
  render() {
    // 获取一级分类数据
    const { categorys } = this.state;

    // 获取loading
    const {
      loading,
      subCategorys,
      parentId,
      parentName,
      showStatus,
    } = this.state;

    // 获取保存的数据 category
    const category = this.category || {}; //如果没有值给空对象
    console.log("render里面获取", category);

    // Card的左侧
    // const title = "一级分类列表";
    const title =
      parentId === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
          <span>{parentName}</span>
        </span>
      );
    // Card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus"></Icon>
        添加
      </Button>
    );

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          dataSource={parentId === "0" ? categorys : subCategorys}
          columns={this.columns}
          pagination={{ defaultPageSize: 3, showQuickJumper: true }}
        />
        {/* 点击添加时的对话框 */}
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            categorys={categorys}
            parentId={parentId}
            setForm={(form) => {
              this.form = form;
            }}
          ></AddForm>
        </Modal>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {
              this.form = form;
            }}
          ></UpdateForm>
        </Modal>
      </Card>
    );
  }
}
