import React from 'react';
import {
  // layout
  Layout,
  Row,
  Col,
  // basic
  Button,
  Icon,
  // navigation
  Breadcrumb,
  Dropdown,
  Menu,
  Pagination,
  Steps,
  // data entry
  AutoComplete,
  Cascader,
  Checkbox,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Mention,
  Rate,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  TimePicker,
  Transfer,
  Upload,
  // date display
  Avatar,
  Badge,
  Calendar,
  // Card,
  Carousel,
  Collapse,
  List,
  Popover,
  Tooltip,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tree,
  // feedback
  Alert,
  Modal,
  Message,
  notification,
  Progress,
  Popconfirm,
  Spin,
  // other
  Anchor,
  BackTop,
  Divider,
  LocaleProvider,
} from 'antd';
import styled, { injectGlobal } from 'styled-components';
// DragDropContext 应该是 drop target
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Board from './components/Board';
import wrapItem from './components/Item';
import DropContainer from './components/DropContainer';
import Sources from './components/Sources';
import FormDemo from './demo/Form';

import logo from './logo.svg';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

const container = 
  <div className="app">
    <h3>通用</h3>
    <Button>Btn</Button>
    <h3>导航</h3>
    <Pagination />
    <h3>表单</h3>
    <AutoComplete />
    <Cascader />
    <Checkbox />
    <DatePicker />
    <InputNumber />
    <Input />
    <Radio />
    <Select />
    <Slider />
    <Switch />
    <TreeSelect />
    <TimePicker />
    <h3>数据展示</h3>
    <Table />
    <Tabs />
  </div>;

const DragButton = wrapItem(
  <div className="component-item">
    <Icon type="upload" />
    <span className="nav-text">按钮</span>
  </div>, 'BUTTON');

const DragInput = wrapItem(
  <div className="component-item">
    <Icon type="upload" />
    <span className="nav-text">输入框</span>
  </div>, 'BUTTON');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      components: [],
    };
  }
  preview = (components) => {
    this.setState({
      components,
    });
  }

  /**
   * 根据组件得到源码
   */
  createSourceCode = (components) => {
    let code = '';
    for (let i = 0, l = components.length; i < l; i += 1) {
      console.log(components);
      const Component = components[i];
      if (!Component) {
        continue;
      }
      if (typeof Component === 'string') {
        continue;
      }
      const type = Component.type;
      const props = Component.props;
      const tag = type.name;
      // props
      const propsArr = [];
      Object.keys(props).forEach(key => {
        console.log(key);
      });
      console.log(propsArr);
      code += `<${tag}>`;
      if (Component.props.children) {
        code += this.createSourceCode([Component.props.children]);
      }
      code += `</${tag}>`;
    }
    console.log(code);
    return code;
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
  render() {
    const { components } = this.state;

    const realComponents = components.map(item => {
      return item.component;
    });
    return (
      <Layout>
        <Sider>
          <Sources
            handleClick={this.preview}
          />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', paddingLeft: 24 }}>
            <Button type="primary" onClick={this.createSourceCode.bind(this, realComponents)}>查看源码</Button>
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
      </Layout>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
