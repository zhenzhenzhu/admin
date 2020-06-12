/**
 * product产品的 添加和更新 的路由组件
 */
import React, { Component } from "react";
import { Card, Icon, Form, Input, Cascader, Button, message } from "antd";

import { reqCategorys,reqAddOrUpdateProduct } from "../../api/index";
import PicturesWall from "./Pictures-wall ";
import RichTextEditor from "./rich-text-editor";

const { Item } = Form;
const { TextArea } = Input;

class ProductAddUpdate extends Component {
  state = {
    options: [],
  };

  constructor(props) {
    super(props);
    // 创建用来保存ref标识的标签对象属性
    this.ref = React.createRef();
    this.editor = React.createRef();
  }

  //  生成新的options
  initOptions = async (categorys) => {
    //  根据categorys，生成新的options
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));

    const { isUpdate, product } = this;
    const { pCategoryId, categroyId } = product;

    if (isUpdate && pCategoryId !== "0") {
      // 二级分类
      //   获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      //   生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      //   找到当前商品对应的一i分类的options对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );
      //   关联到对应的一级分类的options上
      targetOption.children = childOptions;
    }

    //  更新数据
    this.setState({ options });
  };

  // 获取一级/二级分类列表并显示
  getCategorys = async (parentId) => {
    const reslut = await reqCategorys(parentId);
    if (reslut.status === 0) {
      //成功
      //  获取数据
      const categorys = reslut.data;
      if (parentId === "0") {
        // 一级分类

        this.initOptions(categorys);
      } else {
        //二级分类
        return categorys;
      }
    }
  };

  //  验证价格的自定义校验函数
  validatePrice = (rule, value, callback) => {
    console.log("jiage", value);

    if (value * 1 > 0) {
      //校验通过
      callback();
    } else {
      callback("价格必须大于0");
    }
  };

  //  点击提交
  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (error, values) => {
      if (!error) {

        // 1. 收集数据, 并封装成product对象
        const {name, desc, price, categoryIds} = values
        let pCategoryId, categoryId
        if (categoryIds.length===1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        } else {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const imgs = this.ref.current.getImgs()
        const detail = this.editor.current.getDetail()

        const product = {name, desc, price, imgs, detail, pCategoryId, categoryId}

        // 如果是更新, 需要添加_id
        if(this.isUpdate) {
          product._id = this.product._id
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3. 根据结果提示
        if (result.status===0) {
          message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
          this.props.history.goBack()
        } else {
          message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
      }
    })
  }


  loadData = async (selectedOptions) => {
    //  得到选择的options对象
    const targetOption = selectedOptions[selectedOptions.length - 1];
    //  显示loading
    targetOption.loading = true;

    //  根据选择的分类。请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    //  隐藏loading
    targetOption.loading = false;

    //  判断生成一个二级列表的options
    if (subCategorys && subCategorys.length > 0) {
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      //  关联到当前的options
      targetOption.children = childOptions;
    } else {
      //当前分类没有二级分类
      targetOption.isLeaf = true;
    }

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      this.setState({
        options: [...this.state.options],
      });
    }, 1000);
  };

  componentDidMount() {
    this.getCategorys("0");
  }
  componentWillMount() {
    // 取出所带的state
    const product = this.props.location.state; // 如果是添加没有值，否则有值
    //   保存是否是更新的标识
    this.isUpdate = !!product;
    //   保存商品 (如果没有，保存的是{})
    this.product = product || {};
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isUpdate, product } = this;
    const { pCategoryId, categroyId, imgs, detail } = product;
    // 用来接受级联分类的ID数组
    const categoryIds = [];
    if (isUpdate) {
      if (pCategoryId === "0") {
        //一级分类
        // 商品是一个一级分类的商品
        categoryIds.push(pCategoryId);
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categroyId);
      }
    }

    // 编辑卡片左上角部分
    const title = (
      <span>
        <Icon
          type="arrow-left"
          style={{ marginRight: 10 }}
          onClick={() => this.props.history.goBack()}
        ></Icon>
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );

    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 }, // 右侧包裹的宽度
    };

    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "商品名称必须指定!" }],
            })(<Input placeholder="请输入商品名称"></Input>)}
          </Item>
          <Item label="商品描述">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "商品描述必须指定!" }],
            })(
              <TextArea
                placeholder="请输入商品描述"
                autoSize={{ minRows: 2, maxRows: 6 }}
              ></TextArea>
            )}
          </Item>
          <Item label="商品价格">
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                { required: true, message: "商品价格必须指定!" },
                {
                  validator: this.validatePrice,
                },
              ],
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              />
            )}
          </Item>
          <Item label="商品分类">
            {getFieldDecorator("categoryIds", {
              initialValue: categoryIds,
              rules: [{ required: true, message: "商品分类必须指定!" }],
            })(
              <Cascader
                options={this.state.options} // 需要显示的列表数据数组
                loadData={this.loadData} //当选择某个列表项,加载下一级列表的监听回调
              />
            )}
          </Item>
          <Item label="商品图片">
            <PicturesWall ref={this.ref} imgs={imgs}></PicturesWall>
          </Item>
          <Item
            label="商品详情"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
          >
            {/* 
             labelCol: { span: 2 }, // 左侧label的宽度
             wrapperCol: { span: 8 }, // 右侧包裹的宽度
            */}
            <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
          </Item>
          <Item label="商品分类">
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}
export default Form.create()(ProductAddUpdate);

/**
 * 1.子组件调用父组件的方法:将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用
 * 2.父组件调用子组件的方法:在父组件中通过ref得到子组件的标签对象(组件对象),调用其方法
 */
