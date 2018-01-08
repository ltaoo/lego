import React, { Component } from 'react';
import {
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
  Card,
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

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h3>通用</h3>
        <Button>Btn</Button>
        <Icon />
        <h3>导航</h3>
        <Breadcrumb />
        <Menu />
        <Pagination />
        <Steps />
        <h3>表单</h3>
        <AutoComplete />
        <Cascader />
        <Checkbox />
        <DatePicker />
        <InputNumber />
        <Input />
        <Rate />
        <Radio />
        <Select />
        <Slider />
        <Switch />
        <TreeSelect />
        <TimePicker />
        <Transfer />
        <Upload />
        <h3>数据展示</h3>
        <Avatar />
        <Badge />
        <Calendar />
        <Card />
        <Carousel />
        <Collapse />
        <List />
        <Popover />
        <Tooltip />
        <Table />
        <Tabs />
        <Tag />
        <Timeline />
        <Tree />
        <h3>反馈</h3>
        <Alert />
        <Modal />
        <Progress />
        <Popconfirm />
        <Spin />
        <h3>其他</h3>
        <Anchor />
        <BackTop />
        <Divider />
      </div>
    );
  }
}

export default App;
