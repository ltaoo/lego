import React from 'react';
import {
  Layout,
  Button,
  Modal,
} from 'antd';

import Sources from './components/Sources';
import Field from './components/Field';

import FormDemo from './demo/Form';

import './App.css';

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      editorModalVisible: false,
      codeVisible: false,
      components: [],
      edittingComponent: null,
    };
  }
  preview = (component) => {
    const { components } = this.state;
    components.push(component);
    this.setState({
        components: [...components],
    });
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
  hideCodeModal = () => {
    this.setState({
      codeVisible: false,
    });
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
            <Button type="primary" >查看源码</Button>
            <Button style={{ marginLeft: 20 }} type="primary" onClick={this.showModal}>查看示例</Button>
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
          visible={this.state.codeVisible}
          onOk={this.hideCodeModal}
          onCancel={this.hideCodeModal}
        >
        </Modal>
      </Layout>
    );
  }
}

export default App;
