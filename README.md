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
    parentName: '', // 父分类的名称
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
    parentId = parentId || this.state.parentId
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
  addCategory = async () => {
    // this.form.validateFields(async (err, values) => {
    //   if (!err) {
        // 隐藏确认框
        this.setState({
          showStatus: 0
        })

        // 收集数据, 并提交添加分类的请求
        const {parentId, categoryName} = this.form.getFieldsValue()
        // 清除输入数据
        this.form.resetFields()
        const result = await reqAddCategory(categoryName, parentId)
        if(result.status===0) {

          // 添加的分类就是当前分类列表下的分类
          if(parentId===this.state.parentId) {
            // 重新获取当前分类列表显示
            this.getCategorys()
          } else if (parentId==='0'){ // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
            this.getCategorys('0')
          }
        }
      }
  //   })
  // }

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
        const { categoryName } = values;
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
          pagination={{ defaultPageSize: 5, showQuickJumper: true }}
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
