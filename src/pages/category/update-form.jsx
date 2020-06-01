import React, { Component } from 'react'
import{Form,Select,Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option
class UpdateForm extends Component{
    
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
      }

    // 什么时候传递？
    componentWillMount() {
      // 将form对象通过setForm()传递父组件
      this.props.setForm(this.props.form)
    }
    render() {
        
        const { getFieldDecorator } = this.props.form;
        // 获取 categoryName
        const {categoryName} = this.props
        // console.log('update',categoryName);
        
        return (
            <Form>
                <Item>
                    {getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules: [
                            {required:true ,message:'分类名称必须输入'}
                        ]
                    })(
                    <Input placeholder='请输入分类名称'></Input>
                    )}
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)