/**
 * product产品的 home的 路由组件
 */
import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
  Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button/index'
import { reqProducts,reqSearchProducts,reqUpdateStaus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constans.js'

const Option = Select.Option

export default class ProductHome extends Component{

    // 初始化数据
  state = {
        loading:false, //页面是否加载中 
        porduct:[], // 商品的数组
        total:'', // 商品的总数量
        searchName:'', // 搜索的关键字
        searchType:'productName'
    }

    // 初始化table列表
    initColumns = () => {
       this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              render:(price) => '￥' + price //当前指定了对应的属性，传入的是对应的属性值
            },
            {
              title: '状态',
              width:100,
              render: (product) => {
                const { status,_id} = product
                  return (
                    <span>
                      <Button type='primary'
                        onClick={() => this.updateStaus(_id,status === 1? 2 :1)}>
                        {status === 1 ? '下架' : '上架'}</Button>
                      <span>{status===1 ? '在售' : '已下架'}</span>
                    </span>
                )
              }
            },
            {
              title: '操作',
              width:100,
              render:(product) => {
                  return (
                      <span>
                          <LinkButton onClick = {()=> this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                          <LinkButton onClick = {()=> this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                      </span>
                  )
              }
            },
          ];
    }
    
    // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => {
    
    // 把pagename的值保存起来，可以让其他方法看到并使用
    this.pageNum = pageNum

    // 页面是否加载中 true=> 打开
    this.setState({ loading: true })
    
    // 说先判断是按什么类型搜索
    const { searchName, searchType } = this.state
    let result
    if (searchName) { // 关键字有值，说明要做分页搜索
     result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
    } else { // 一般分页
     result = await reqProducts(pageNum, PAGE_SIZE)
    }
    // 页面是否加载中 false => 关闭
    this.setState({loading:false})
     if (result.status === 0) { //说明成功
      // 取出对应数据
       const { total, list } = result.data
      //  更新装状态
       this.setState({
         total,
         porduct:list
       })
     }
    }

  // 更新指定商品的状态
  updateStaus = async (productId,status) => {
    // 发送请求获取数据
    const result = await reqUpdateStaus(productId, status)
    
    if (result.status === 0) { //说明更新成功
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }


    /**
     * // render之前
     * 为第一次render准备数据
     */
    componentWillMount() {
        this.initColumns()
  }
  /**
   * 第一次render之后，发送请求
   */
  componentDidMount() {
    this.getProducts(1)
  }
    render() {
       
          // 获取需要的数据
      const {porduct,total,loading,searchName,searchType} = this.state

        // 定义card的 title 和 extra
        // 左侧
        const title = (
            <span>
            <Select value={searchType} style={{ width: 150 }}
              onChange={value => this.setState({searchType:value}) }>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{width:150,margin:'0 15px'}} 
                value = {searchName}
                onChange ={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick = {() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        // 右侧
        const extra = (
            <Button type='primary' onClick = {()=> this.props.history.push('/product/addupdate')}>
                <Icon type='plus'></Icon>
                添加商品
           </Button>
      )
      
        return (
            <Card title={title}  extra={extra}>
             <Table 
             loading = {loading}
             bordered
             rowKey ='_id'
             dataSource={porduct} 
             columns={ this.columns} 
             pagination={{
              current:this.pageNum,
              total,
              defaultPageSize:PAGE_SIZE,
              showQuickJumper:true,
              onChange:this.getProducts
             }}
             />;
            </Card>
            )
        }
}