import React, { Component } from 'react';
import {
  // layout
  Layout,
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
import { DragSource, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Board from './components/Board';

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

class App extends Component {
  render() {
    return (
      <Layout>
        <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
            <div className="component-item">
              <Icon type="video-camera" />
              <span className="nav-text">输入框</span>
            </div>
            <div className="component-item">
              <Icon type="upload" />
              <span className="nav-text">按钮</span>
            </div>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
              <div style={{ height: 600 }}>
                <Board knightPosition={this.props.knightPosition} />
              </div>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
