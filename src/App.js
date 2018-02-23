import React from 'react';
import { findDOMNode } from 'react-dom';
import { Layout, Button, Form, Modal } from 'antd';

import Sources from './components/Sources';
import Container from './components/Container';

// util
import createSourceCode from './common/create-source';
import createPageCode from './common/create-page';
import createZip from './common/create-zip';

import renderComponent from './common/renderComponent';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeVisible: false,
      previewModalVisible: false,
      code: '',
    };
    this.container = {};
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
  /**
   * 生成格式化页面代码
   */
  createCode = () => {
    const { instances } = this.container.state;
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

  render() {
    const {
      codeVisible,
      previewModalVisible,
      code,
    } = this.state;
    const { state = {} } = this.container;
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider>
          <Sources />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Button type="primary" onClick={this.previewSource}>
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
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <Container
                ref={e => this.container = e}
              />
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
          {previewModalVisible && renderComponent(state.instances, this.props)}
        </Modal>
      </Layout>
    );
  }
}

export default Form.create()(App);
