import React from 'react';
import { Layout, Button, Modal } from 'antd';
// 代码编辑器
import MonacoEditor from 'react-monaco-editor';

import Sources from './components/Sources';
import Container from './components/Container';

// util
import EventEmitter from './common/emitter';
import getIndexPageCode from './common/create-page';
import createZip from './common/create-zip';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      code: '',
      editorModalVisible: false,
      codeVisible: false,
      components: [],
      edittingComponent: null,
      currentContainer: null,
    };
    this.code = {};
  }
  componentDidMount() {
    /**
     * @param {Object} code - 代码对象 key 是 uuid val 是 code
     */
    EventEmitter.on('updateComponent', code => {
      const codeObj = Object.assign(this.code, code);
      this.code = codeObj;
    });
  }
  /**
   * 添加组件，生成代码时需要用到，todo: 从 store 中获取
   */
  addComponent = obj => {
    const { components, currentContainer } = this.state;
    // 如果是容器组件
    if (currentContainer && currentContainer.container === 'true') {
      currentContainer.children = currentContainer.children || [];
      currentContainer.children.push(obj);
    } else {
      components.push(obj);
    }
    this.setState({
      components: [...components],
    });
    EventEmitter.emit('addComponent', obj);
  };
  /**
   * 预览源代码
   */
  previewSource = () => {
    const { components } = this.state;
    const source = this.createSource();
    this.showCodeModal();
    const code = getIndexPageCode(components, source, 'Page');
    this.setState({
      code,
    });
  };
  /**
   * 根据组件生成源代码
   */
  createSource = () => {
    const codeObj = this.code;
    let source = '';
    Object.keys(codeObj).forEach(key => {
      const c = codeObj[key];
      source += `${c}\n`;
    });
    return source;
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
   * 编辑器加载完成事件
   * @param {*} editor 
   * @param {*} monaco 
   */
  editorDidMount(editor, monaco) {
    // compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ['node_modules/@types'],
    });

    // extra libraries
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `export declare function next() : string`,
      'node_modules/@types/external/index.d.ts',
    );

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    setTimeout(function() {
      editor.getAction('editor.action.formatDocument').run();
    }, 300);
  }
  /**
   * 生成 Zip 包
   */
  createZip = () => {
    const { components } = this.state;
    const code = this.createSource();
    createZip(components, code, 'Page');
  };
  /**
   * 切换容器
   */
  switchContainer = (item, checked) => {
    this.setState({
      currentContainer: checked ? item : this,
    });
  }
  render() {
    const { components, code } = this.state;
    return (
      <Layout style={{ height: '100vh' }}>
        <Sider>
          <Sources handleClick={this.addComponent} components={components} />
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
                components={components}
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
              onChange={this.onChange}
              editorDidMount={this.editorDidMount}
              options={{
                formatOnType: true,
                language: 'javascript',
                minimap: false,
                readOnly: true,
                autoIndent: true,
              }}
            />
          </div>
        </Modal>
      </Layout>
    );
  }
}

export default App;
