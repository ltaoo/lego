import React from 'react';
import { Layout, Button, Modal } from 'antd';
// 代码编辑器
import MonacoEditor from 'react-monaco-editor';

import Sources from './components/Sources';
import Container from './components/Container';

// util
import EventEmitter from './common/emitter';
import createSourceCode from './common/create-source';
import createPageCode from './common/create-page';
import createZip from './common/create-zip';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;

/**
 * 递归更新属性
 * @param {*} uuid 
 * @param {*} instances 
 * @param {*} fieldProps 
 * @param {*} props 
 */
function updateProps(uuid, instances, fieldProps, props) {
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      instance.fieldProps = Object.assign({}, instance.fieldProps, fieldProps);
      instance.props = Object.assign({}, instance.props, props);
      break;
    }
    if (instance.children && instance.children.length) {
      updateProps(uuid, instance.children, fieldProps, props);
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      code: '',
      editorModalVisible: false,
      codeVisible: false,
      instances: [],
      edittingComponent: null,
      currentContainer: null,
    };
  }

  addComponent = (instance) => {
    EventEmitter.emit('addComponent', instance);
  }

  componentDidMount() {
    const { instances } = this.state;
    EventEmitter.on('updateProps', (item, value) => {
      const { uuid } = item;
      const { fieldProps: newFieldProps, props: newProps } = value;

      // 递归寻找 uuid 对应的那个实例对象并更新 fieldProps 和 props
      updateProps(uuid, instances, newFieldProps, newProps);
    });
  }
  /**
   * 预览源代码
   */
  previewSource = () => {
    const { instances } = this.container.state;
    const code = createSourceCode(instances);
    const pageCode = createPageCode(instances, code, 'Index');
    this.setState({
      code: pageCode,
    });
    this.showCodeModal();
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
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
   * 格式化代码
   */
  formatCode = () => {
    console.log(this.editor);
    const { editor } = this.editor;
    editor.getAction('editor.action.formatDocument').run();
  };
  /**
   * 生成 Zip 包
   */
  createZip = () => {
    const { instances } = this.state;
    const code = this.createSource();
    createZip(instances, code, 'Page');
  };
  render() {
    const { instances, code } = this.state;
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider>
          <Sources handleClick={this.addComponent} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Button type="primary" onClick={this.previewSource}>
              查看源码
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
          visible={this.state.codeVisible}
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
      </Layout>
    );
  }
}

export default App;
