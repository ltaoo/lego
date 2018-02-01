import React from 'react';
import {
  Layout,
  Button,
  Modal,
} from 'antd';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
// 代码编辑器
import MonacoEditor from 'react-monaco-editor'

import JSZipUtils from './common/jszip-utils';

import Sources from './components/Sources';
import Field from './components/Field';

import EventEmitter from './common/emitter';

import FormDemo from './demo/Form';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;

/**
 * 下载文件脚手架文件
 * @param {string} url - 文件路径
 */
function urlToPromise(url) {
  return new Promise(function(resolve, reject) {
      JSZipUtils.getBinaryContent(url, function (err, data) {
          if(err) {
              reject(err);
          } else {
              resolve(data);
          }
      });
  });
}

function getIndexPageCode(components, code) {
  const componentText = Array.from(new Set(components.map(item => item.tag))).join(', ');
  const source = 
  `import React, { Component } from 'react';
  import {
    Form,
    ${componentText},
  } from 'antd';
  
  import styles from './IndexPage.css';
  
  class IndexPage extends Component {
    constructor(props) {
      super(props);

      this.handleClick = this.handleClick.bind(this);
    }
    handleClick () {
      const { getFieldsValue } = this.props.form;
      const values = getFieldsValue();
      console.log(values);
      alert(JSON.stringify(values));
    }
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div className={styles.container}>
          ${code}
        </div>
      );
    }
  }
  
  IndexPage.propTypes = {
  };
  
  export default Form.create()(IndexPage);
  `;
  return source;
}

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
    };
    this.code = {};
  }
  componentDidMount() {
    /**
     * @param {Object} code - 代码对象 key 是 uuid val 是 code
     */
    EventEmitter.on('updateComponent', (code) => {
      const codeObj = Object.assign(this.code, code);
      this.code = codeObj;
    });
  }
  preview = (component) => {
    const { components } = this.state;
    components.push(component);
    this.setState({
        components: [...components],
    });
    EventEmitter.emit('addComponent');
  }
  previewSource = () => {
    const { components } = this.state;
    const source = this.createSource();
    this.showCodeModal();
    const code = getIndexPageCode(components, source);
    this.setState({
      code,
    });
  }
  createSource = () => {
    const codeObj = this.code;
    let source = '';
    Object.keys(codeObj).forEach(key => {
      const c = codeObj[key];
      source += c;
    })
    return source;
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
  }
  showCodeModal = () => {
    this.setState({
      codeVisible: true,
    });
  }
  hideCodeModal = () => {
    this.setState({
      codeVisible: false,
    });
  }
  formatCode = () => {
    console.log(this.editor);
    const { editor } = this.editor;
    editor.getAction('editor.action.formatDocument').run();
  }
  editorDidMount(editor, monaco) {
    // compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2016,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      typeRoots: ["node_modules/@types"]
    });

    // extra libraries
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `export declare function next() : string`,
      'node_modules/@types/external/index.d.ts');

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    })
    setTimeout(function() {
      editor.getAction('editor.action.formatDocument').run();
    }, 300);
  }
  /** 
   * 删除该组件
   */
  handleDeleteComponent = (component, index) => {
    const { components } = this.state;
    console.log(components, component, index);
    components.splice(index, 1);
    this.setState({
      components: [...components],
    });
  }
  createZip = () => {
    const { components } = this.state;
    const code = this.createSource();
    var zip = new JSZip();
    const source = getIndexPageCode(components, code);
    // / folder
    const rootDir = '/template';
    const webpackConfigJs = 'webpack.config.js';
    zip.file(webpackConfigJs, urlToPromise(`${rootDir}/${webpackConfigJs}`), { binary: true });
    const babelrcFile = 'babelrc';
    zip.file(`.${babelrcFile}`, urlToPromise(`${rootDir}/${babelrcFile}`), { binary: true });
    const packageFile = 'package.json';
    zip.file(packageFile, urlToPromise(`${rootDir}/${packageFile}`), { binary: true });
    const gitignoreFile = 'gitignore';
    zip.file(`.${gitignoreFile}`, urlToPromise(`${rootDir}/${gitignoreFile}`), { binary: true });
    // src folder
    const srcDir = '/template/src';
    zip.folder('src');
    const srcFolder = zip.folder('src');
    srcFolder.file('index.js', urlToPromise(`${srcDir}/index.js`), { binary: true });
    srcFolder.file('index.html', urlToPromise(`${srcDir}/index.html`), { binary: true });
    // src/routes
    const routesFolder = srcFolder.folder('routes');
    routesFolder.file('IndexPage.js', source);
    routesFolder.file('IndexPage.css', urlToPromise(`${srcDir}/routes/IndexPage.css`), { binary: true });
    zip.generateAsync({ type: 'blob' })
      .then(function(content) {
          // see FileSaver.js
          FileSaver.saveAs(content, "example.zip");
      });
  }
  render() {
    const { components, code } = this.state;

    const realComponents = components.map((item, i) => {
      return (
        <Field
          key={i}
          item={item}
        >
          {item.component}
        </Field>
      );
    });
    return (
      <Layout>
        <Sider>
          <Sources
            handleClick={this.preview}
            components={components}
          />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Button type="primary" onClick={this.previewSource}>查看源码</Button>
            <Button style={{ marginLeft: 20 }} type="primary" onClick={this.showModal}>预览</Button>
            <Button style={{ marginLeft: 20 }} type="primary" onClick={this.createZip}>生成代码压缩包</Button>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff' }}>
              <div style={{ height: 600 }}>
                {realComponents}
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
        <Modal
          title="demo"
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          <FormDemo />
        </Modal>
        <Modal
          title="查看代码"
          width="80%"
          visible={this.state.codeVisible}
          onOk={this.hideCodeModal}
          onCancel={this.hideCodeModal}
        >
          <div>
            <MonacoEditor
              ref={r => this.editor = r}
              height='600'
              language='javascript'
              theme='vs-dark'
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
            <Button style={{ marginLeft: 20 }} type="primary" onClick={this.createZip}>生成代码压缩包</Button>
          </div>
        </Modal>
      </Layout>
    );
  }
}

export default App;
