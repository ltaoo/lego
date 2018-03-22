import React from 'react';
import { findDOMNode } from 'react-dom';
import { 
  Layout, 
  Button, 
  Form, 
  Modal,
  Input
} from 'antd';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Sources from './components/Sources';
import Container from './components/Container';

import * as t from './common/actions';
import store from './store';
// util
import createSourceCode from './common/create-source';
import createPageCode from './common/create-page';
import createZip from './common/create-zip';

import renderComponent from './common/renderComponent';
import { createInstances } from './common/util';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { TextArea } = Input;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeVisible: false,
      previewModalVisible: false,
      kmsConfigModalVisible: false,
      code: '',
    };
  }
  /**
   * 预览组件
   */
  preview = () => {
    this.setState({
      previewModalVisible: true,
    });
  }
  hidePreviewModal = () => {
    this.setState({
      previewModalVisible: false,
    });
  }
  showKmsConfigModal = () => {
    this.setState({
      kmsConfigModalVisible: true,
    });
  }
  hideKmsConfigModal = () => {
    this.setState({
      kmsConfigModalVisible: false,
    });
  }
  /**
   * 生成格式化页面代码
   */
  createCode = () => {
    const { instances } = this.props;
    const code = createSourceCode(instances);
    const pageCode = createPageCode(instances, code, 'Index');
    // return pageCode;
    const formatedCode = window.prettier.format(pageCode);
    return formatedCode;
  }
  /**
   * 预览源代码
   */
  previewSource = () => {
    this.showCodeModal(() => {
      const code = this.createCode();
      this.setState({
        code: code,
      }, () => {
        const codeContainer = findDOMNode(this.codeCon);
        window.hljs.highlightBlock(codeContainer);
      });
    });
  }
  /**
   * 下载单个文件
   */
  downloadSingleFile = () => {
    const code = this.createCode();
    const blobObj = new Blob([code]);
    const downloadUrl = URL.createObjectURL(blobObj);
    const aTag = document.createElement('a');
    aTag.href = downloadUrl;
    aTag.download = 'Page.js';
    aTag.click();
  }
  showCodeModal = (cb) => {
    this.setState({
      codeVisible: true,
    }, cb);
  };
  hideCodeModal = () => {
    this.setState({
      codeVisible: false,
    });
  };
  /**
   * 生成 Zip 包
   */
  createZip = () => {
    const pageCode = this.createCode();
    createZip(pageCode);
  }
  /** 
   * 初始化 KMS 模板页
   */
  initKMSPage = () => {
    const { getFieldsValue } = this.props.form;
    const { schema, api } = getFieldsValue();
    try {
      const json = JSON.parse(schema);
      const instances = createInstances({
        schema: json,
        api,
      });
      this.hideKmsConfigModal();
      store.dispatch({
        type: t.REPLACE_INSTANCES,
        payload: instances,
      });
    } catch (err) {
      console.log(err);
    }
  }
  /** 
   * 清空所有组件
   */
  emptyCompnents = () => {
    store.dispatch({
      type: t.EMPTY_PAGE,
    });
  }

  render() {
    const {
      codeVisible,
      previewModalVisible,
      kmsConfigModalVisible,
      code,
    } = this.state;
    const {
      instances,
      form
    } = this.props;

    const { getFieldDecorator } = form;
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider>
          <Sources {...this.props} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Button 
              type="primary" 
              onClick={this.showKmsConfigModal}
            >
              初始化 KMS 模板页
            </Button>
            <Button 
              type="primary" 
              style={{ marginLeft: 20 }}
              onClick={this.previewSource}
            >
              查看源码
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: 20 }}
              onClick={this.preview}>
              预览
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.downloadSingleFile}
            >
              下载单个文件
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={this.createZip}
            >
              生成代码压缩包
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              onClick={this.emptyCompnents}
            >
              清空页面
            </Button>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <Container {...this.props} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Created by KUJIALE
          </Footer>
        </Layout>
        <Modal
          title="查看代码"
          width="80%"
          visible={codeVisible}
          onOk={this.hideCodeModal}
          onCancel={this.hideCodeModal}
          footer={null}
        >
          <div>
            <pre><code ref={e => this.codeCon = e} className="jsx">{code}</code></pre>
          </div>
        </Modal>
        <Modal
          visible={previewModalVisible}
          onOk={this.hidePreviewModal}
          onCancel={this.hidePreviewModal}
          closable={false}
          footer={null}
          width="90%"
        >
          {previewModalVisible && renderComponent(instances, this.props)}
        </Modal>
        <Modal
          title="新建 KMS 页面"
          visible={kmsConfigModalVisible}
          onOk={this.initKMSPage}
          onCancel={this.hideKmsConfigModal}
          closable={false}
        >
          <Form.Item label="字段(JSON)">
            {getFieldDecorator('schema', {
              initialValue: 
`{
  "id": 0,
  "title": "这是第一个 Banner",
  "pic": "//www.kujiale.com/img.jpg",
  "url": "//www.kujiale.com"
}`,
            })(
              <TextArea
                style={{ height: 300 }}
              />
            )}
          </Form.Item>
          <Form.Item label="API 地址">
            {getFieldDecorator('api', {
              initialValue: 'https://easy-mock.com/mock/59b77cf5e0dc663341a6b6c2/example/ary',
            })(
              <Input />
            )}
          </Form.Item>
        </Modal>
      </Layout>
    );
  }
}

export default DragDropContext(HTML5Backend)(Form.create()(App));
