/**
 * @file 提供实例对象的组件
 * @author wuya
 */
import React, { Component } from 'react';

import * as lib from './lib';
import './index.css';

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
      ...COMPONENT_MAP[tag],
    };

    uuid += 1;
    this.props.handleClick(instance);
  };

  render() {
    const items = Object.keys(lib.optimize).map((key, i) => {
      const item = lib.optimize[key].default;
      return (
        <li
          key={i}
          className="sidebar__component"
          onClick={this.handleClick.bind(this, item.label)}
        >
          {item.label}
        </li>
      );
    });
    return (
      <div className="sidebar">
        <ul className="sidebar__components">
          {items}
        </ul>
      </div>
    );
  }
}

export default Source;
