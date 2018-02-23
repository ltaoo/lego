/**
 * @file 提供实例对象的组件
 * @author wuya
 */
import React, { Component } from 'react';
import { Input } from 'antd';

import * as lib from './lib';
import './index.css';
import addComponent from '../../common/add-component';
import Item from './DragSource';

const COMPONENT_MAP = {};
for (let key in lib.optimize) {
  COMPONENT_MAP[key] = lib.optimize[key].default;
}

class Source extends Component {
  handleClick = tag => {
    addComponent(tag);
  };

  render() {
    const items = Object.keys(lib.optimize).map((key, i) => {
      const item = lib.optimize[key].default();
      return (
        <Item
          key={i}
          item={item}
          handleClick={this.handleClick.bind(this, item.label)}
        />
      );
    });
    return (
      <div className="sidebar">
        <div className="sidebar__search">
          <Input placeholder="筛选组件" />
        </div>
        <ul className="sidebar__components">
          {items}
        </ul>
      </div>
    );
  }
}

export default Source;
