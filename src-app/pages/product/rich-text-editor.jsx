/**
 * 富文本编辑文本功能 richTextEditor
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


 export default class RichTextEditor extends Component {

  //  指定接受传递过来的数据
   static propTypes = {
    detail:PropTypes.string.isRequired
   }
   
  state = {
    editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象 
  }

  constructor(props) {
    super(props);
    const html = this.props.detail;
    if (html) { // 如果有值，根据html格式字符串创建一个对应的编辑对象
      const contentBlock = htmlToDraft(html);
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);
        this.state = {
          editorState,
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象 
      }
    }
  }


  //  输入过程中实时回调
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  //  获取详情内容
  getDetail = () => {
  // 返回输入数据的html格式的文本
  return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
   }

  //  上传图片
  uploadImageCallBack = (file)=>{
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText);
          // const url = response.data.url  // 和获取url
          // resolve(url);
          /**
           * 上传成功后，要对数据进行处理，处理成富文本要求的数据格式。不然，图片不会显示在虚框里面。
           */
          // 返回处理的数据
          let formData = {
            data: {
              link:response.data.url
            }
          }
          resolve(formData)
        });
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
        <Editor
        editorState={editorState}
        editorStyle={{border: '1px solid black', minHeight: 200, paddingLeft: 10}}
        onEditorStateChange={this.onEditorStateChange}
        toolbar={{
          image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
        }}
        />
    );
  }
}