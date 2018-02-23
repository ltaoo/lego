/**
 * @file 提供实例对象的组件
 * @author wuya
 */
import React, { Component } from 'react';
import { Input } from 'antd';

import * as lib from './lib';
import './index.css';
import EventEmitter from '../../common/emitter';
import Item from './DragSource';

const COMPONENT_MAP = {};
for (let key in lib.optimize) {
  COMPONENT_MAP[key] = lib.optimize[key].default;
}

let uuid = 1;

class Source extends Component {
  handleClick = tag => {
    // 新增组件
    const instance = {
      uuid,
      tag,
      ...COMPONENT_MAP[tag]({
        uuid,
      }),
    };

    uuid += 1;
    // 啊啊啊，这里不应该这么 low
    if (tag === 'Upload') {
      // 1 是给 Upload 里面的 Button
      uuid += 1;
    }
    EventEmitter.emit('addComponent', instance);
  };

  render() {
    const items = Object.keys(lib.optimize).map((key, i) => {
      const item = lib.optimize[key].default();
      return (
        <Item
          key={i}
          item={item}
          onClick={this.handleClick.bind(this, item.label)}
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
