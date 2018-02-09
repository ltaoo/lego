import React from 'react';
import { Layout, Button, Form, Modal } from 'antd';
// 代码编辑器
import MonacoEditor from 'react-monaco-editor';

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
      visible: false,
      codeVisible: false,
      previewModalVisible: false,
      code: '',
      edittingComponent: null,
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
   * 预览源代码
   */
  previewSource = () => {
    const { instances } = this.container.state;
    const code = createSourceCode(instances);
    const pageCode = createPageCode(instances, code, 'Index');
    const formatedCode = window.prettier.format(pageCode);
    this.setState({
      code: formatedCode,
    });
    this.showCodeModal();
  };
  showCodeModal = () => {
    this.setState({
      codeVisible: true,
    });
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
    const { instances } = this.container.state;
    const code = createSourceCode(instances);
    const pageCode = createPageCode(instances, code, 'Index');
    createZip(pageCode);
  }

  render() {
    const {
      codeVisible,
      previewModalVisible,
      code,
    } = this.state;
    const { state = {} } = this.container;
    const { instances = [] } = state;
    const content = renderComponent(instances, this.props);
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
            <Button type="primary"
              style={{ marginLeft: 20 }}
              onClick={this.preview}>
              预览
            </Button>
            <Button
              style={{ marginLeft: 20 }}
              type="primary"
              onClick={this.createZip}
            >
              生成代码压缩包
            </Button>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <Container
                ref={e => this.container = e}
                instances={instances}
              />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
        <Modal
          title="查看代码"
          width="80%"
          visible={codeVisible}
          onOk={this.hideCodeModal}
          onCancel={this.hideCodeModal}
        >
          <div>
            <MonacoEditor
              ref={r => (this.editor = r)}
              height="600"
              language="javascript"
              theme="vs-dark"
              value={code}
              options={{
                language: 'javascript',
                minimap: false,
                readOnly: true,
              }}
            />
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
          {content}
        </Modal>
      </Layout>
    );
  }
}

export default Form.create()(App);
